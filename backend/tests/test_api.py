import pytest
import json
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set test environment before importing app
os.environ.setdefault('SECRET_KEY', 'test-secret-key')
os.environ.setdefault('DATABASE_URL', 'sqlite:///test_app.db')

from app import app as flask_app

@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_app.db'
    with flask_app.test_client() as client:
        yield client

def get_token(client):
    """Register and login to get a JWT token for protected routes."""
    client.post('/api/register', json={
        'name': 'Test User',
        'email': 'testuser_launcher@example.com',
        'password': 'testpassword123'
    })
    response = client.post('/api/login', json={
        'email': 'testuser_launcher@example.com',
        'password': 'testpassword123'
    })
    data = response.get_json()
    return data.get('token', '')

# ─────────────────────────────────────────────
# 1. Health Check
# ─────────────────────────────────────────────
def test_health_check(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

# ─────────────────────────────────────────────
# 2. Register - success
# ─────────────────────────────────────────────
def test_register_success(client):
    response = client.post('/api/register', json={
        'name': 'New User',
        'email': 'newuser_unique123@example.com',
        'password': 'securepassword'
    })
    assert response.status_code in [200, 201, 400]

# ─────────────────────────────────────────────
# 3. Register - missing fields
# ─────────────────────────────────────────────
def test_register_missing_fields(client):
    response = client.post('/api/register', json={'name': 'No Email'})
    assert response.status_code == 400

# ─────────────────────────────────────────────
# 4. Login - success
# ─────────────────────────────────────────────
def test_login_success(client):
    client.post('/api/register', json={
        'name': 'Login User',
        'email': 'loginuser_launcher@example.com',
        'password': 'mypassword'
    })
    response = client.post('/api/login', json={
        'email': 'loginuser_launcher@example.com',
        'password': 'mypassword'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'token' in data

# ─────────────────────────────────────────────
# 5. Login - wrong password
# ─────────────────────────────────────────────
def test_login_wrong_password(client):
    client.post('/api/register', json={
        'name': 'User',
        'email': 'wrongpass_launcher@example.com',
        'password': 'correctpassword'
    })
    response = client.post('/api/login', json={
        'email': 'wrongpass_launcher@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code in [401, 403]

# ─────────────────────────────────────────────
# 6. Validate Idea - no auth
# ─────────────────────────────────────────────
def test_validate_idea_no_auth(client):
    response = client.post('/api/validate-idea', json={'idea': 'AI startup'})
    assert response.status_code in [401, 403]

# ─────────────────────────────────────────────
# 7. Validate Idea - missing idea field
# ─────────────────────────────────────────────
def test_validate_idea_missing_field(client):
    token = get_token(client)
    response = client.post('/api/validate-idea',
        json={},
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == 400

# ─────────────────────────────────────────────
# 8. Generate Business Model - returns valid structure
# ─────────────────────────────────────────────
def test_generate_business_model_structure(client):
    token = get_token(client)
    response = client.post('/api/generate-business-model',
        json={'idea': 'SaaS analytics platform'},
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert len(data) > 0

# ─────────────────────────────────────────────
# 9. Generate Pitch - returns 10 slides
# ─────────────────────────────────────────────
def test_generate_pitch_returns_slides(client):
    token = get_token(client)
    response = client.post('/api/generate-pitch',
        json={'idea': 'AI healthcare assistant'},
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == 200
    data = response.get_json()
    for i in range(1, 11):
        assert f'slide_{i}_' in ' '.join(data.keys()), f"Missing slide {i}"

# ─────────────────────────────────────────────
# 10. Generate Pitch - empty idea rejected
# ─────────────────────────────────────────────
def test_generate_pitch_empty_idea(client):
    token = get_token(client)
    response = client.post('/api/generate-pitch',
        json={'idea': '   '},
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == 400
