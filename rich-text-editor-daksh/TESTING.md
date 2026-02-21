# Testing Guide

Comprehensive guide for testing the AI Resume Platform.

---

## Test Suite Overview

The project uses a dual testing approach:
1. **Unit Tests** - Test specific functionality and edge cases
2. **Property-Based Tests** - Test universal properties across random inputs

---

## Running Tests

### Run All Tests
```bash
cd backend
pytest
```

### Run with Verbose Output
```bash
pytest -v
```

### Run Specific Test File
```bash
pytest tests/test_auth_service.py
pytest tests/test_models.py
```

### Run Specific Test Function
```bash
pytest tests/test_auth_service.py::test_valid_authentication_returns_jwt_token
```

### Run with Coverage
```bash
pytest --cov=app
pytest --cov=app --cov-report=html  # Generate HTML report
```

### Run Property Tests with Statistics
```bash
pytest --hypothesis-show-statistics
```

---

## Test Files

### 1. test_models.py
Tests database models and referential integrity.

**Property 12: Database Referential Integrity**
- Tests foreign key relationships
- Tests cascade deletes
- Tests score constraints

```bash
pytest tests/test_models.py -v
```

### 2. test_password.py
Tests password hashing and verification.

**Property 1: User Registration Creates Valid Accounts**
- Tests password hashing
- Tests password verification
- Tests hash uniqueness

```bash
pytest tests/test_password.py -v
```

### 3. test_auth_service.py
Tests authentication service.

**Property 2: Invalid Registration Data Returns Errors**
**Property 3: Valid Authentication Returns JWT Token**
- Tests user registration
- Tests invalid inputs
- Tests JWT generation
- Tests authentication

```bash
pytest tests/test_auth_service.py -v
```

### 4. test_ai_service.py
Tests AI service integration.

**Property 5: Resume Analysis Returns Structured Feedback**
**Property 7: Job Match Returns Structured Results**
**Property 11: AI Service Response Consistency**
- Tests AI response structure
- Tests mock service
- Tests OpenAI integration
- Tests response consistency

```bash
pytest tests/test_ai_service.py -v
```

### 5. test_resume_service.py
Tests resume review service.

**Property 6: Resume Review Round-Trip Persistence**
- Tests review creation
- Tests review retrieval
- Tests data persistence
- Tests validation

```bash
pytest tests/test_resume_service.py -v
```

### 6. test_job_match_service.py
Tests job matching service.

**Property 8: Job Match Round-Trip Persistence**
- Tests match creation
- Tests match retrieval
- Tests data persistence
- Tests validation

```bash
pytest tests/test_job_match_service.py -v
```

### 7. test_routes.py
Tests API endpoints and authorization.

**Property 4: Protected Endpoints Require Authentication**
**Property 9: User Data Isolation**
**Property 10: History Ordered by Recency**
- Tests endpoint protection
- Tests data isolation
- Tests history ordering
- Tests empty history

```bash
pytest tests/test_routes.py -v
```

---

## Property-Based Testing

### What is Property-Based Testing?

Property-based testing validates universal properties across many randomly generated inputs. Instead of testing specific examples, we test that certain properties hold true for ALL valid inputs.

### Example Property

**Property**: "For any valid password, hashing it should produce a different string"

```python
@given(password=st.text(min_size=1, max_size=100))
def test_password_hashing(password):
    hashed = hash_password(password)
    assert hashed != password
```

This test runs 100 times with different random passwords!

### Benefits

1. **Comprehensive Coverage** - Tests many scenarios automatically
2. **Edge Case Discovery** - Finds bugs you didn't think of
3. **Confidence** - Proves properties hold universally
4. **Regression Prevention** - Catches breaking changes

### Our Properties

1. **User Registration** - Passwords are always hashed
2. **Invalid Registration** - Bad inputs always return errors
3. **Authentication** - Valid credentials always return JWT
4. **Endpoint Protection** - Protected endpoints always require auth
5. **Resume Analysis** - Responses always have required fields
6. **Review Persistence** - Data survives round-trip storage
7. **Job Match Results** - Responses always have required fields
8. **Match Persistence** - Data survives round-trip storage
9. **Data Isolation** - Users never see other users' data
10. **History Ordering** - Results always ordered by recency
11. **AI Consistency** - OpenAI and mock have same structure
12. **Referential Integrity** - Foreign keys always maintained

---

## Unit Testing

### What is Unit Testing?

Unit tests verify specific functionality with known inputs and expected outputs.

### Example Unit Test

```python
def test_empty_password_raises_error(app):
    with app.app_context():
        with pytest.raises(ValueError):
            hash_password('')
```

