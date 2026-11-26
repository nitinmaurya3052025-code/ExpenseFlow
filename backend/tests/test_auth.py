from app.security import hash_password, verify_password
from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_password_hashing():
    password = "mypassword123"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrongpassword", hashed)
def test_register():
    response = client.post(
        "/users/",
        json={
            "name": "Test User",
            "email": "test2@example.com",
            "password": "TestPassword123"
        }
    )
    assert response.status_code == 201