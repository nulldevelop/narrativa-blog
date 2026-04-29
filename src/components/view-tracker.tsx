'use client'

import { useEffect, useRef } from 'react'
import { incrementArticleViews } from '@/app/(public)/_data-access/increment-views'

export function ViewTracker({ slug }: { slug: string }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return

    const sessionKey = `viewed_article_${slug}`
    if (!sessionStorage.getItem(sessionKey)) {
      hasTracked.current = true
      sessionStorage.setItem(sessionKey, 'true')
      incrementArticleViews(slug)
    }
  }, [slug])

  return null
}
