# Authentication APIs

## Overview
Node.js backend service that provides authentication and dashboard functionality application. It handles user registration, email verification, authentication, password management, and profile management.

## Features
- User registration with email verification
- Email verification via magic links
- Login with email/password
- Password reset functionality
- JWT-based authentication with refresh tokens
- User profile management
- Turnstile verification for bot protection

## Tech Stack
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **Nodemailer** - Email sending
- **Express Validator** - Request validation

## Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL database
- SMTP server for sending emails
- Cloudflare Turnstile account (for bot protection)

## Installation

### Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
- DATABASE_URL=
- ORIGIN_URL="http://localhost:5173"
- PORT=3001
- JWT_SECRET=""
- JWT_REFRESH_SECRET=""
- URL_ADDRESS="http://localhost"
- TURNSTILE_SECRET_KEY=
- SMTP_HOST=
- SMTP_PORT=
- SMTP_USER=
- SMTP_PASS=
