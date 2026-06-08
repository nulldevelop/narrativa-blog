/**
 * Converte a coluna `content` da tabela `article` de Markdown para HTML
 * dentro de um dump SQL (mysqldump), gerando um novo arquivo .sql.
 *
 * Uso:
 *   npx tsx scripts/convert-dump-markdown.ts [arquivoEntrada.sql] [arquivoSaida.sql]
 *
 * Padrao:
 *   entrada: public/u374693758_narrativa.sql
 *   saida:   public/u374693758_narrativa.converted.sql
 *
 * - Faz parsing real das strings SQL (respeita escapes \n \' \\ etc).
 * - Converte apenas o 5o valor (indice 4 = `content`) de cada linha do INSERT.
 * - Pula linhas que JA estao em HTML (idempotente / seguro para conteudo novo).
 * - Nao toca em nenhuma outra tabela ou coluna.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

const INPUT = path.resolve(process.argv[2] || 'public/u374693758_narrativa.sql')
const OUTPUT = path.resolve(
  process.argv[3] || 'public/u374693758_narrativa.converted.sql',
)

// Ordem das colunas no dump: id(0), title(1), slug(2), subtitle(3), content(4), ...
const CONTENT_INDEX = 4
const INSERT_MARKER = 'INSERT INTO `article` VALUES'

marked.setOptions({ gfm: true, breaks: true })

interface ContentLiteral {
  start: number // offset da aspa de abertura
  end: number // offset logo apos a aspa de fechamento
  value: string // valor decodificado (markdown real)
}

/** Le uma string SQL a partir da aspa de abertura em s[i]. */
function parseString(s: string, i: number): { value: string; end: number } {
  let value = ''
  let j = i + 1
  while (j < s.length) {
    const c = s[j]
    if (c === '\\') {
      const n = s[j + 1]
      switch (n) {
        case '0':
          value += '\0'
          break
        case 'n':
          value += '\n'
          break
        case 'r':
          value += '\r'
          break
        case 't':
          value += '\t'
          break
        case 'b':
          value += '\b'
          break
        case 'Z':
          value += '\x1a'
          break
        case '\\':
          value += '\\'
          break
        case "'":
          value += "'"
          break
        case '"':
          value += '"'
          break
        default:
          value += n ?? ''
      }
      j += 2
      continue
    }
    if (c === "'") {
      if (s[j + 1] === "'") {
        value += "'"
        j += 2
        continue
      }
      return { value, end: j + 1 }
    }
    value += c
    j++
  }
  throw new Error(`String SQL nao terminada na posicao ${i}`)
}

/** Re-escapa um valor para uma string literal SQL valida. */
function encodeString(v: string): string {
  let out = "'"
  for (const ch of v) {
    switch (ch) {
      case '\\':
        out += '\\\\'
        break
      case "'":
        out += "\\'"
        break
      case '\n':
        out += '\\n'
        break
      case '\r':
        out += '\\r'
        break
      case '\t':
        out += '\\t'
        break
      case '\0':
        out += '\\0'
        break
      case '\x1a':
        out += '\\Z'
        break
      default:
        out += ch
    }
  }
  return out + "'"
}

const isWs = (c: string) => c === ' ' || c === '\t' || c === '\n' || c === '\r'

/**
 * Correcoes pontuais de markup irrecuperavel por regra geral (contagem errada
 * de asteriscos na origem). Aplicadas no markdown decodificado, antes de tudo.
 */
const MANUAL_PATCHES: [string, string][] = [
  // #1 "O que Sergio Moro...": ha um *** orfao sobrando no fim.
  ['futuro do Paraná.***\n***', 'futuro do Paraná.***'],
  // #3 "Calcadao da Rua XV": "****Historia** **" -> "**Historia**"
  ['****História** **', '**História**'],
]

/**
 * Conserta delimitadores de negrito/italico (** ou ***) separados do seu texto
 * por espacos ou quebras de linha — markdown malformado que impede o negrito.
 *
 * Faz um scan com ESTADO: sabe se cada `**`/`***` e abertura ou fechamento e
 * cola no lado certo:
 *   abertura  -> remove espacos/quebras DEPOIS do marcador  ("**\nFoo" -> "**Foo")
 *   fechamento-> remove espacos/quebras ANTES  do marcador  ("Foo\n**" -> "Foo**")
 *
 * Atua apenas em sequencias de exatamente 2 ou 3 asteriscos (nunca em italico
 * simples `*` nem em listas `- `/`* `, e ignora runs de 4+ que sao tratados
 * pelos MANUAL_PATCHES).
 */
