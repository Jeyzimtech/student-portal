# 🏫 CABS Primary Connect — School Management System

A comprehensive, state-of-the-art school management platform designed for **CABS Primary School**. This unified web application streamlines academic operations, student engagement, and financial management through a robust set of portals and analytics tools.

---

## 🛠️ Developed By
Developed and maintained by **[Teramark.tech](https://teramark.tech)**.
Our mission is to provide premium digital solutions that empower educational institutions.

---

## 🚀 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 + shadcn/ui (Premium Design System) |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **State Management** | React Context API + TanStack Query |
| **Animations** | Framer Motion |
| **Charts** | Recharts (Financial & Performance Analytics) |
| **Deployment** | Vercel |

---

## ✨ Core Features

- **📊 Management Dashboard** — Real-time analytics on pass rates, grade distribution, enrollment trends, and financial performance.
- **👨‍🎓 Student Portal** — Secure access for students to view results, download e-learning materials, and track fee statements.
- **👨‍🏫 Teacher Portal** — Dedicated interface for managing class registers, uploading results, and sharing e-learning content.
- **📄 E-Learning Platform** — Course management with multi-document upload support (PDFs, Notes, etc.).
- **💰 Financial Suite** — Complete tracking of fee payments, outstanding balances, and collection analytics by grade.
- **📅 Smart Timetables** — Integrated class and exam schedules accessible across all user roles.
- **📱 Fully Responsive** — Optimized experience across mobile, tablet, and desktop devices.

---

## 📦 Installation & Setup

### 1. Prerequisites
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher

### 2. Clone the Repository
```bash
git clone https://github.com/teramark-tech/cabs-primary-connect.git
cd cabs-primary-connect
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
The system is pre-configured with Firebase. To use your own instance, update the configuration in `src/integrations/firebase/client.ts`.

### 5. Start Development Server
```bash
npm run dev
```
The application will be available at **http://localhost:8080**.

---

## 🏗️ Deployment Phase

The system is optimized for deployment on **Vercel**.

### Steps for Deployment:
1. Push the codebase to a GitHub/GitLab repository.
2. Connect your repository to **Vercel**.
3. Vercel will automatically detect the Vite build settings.
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Deploy!

> ✅ SPA routing is handled via `vercel.json` to ensure all routes work correctly on reload.

---

## 🗂️ Project Structure

- `src/components/` — Reusable UI modules and dashboard layouts.
- `src/pages/` — Main application views (Management, Student, Teacher, Landing).
- `src/integrations/firebase/` — Backend logic and service configurations.
- `src/data/` — Mock data layer for demo and offline functionality.
- `src/hooks/` — Custom React hooks for data fetching and UI logic.

---

## 📄 License & Credits
© 2026 CABS Primary School. All rights reserved.
System architecture and development by **Teramark.tech**.
