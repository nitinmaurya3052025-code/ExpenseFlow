# ExpenseFlow

A full-stack personal expense management application built with **React (Vite)**, **FastAPI**, and **MySQL**.

---

## 🚀 Deployment Options

### Option 1: Railway (Easiest & Free/Low Cost — Recommended)
Railway lets you host **MySQL**, the **FastAPI Backend**, and the **React Frontend** in a single project with automatic networking:

1. **Sign in to Railway**: Go to [railway.com](https://railway.com) and log in with your GitHub account.
2. **Deploy MySQL Database**:
   - Click **+ New Project** → **Provision MySQL**.
   - Click on the newly created MySQL card → **Variables** tab to view your credentials.
3. **Deploy Backend (FastAPI)**:
   - In the same project, click **+ New** → **GitHub Repo** → select `ExpenseFlow`.
   - Go to **Settings** → **Service Name**: set to `backend`.
   - **Root Directory**: set to `/backend`.
   - Go to **Variables** → add:
     - `DATABASE_URL`: `${{MySQL.DATABASE_URL}}` (Railway auto-links this!)
     - `SECRET_KEY`: `your_random_secret_key`
     - `ALLOWED_ORIGINS`: `*`
   - Go to **Settings** → **Networking** → Click **Generate Domain** (e.g. `https://expenseflow-backend-production.up.railway.app`).
4. **Deploy Frontend (React)**:
   - In the same project, click **+ New** → **GitHub Repo** → select `ExpenseFlow`.
   - Go to **Settings** → **Service Name**: set to `frontend`.
   - **Root Directory**: set to `/frontend`.
   - Go to **Variables** → add:
     - `VITE_API_URL`: paste your backend domain from step 3 (e.g. `https://expenseflow-backend-production.up.railway.app`).
   - Go to **Settings** → **Networking** → Click **Generate Domain**.
5. **Open your Website**: Visit your frontend domain!

---

### Option 2: Render & Cloud MySQL (TiDB / Aiven / Clever Cloud)

1. **Free Cloud MySQL**:
   - Create a free MySQL database at [TiDB Cloud](https://tidbcloud.com) or [Aiven](https://aiven.io).
   - Copy the MySQL connection URI (e.g. `mysql://user:pass@host:port/dbname`).
2. **Deploy on Render**:
   - Go to [render.com](https://render.com) and sign in with GitHub.
   - Click **New** → **Blueprint** → Select `ExpenseFlow` (it will detect `render.yaml`).
   - Fill in `DATABASE_URL` with your MySQL URI, and set `VITE_API_URL` to your backend's Render URL.

---

### Option 3: Vercel (Frontend) + Render/Railway (Backend)

- Deploy the backend and MySQL using Railway or Render as described above.
- Go to [vercel.com](https://vercel.com) → **Add New Project** → Import `ExpenseFlow`.
- Set **Root Directory** to `frontend`.
- Add Environment Variable:
  - `VITE_API_URL` = Your live backend URL.
- Click **Deploy**.

---

### Option 4: Run Locally as Website with Docker Compose

If you have Docker installed on your machine or server:
```bash
docker compose up --build
```
- **Frontend Website**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **MySQL**: `localhost:3306`

