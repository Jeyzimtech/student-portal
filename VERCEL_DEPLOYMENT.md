# 🚀 Vercel Hosting & Unified Access Guide

I have updated the system so that you can access both the **Admin** and **Student** portals from a single link (your main domain).

## 🛠️ What was changed?
- **Unified Login Hub**: Created a single login page at `/login` that identifies users (Student, Teacher, or Admin) and redirects them to their respective dashboards automatically.
- **Simplified Navigation**: The main "Student Portal" and "Admin Login" buttons have been merged into a single **"Portal Login"** button in the Navbar and Hero section.
- **SPA Routing**: Ensured that Vercel is configured to handle React Router paths correctly so you don't get 404s when refreshing a portal page.

---

## 🌎 Hosting on Vercel (Step-by-Step)

Follow these steps to get your system live:

### 1. Initialize Git & Push to GitHub
If you haven't already, push your code to a GitHub repository.
```bash
git init
git add .
git commit -m "feat: unified login and vercel config"
# Replace with your repo URL
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.
4. **Project Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - If you still use Supabase for some features, add the variables from your `.env` file (`VITE_SUPABASE_URL`, etc.).
   - Note: Your Firebase config is already hardcoded in `src/integrations/firebase/client.ts`, so it will work automatically!

### 3. Deploy
Click **"Deploy"**. Vercel will build the project and give you a live URL (e.g., `https://cabs-primary.vercel.app`).

---

## 🔑 How to Assess Both Sides
Once live, you can access everything from your main link:
1. **Visit the Link**: `https://your-project.vercel.app`
2. **Click "Portal Login"**: This takes you to the consolidated login page.
3. **Admin Demo**: Use `admin@cabsprimary.ac.zw` / `admin123` to enter the **Admin Dashboard**.
4. **Student Demo**: Use `student@cabsprimary.ac.zw` / `student123` to enter the **Student Portal**.
5. **Switching**: Simply logout and log back in with the other account. You never have to leave the main link!

---

## 📄 Routing Configuration (`vercel.json`)
I have verified your `vercel.json` ensures that all paths (like `/admin` or `/student-dashboard`) are handled by the main app:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Your system is now ready for a premium, single-link deployment!** 🚀
