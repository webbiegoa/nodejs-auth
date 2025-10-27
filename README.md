
# scc-portal-api

# EXPRESS INSTALLATION
npm install express --save
npm install --save-dev @types/express

# RUN EXPRESS - Development mode:
npm run dev

# RUN EXPRESS - Production build and run:
npm run build
npm start

### Local Url
http://localhost:3001/

### Install typescript
npm install --save-dev typescript ts-node @types/node
npx tsc --init 

### Compile typescript
npx tsc

## INSTALL PM2
npm install pm2@latest -g

pm2 start dist/server.js --name "scc-portal-api" --watch

But don't use --watch in production — it can slow things down or restart unnecessarily.

### Set up Prisma ORM

npm install prisma typescript tsx @types/node --save-dev

### Install Prisma Client
npm install prisma @prisma/client@latest @prisma/extension-accelerate@latest

### Prisma Studio
npx prisma studio

### Prisma Generate and Push
npx prisma generate

### Generate Migration 
npx prisma migrate dev --name {migration name}}

### Install cors
npm install cors --save
npm i --save-dev @types/cors

### Install dotenv
npm install dotenv --save

### Install stytch  
npm install stytch

### Install JWT
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

### Express Validator
npm install express-validator

### Axios
npm install axios

### Nodemailer
npm install nodemailer
npm i --save-dev @types/nodemailer

### HTTP Status Codes
npm install http-status-codes
npm i --save-dev @types/http-status-codes

### Cookie Parser
npm install cookie-parser
npm install --save-dev @types/cookie-parser

### Date Fns
npm install date-fns
