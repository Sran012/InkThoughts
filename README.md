# InkThoughts
![example](https://github.com/Sran012/InkThoughts/blob/main/client/public/Screenshot%202025-09-16%20151722.png)

A minimal blog app built with:

- **Frontend** → React (Vite)
- **Backend** → Hono.js (Cloudflare Workers) + Prisma + PostgreSQL
- **Shared** → TypeScript utilities in `common/`

---
## 📂 Project Structure
```bash
InkThoughts/
├── client/        # React frontend
├── backend/       # Hono.js + Prisma (Cloudflare Worker)
│   ├── prisma/    # Prisma schema + migrations
│   └── src/       # Routes / handlers
├── common/        # Shared types/utilities
└── README.md
```

![example](https://github.com/Sran012/InkThoughts/blob/main/client/public/Screenshot%202025-09-16%20151624.png)

---

## ⚙️ Setup

## 1. Clone repo

```bash
git clone https://github.com/Sran012/InkThoughts.git
cd InkThoughts

# frontend
cd client
npm install

# backend
cd ../backend
npm install
```
## 2. Create backend/.env
### Local direct PostgreSQL connection & Auth secret (only for local dev)
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/inkthoughts"

JWT_SECRET="dev-secret"
```bash
npx prisma generate
npx prisma db push
```

### Run locally 
```bash
wrangler dev
```

## 3. Change the API url at client/src/config.ts
```bash
BACKEND_URL=http://localhost:8787
```


## Cloudflare workers (for deploying)
### Edit these
Uses wrangler.jsonc (or wrangler.toml) for env variables.
