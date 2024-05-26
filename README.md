# docker
postgres:15.7


# prisma
npx prima init

crear modelo en ./prisma/schema.prisma

ejecutar migración

npx prima migrate dev

npx prima generate

acualizaciones del schema con
npx prisma migrate dev --name nombre_del_cambio


1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run npx prisma db pull to turn your database schema into a Prisma schema.
4. Run npx prisma generate to generate the Prisma Client. You can then start querying your database.
