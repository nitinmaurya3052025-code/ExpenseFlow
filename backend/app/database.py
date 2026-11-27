import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from backend/.env or root directory
backend_dir = Path(__file__).resolve().parent.parent
dotenv_path = backend_dir / ".env"
if dotenv_path.is_file():
    load_dotenv(dotenv_path=dotenv_path)
load_dotenv()

database_url = os.getenv("DATABASE_URL") or os.getenv("MYSQL_URL")

if database_url:
    # Use PyMySQL driver
    if database_url.startswith("mysql+mysqlconnector://"):
        database_url = database_url.replace(
            "mysql+mysqlconnector://",
            "mysql+pymysql://",
            1
        )
    elif database_url.startswith("mysql://"):
        database_url = database_url.replace(
            "mysql://",
            "mysql+pymysql://",
            1
        )
else:
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "expense_manager")

    database_url = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

# Configure SSL for TiDB Cloud / MySQL
connect_args = {}
tidb_ca_path = os.getenv("TIDB_CA_PATH")

if tidb_ca_path:
    ca_file = Path(tidb_ca_path)
    if ca_file.is_file():
        connect_args = {
            "ssl_ca": str(ca_file),
            "ssl_verify_cert": True,
            "ssl_verify_identity": True
        }
    else:
        # Fall back to standard system certificates (e.g. on Render / Linux)
        system_ca_candidates = [
            "/etc/ssl/certs/ca-certificates.crt",
            "/etc/pki/tls/certs/ca-bundle.crt",
            "/etc/ssl/ca-bundle.pem",
            "/etc/ssl/cert.pem",
        ]
        found_ca = next((p for p in system_ca_candidates if Path(p).is_file()), None)
        if found_ca:
            connect_args = {
                "ssl_ca": found_ca,
                "ssl_verify_cert": True,
                "ssl_verify_identity": True
            }
        else:
            connect_args = {"ssl": {}}
elif "tidbcloud.com" in database_url:
    # TiDB Cloud requires SSL connection
    system_ca_candidates = [
        "/etc/ssl/certs/ca-certificates.crt",
        "/etc/pki/tls/certs/ca-bundle.crt",
        "/etc/ssl/ca-bundle.pem",
        "/etc/ssl/cert.pem",
    ]
    found_ca = next((p for p in system_ca_candidates if Path(p).is_file()), None)
    if found_ca:
        connect_args = {
            "ssl_ca": found_ca,
            "ssl_verify_cert": True,
            "ssl_verify_identity": True
        }
    else:
        connect_args = {"ssl": {}}

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()