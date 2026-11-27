💰 ExpenseFlow

Smart Personal Expense Management

ExpenseFlow is a full-stack personal finance management application designed to help users track their income and expenses, monitor spending habits, analyze financial activity, and maintain better control over their money.

Built with React.js, FastAPI, and MySQL, ExpenseFlow provides a secure, responsive, and intuitive platform for managing personal finances.

⸻

🌐 Live Demo

Live Application: https://expenseflow-frontend-b0tf.onrender.com

Backend API: https://expenseflow-backend-swnf.onrender.com

⸻

✨ Features

🔐 Authentication & Security

* User registration and login.
* JWT-based authentication.
* Secure password hashing.
* Protected application routes.
* Individual user data isolation.

📊 Dashboard

* Overview of total expenses.
* Monthly spending summary.
* Expense statistics.
* Category-wise spending breakdown.
* Monthly spending visualizations.
* Recent transactions.

💳 Transaction Management

* Add new expenses.
* Edit existing transactions.
* Delete transactions.
* Assign transactions to categories.
* Search and filter transactions.
* Sorting and pagination.

📈 Analytics

* Visual representation of spending habits.
* Category-wise expense analysis.
* Monthly expense trends.
* Date-based filtering.
* Financial insights through interactive charts.

🗂️ Category Management

* Create custom expense categories.
* Edit existing categories.
* Delete categories.
* Organize transactions efficiently.

⚙️ Account Settings

* Update profile information.
* Change account password.
* Logout securely.
* Delete account.

📱 User Experience

* Responsive interface.
* Modern dashboard design.
* Sidebar navigation.
* Interactive charts and statistics.
* Clean and intuitive user interface.

⸻

🛠️ Technology Stack

Category	Technologies
Frontend	React.js, JavaScript, HTML5, CSS3
Build Tool	Vite
Routing	React Router
API Communication	Axios
Backend	Python, FastAPI
ORM	SQLAlchemy
Database	MySQL / TiDB Cloud
Authentication	JWT
Password Security	Password Hashing
Database Migrations	Alembic
Frontend Deployment	Render Static Site
Backend Deployment	Render Web Service
Database Hosting	TiDB Cloud
Version Control	Git & GitHub

⸻

🏗️ Project Architecture

ExpenseFlow follows a client-server architecture.

                USER
                  |
                  |
          React Frontend
             (Vite)
                  |
                  |
             Axios API
                  |
                  |
           FastAPI Backend
                  |
          -----------------
          |       |       |
        Routers Models Security
                  |
                  |
             SQLAlchemy
                  |
                  |
             MySQL / TiDB

Architecture Overview

1. The React frontend provides the user interface.
2. Axios communicates with the backend through REST APIs.
3. FastAPI handles application logic and API requests.
4. JWT authentication protects private endpoints.
5. SQLAlchemy manages database operations.
6. MySQL-compatible TiDB Cloud stores application data.
7. Alembic manages database schema migrations.

⸻

📁 Project Structure

ExpenseFlow/
│
├── backend/
│   │
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── security.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── render.yaml
├── .gitignore
└── README.md

⸻

🚀 Getting Started

Follow these instructions to run ExpenseFlow locally.

Prerequisites

Make sure you have installed:

* Python 3.10+
* Node.js and npm
* MySQL or a TiDB Cloud database
* Git

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL

Navigate into the project:

cd ExpenseFlow

2. Backend Setup

Navigate to the backend directory:

cd backend

Create a Python virtual environment:

python3 -m venv venv

Activate the environment.

macOS / Linux:

source venv/bin/activate

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

3. Configure Environment Variables

Create a .env file inside the backend directory.

DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

Replace the placeholder values with your actual database connection string and a securely generated secret key.

4. Run Database Migrations

Apply the database migrations:

alembic upgrade head

This creates or updates the database schema according to the migration history.

5. Start the Backend Server

uvicorn app.main:app --reload

Backend will be available at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

6. Frontend Setup

Open another terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Create a .env file:

VITE_API_URL=http://127.0.0.1:8000

Start the development server:

npm run dev

Frontend will be available at:

http://localhost:5173

⸻

☁️ Deployment

ExpenseFlow is deployed using a cloud-based architecture.

Component	Platform
Frontend	Render Static Site
Backend	Render Web Service
Database	TiDB Cloud
Database Migrations	Alembic

Deployment Workflow

          GitHub Repository
                  |
                  |
             Git Push
                  |
          -----------------
          |               |
       Frontend         Backend
        Render           Render
          |               |
          |               |
      Static Site      FastAPI API
                          |
                          |
                       TiDB Cloud
                        Database

The deployment configuration is maintained using render.yaml.

Database migrations are automatically applied during backend startup.

Environment variables are configured through the Render dashboard.

⸻

🔒 Security Considerations

ExpenseFlow incorporates several security practices:

* JWT-based authentication.
* Password hashing instead of storing plain-text passwords.
* Protected API endpoints.
* User-specific data access.
* Environment-based configuration.
* Separation of frontend and backend services.
* Database schema version control through Alembic.

Note: Never commit .env files, database credentials, or secret keys to GitHub.

⸻

🔮 Future Improvements

Potential enhancements for future versions:

* Income tracking and financial balance management.
* Budget creation and spending limits.
* Recurring transactions.
* Export transactions to CSV and PDF.
* Advanced financial reports.
* Monthly budget notifications.
* AI-powered spending insights.
* Multi-currency support.

⸻

👨‍💻 Author

Nitin Maurya

Computer Science & Engineering Student
IIIT Pune

Interested in Full-Stack Development, Software Engineering, and Building Practical Applications.

⸻

📄 License

This project is available under the MIT License.

⸻

⭐ Support

If you find ExpenseFlow useful, consider giving this repository a star!

Built with ❤️ by Nitin Maurya.

