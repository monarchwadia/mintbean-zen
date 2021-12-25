# Development 

First copy the `.env` file

```
cp .env.sample .env
```

Then, modify the `DATABASE_URL` if needs be.

Then, create the database

```bash
psql -U postgres
create database mintbean_simple
```

Then, run `yarn prisma db push` to create the schemas

Then, run `yarn seed` to seed the database

Tada.