### Our Unit Tests

- Empty input handling
- Duplicate email registration
- Invalid credentials
- Expired JWT tokens
- Missing required fields
- Whitespace-only inputs
- Edge cases for all services

---

## Test Configuration

### conftest.py

Provides test fixtures:

```python
@pytest.fixture(scope='function')
def app():
    """Create test Flask application"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    # ... setup
    yield app
    # ... teardown

@pytest.fixture(scope='function')
def client(app):
    """Create test client"""
    return app.test_client()
```

### Hypothesis Configuration

```python
from hypothesis import settings

@settings(max_examples=100)  # Run 100 random tests
@given(password=st.text(min_size=1, max_size=100))
def test_something(password):
    # Test code
```

---

## Writing New Tests

### Adding a Unit Test

```python
def test_my_new_feature(app):
    """Test description"""
    with app.app_context():
        # Setup
        result = my_function()
        
        # Assert
        assert result == expected_value
```

### Adding a Property Test

```python
from hypothesis import given, strategies as st, settings

@settings(max_examples=100)
@given(input_data=st.text(min_size=1, max_size=100))
def test_my_property(app, input_data):
    """
    Property: For any input, output should have property X
    """
    with app.app_context():
        result = my_function(input_data)
        assert property_holds(result)
```

---

## Test Data Generators

### Hypothesis Strategies

```python
from hypothesis import strategies as st

# Text
st.text(min_size=1, max_size=100)

# Emails
st.emails()

# Integers
st.integers(min_value=0, max_value=100)

# Lists
st.lists(st.text(), min_size=0, max_size=10)

# Custom composite
@st.composite
def user_data(draw):
    name = draw(st.text(min_size=1, max_size=100))
    email = draw(st.emails())
    return {'name': name, 'email': email}
```

---

## Debugging Tests

### Run Single Test with Output
```bash
pytest tests/test_auth_service.py::test_name -v -s
```

### Show Print Statements
```bash
pytest -s
```

### Stop on First Failure
```bash
pytest -x
```

### Show Local Variables on Failure
```bash
pytest -l
```

### Run Last Failed Tests
```bash
pytest --lf
```

---

## Test Coverage

### Generate Coverage Report
```bash
pytest --cov=app --cov-report=html
```

### View HTML Report
```bash
# Open htmlcov/index.html in browser
```

### Coverage Goals
- **Overall**: 80%+ coverage
- **Critical paths**: 95%+ coverage
- **Services**: 90%+ coverage
- **Routes**: 85%+ coverage

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        pytest --cov=app
```

---

## Manual Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Resume Review (with token)
```bash
curl -X POST http://localhost:5000/api/resume/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"resume_text":"Software Engineer with 5 years experience"}'
```

---

## Performance Testing

### Load Testing with Locust

```python
from locust import HttpUser, task, between

class ResumeUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        # Login
        response = self.client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        self.token = response.json()["access_token"]
    
    @task
    def review_resume(self):
        self.client.post("/api/resume/review",
            headers={"Authorization": f"Bearer {self.token}"},
            json={"resume_text": "Test resume"}
        )
```

Run: `locust -f locustfile.py`

---

## Test Best Practices

### DO
✅ Write tests before fixing bugs
✅ Test edge cases
✅ Use descriptive test names
✅ Keep tests independent
✅ Use fixtures for setup
✅ Test error conditions
✅ Mock external services
✅ Run tests frequently

### DON'T
❌ Test implementation details
❌ Write flaky tests
❌ Skip test cleanup
❌ Ignore failing tests
❌ Test third-party code
❌ Make tests dependent on each other
❌ Commit commented-out tests

---

## Troubleshooting

### Tests Fail Randomly
- Check for race conditions
- Ensure proper cleanup
- Use unique test data
- Check database state

### Tests Are Slow
- Use in-memory database
- Mock external services
- Reduce test data size
- Run tests in parallel

### Coverage Is Low
- Identify untested code
- Add tests for edge cases
- Test error paths
- Test all branches

---

## Test Maintenance

### Regular Tasks
- [ ] Run full test suite weekly
- [ ] Review and update tests with code changes
- [ ] Remove obsolete tests
- [ ] Add tests for new features
- [ ] Monitor test execution time
- [ ] Update test documentation

---

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Hypothesis Documentation](https://hypothesis.readthedocs.io/)
- [Flask Testing](https://flask.palletsprojects.com/en/2.3.x/testing/)
- [Property-Based Testing](https://increment.com/testing/in-praise-of-property-based-testing/)

---

**Remember**: Good tests are your safety net. Write them, maintain them, trust them!