function normalizeEmphasis(md: string): string {
  let out = ''
  let i = 0
  let open = false
  while (i < md.length) {
    if (md[i] === '*') {
      let j = i
      while (md[j] === '*') j++
      const run = j - i
      if (run === 2 || run === 3) {
        if (!open) {
          out += md.slice(i, j) // marcador de abertura
          open = true
          i = j
          while (i < md.length && isWs(md[i])) i++ // cola no texto seguinte
          continue
        }
        out = out.replace(/[ \t\r\n]+$/, '') // cola no texto anterior
        out += md.slice(i, j) // marcador de fechamento
        open = false
        i = j
        continue
      }
      out += md.slice(i, j) // run de 1 ou 4+: mantem
      i = j
      continue
    }
    out += md[i]
    i++
  }
  return out
}

/** Detecta se o conteudo ja parece HTML (nao deve ser reconvertido). */
function looksLikeHtml(v: string): boolean {
  return /<(p|div|h[1-6]|ul|ol|li|figure|img|br|strong|em|blockquote|span|table)\b[^>]*>/i.test(
    v,
  )
}

/**
 * A partir de `from` (logo apos o marcador INSERT ... VALUES), percorre todas
 * as tuplas e coleta os literais da coluna content. Retorna tambem o offset
 * do fim do statement.
 */
function collectContentLiterals(
  s: string,
  from: number,
): { literals: ContentLiteral[]; end: number } {
  const literals: ContentLiteral[] = []
  let i = from
  while (i < s.length && s[i] !== '(') i++

  while (i < s.length && s[i] === '(') {
    i++ // entra na tupla
    let valIndex = 0
    while (i < s.length) {
      while (i < s.length && isWs(s[i])) i++
      if (s[i] === ')') {
        i++ // fim da tupla
        break
      }
      if (s[i] === "'") {
        const start = i
        const r = parseString(s, i)
        if (valIndex === CONTENT_INDEX) {
          literals.push({ start, end: r.end, value: r.value })
        }
        i = r.end
      } else {
        // NULL / numero / token: vai ate , ou ) fora de string
        while (i < s.length && s[i] !== ',' && s[i] !== ')') i++
      }
      while (i < s.length && isWs(s[i])) i++
      if (s[i] === ',') {
        i++
        valIndex++
        continue
      }
      if (s[i] === ')') {
        i++ // fim da tupla
        break
      }
    }
    // depois da tupla: ',' (proxima) ou ';' (fim do statement)
    while (i < s.length && isWs(s[i])) i++
    if (s[i] === ',') {
      i++
      while (i < s.length && isWs(s[i])) i++
      continue
    }
    if (s[i] === ';') {
      i++
      break
    }
    break
  }
  return { literals, end: i }
}

function main() {
  const sql = readFileSync(INPUT, 'utf8')

  // Coleta todos os literais de content de todos os INSERTs da tabela article.
  const all: ContentLiteral[] = []
  let searchFrom = 0
  while (true) {
    const idx = sql.indexOf(INSERT_MARKER, searchFrom)
    if (idx === -1) break
    const { literals, end } = collectContentLiterals(
      sql,
      idx + INSERT_MARKER.length,
    )
    all.push(...literals)
    searchFrom = end
  }

  if (all.length === 0) {
    console.error(
      'Nenhum INSERT da tabela `article` encontrado. Verifique o arquivo de entrada.',
    )
    process.exit(1)
  }

  let converted = 0
  let skipped = 0

  // Aplica de tras para frente para nao invalidar offsets.
  const ordered = [...all].sort((a, b) => b.start - a.start)
  let out = sql
  for (const lit of ordered) {
    if (looksLikeHtml(lit.value)) {
      skipped++
      continue
    }
    let raw = lit.value
    for (const [from, to] of MANUAL_PATCHES) raw = raw.split(from).join(to)
    const html = (marked.parse(normalizeEmphasis(raw)) as string).trim()
    const replacement = encodeString(html)
    out = out.slice(0, lit.start) + replacement + out.slice(lit.end)
    converted++
  }

  writeFileSync(OUTPUT, out, 'utf8')

  console.log('Conversao concluida.')
  console.log(`  Linhas de article encontradas : ${all.length}`)
  console.log(`  Convertidas (markdown -> HTML): ${converted}`)
  console.log(`  Puladas (ja em HTML)          : ${skipped}`)
  console.log(`  Arquivo gerado                : ${OUTPUT}`)
}

main()
