Quickstart
MySQL

Copy Markdown
Open
Create a new TypeScript project from scratch by connecting Prisma ORM to MySQL and generating a Prisma Client for database access

MySQL is a popular open-source relational database. In this guide, you will learn how to set up a new TypeScript project from scratch, connect it to MySQL using Prisma ORM, and generate a Prisma Client for easy, type-safe access to your database.

This guide also applies to MariaDB, which is MySQL-compatible.

Prerequisites
You also need:

A MySQL database server running and accessible
Database connection details (host, port, username, password, database name)
1. Create a new project

mkdir hello-prisma
cd hello-prisma
Initialize a TypeScript project:

npm
pnpm
yarn
bun

npm init
npm install typescript tsx @types/node --save-dev
npx tsc --init
2. Install required dependencies
Install the packages needed for this quickstart:

npm
pnpm
yarn
bun

npm install prisma @types/node --save-dev
npm install @prisma/client @prisma/adapter-mariadb dotenv
Here's what each package does:

prisma - The Prisma CLI for running commands like prisma init, prisma migrate, and prisma generate
@prisma/client - The Prisma Client library for querying your database
@prisma/adapter-mariadb - The MySQL/MariaDB driver adapter that connects Prisma Client to your database
dotenv - Loads environment variables from your .env file
3. Configure ESM support
Update tsconfig.json for ESM compatibility:

tsconfig.json

{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
Update package.json to enable ESM:

package.json

{
  "type": "module"
}
4. Initialize Prisma ORM
You can now invoke the Prisma CLI by prefixing it with npx:

npm
pnpm
yarn
bun

npx prisma
Next, set up your Prisma ORM project by creating your Prisma Schema file with the following command:

npm
pnpm
yarn
bun

npx prisma init --datasource-provider mysql --output ../generated/prisma
This command does a few things:

Creates a prisma/ directory with a schema.prisma file containing your database connection and schema models
Creates a .env file in the root directory for environment variables
Creates a prisma.config.ts file for Prisma configuration
The generated prisma.config.ts file looks like this:

prisma.config.ts

import "dotenv/config";
import { defineConfig, env } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
The generated schema uses the ESM-first prisma-client generator with a custom output path:

prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
datasource db {
  provider = "mysql"
}
Update your .env file with your MySQL connection string details:

.env

DATABASE_URL="mysql://username:password@localhost:3306/mydb"
DATABASE_USER="username"
DATABASE_PASSWORD="password"
DATABASE_NAME="mydb"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
Replace the placeholders with your actual database credentials:

username: Your MySQL username
password: Your MySQL password
localhost:3306: Your MySQL host and port
mydb: Your database name
5. Define your data model
Open prisma/schema.prisma and add the following models:

prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
datasource db {
  provider = "mysql"
}
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String? @db.Text
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
6. Create and apply your first migration
Create your first migration to set up the database tables:

npm
pnpm
yarn
bun

npx prisma migrate dev --name init
This command creates the database tables based on your schema.

Now run the following command to generate the Prisma Client:

npm
pnpm
yarn
bun

npx prisma generate
7. Instantiate Prisma Client
Now that you have all the dependencies installed, you can instantiate Prisma Client. You need to pass an instance of the Prisma ORM driver adapter adapter to the PrismaClient constructor:

lib/prisma.ts

import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });
export { prisma };
8. Write your first query
Create a script.ts file to test your setup:

script.ts

import { prisma } from "./lib/prisma";
async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      posts: {
        create: {
          title: "Hello World",
          content: "This is my first post!",
          published: true,
        },
      },
    },
    include: {
      posts: true,
    },
  });
  console.log("Created user:", user);
  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
Run the script:

npm
pnpm
yarn
bun

npx tsx script.ts
You should see the created user and all users printed to the console!

9. Explore your data with Prisma Studio
Prisma Studio is a visual editor for your database. Launch it with:


npx prisma studio
Next steps
You've successfully set up Prisma ORM. Here's what you can explore next:

Learn more about Prisma Client: Explore the Prisma Client API for advanced querying, filtering, and relations
Database migrations: Learn about Prisma Migrate for evolving your database schema
Performance optimization: Discover query optimization techniques
Build a full application: Check out our framework guides to integrate Prisma ORM with Next.js, Express, and more
Join the community: Connect with other developers on Discord
More info
