# DevFlow - Advanced Agile SaaS Application 🚀

DevFlow is a robust, full-stack multi-tenant SaaS application designed to help teams manage workspaces, projects, agile sprints, and task tracking seamlessly. It includes advanced real-time kanban boards, rich analytics, and comprehensive Role-Based Access Control (RBAC).

## Architecture & Tech Stack

DevFlow is built using modern, production-ready technologies:
- **Frontend**: Next.js 14, React, Tailwind CSS, Zustand (State Management), `@dnd-kit` (Kanban Drag and Drop), Recharts (Analytics).
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MySQL, Prisma ORM.
- **Authentication**: Firebase Auth (Google Sign In, Email/Password, Tokens).

## Key Modules

- **Authentication Module**: Secure token verification middleware, protected routes, and session management.
- **Workspace & Project Management**: Multi-tenant architecture allowing users to create workspaces, invite members, and build projects.
- **Agile Task & Sprint Tracking**: Native support for Sprints, Subtasks, and interactive Kanban boards.
- **Analytics & Reporting**: Deep insights into team productivity, sprint burndown charts, and native CSV exports.

## Folder Structure

```
DevFlow/
├── frontend/             # Next.js Application
│   ├── src/
│   │   ├── app/          # App router pages (dashboard, auth, etc.)
│   │   ├── components/   # Reusable UI components (Kanban, Sidebar, etc.)
│   │   ├── lib/          # Utilities and Firebase config
│   │   └── store/        # Zustand global state (workspaces, projects, analytics)
│   └── package.json
└── backend/              # Express.js REST API
    ├── prisma/           # Database schema and migrations
    ├── src/
    │   ├── controllers/  # API route logic (projects, sprints, tasks, analytics)
    │   ├── middleware/   # Auth and RBAC middleware
    │   ├── routes/       # Express router definitions
    │   └── index.ts      # Server entry point
    └── package.json
```

## Local Installation Guide

### Prerequisites
- Node.js (v18+)
- MySQL instance running locally or via Docker
- A Firebase project

### 1. Database Setup
Ensure you have a MySQL server running. Create an empty database for DevFlow.

### 2. Environment Variables

**Backend (`backend/.env`):**
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/devflow"
PORT=8080
```
*Note: Ensure you place your Firebase Admin SDK service account JSON somewhere accessible if implementing robust admin verification, though currently tokens are verified via the frontend config for simplicity in this MVP.*

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

### 3. Start the Backend
```bash
cd backend
npm install
# Sync the Prisma schema to your local MySQL database
npx prisma db push
# Generate the Prisma Client
npx prisma generate
# Start the development server
npm run dev
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to view the application!

## Security & API Design
- **RBAC**: Handled dynamically at the Workspace level. Members can be `ADMIN`, `MANAGER`, or `DEVELOPER`.
- **Validation**: Strict schema validation using `Zod` intercepts malformed payloads before they reach the controllers.
- **Data Integrity**: Enforced heavily through Prisma relations (e.g. `onDelete: Cascade` and indices).
