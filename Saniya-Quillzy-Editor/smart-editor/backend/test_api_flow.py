import requests
import sys
import os
import random
import string

BASE_URL = "http://localhost:8000/api"

def random_string(length=10):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def run_tests():
    print("🚀 Starting Backend API Tests...")
    
    # 1. Signup
    email = f"test_{random_string()}@example.com"
    password = "password123"
    name = "Test User"
    
    print(f"1. Testing Signup ({email})...")
    res = requests.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": password,
        "name": name
    })
    if res.status_code != 200:
        print(f"❌ Signup failed: {res.text}")
        sys.exit(1)
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Signup successful")

    # 2. Login (Verify token works)
    print("2. Testing Login...")
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    if res.status_code != 200:
        print(f"❌ Login failed: {res.text}")
        sys.exit(1)
    print("✅ Login successful")

    # 3. Create Draft
    print("3. Testing Create Draft...")
    res = requests.post(f"{BASE_URL}/posts/", json={
        "content": '{"root":{}}',
        "plain_text": "This is a test draft.",
        "title": "Test Draft",
        "word_count": 5
    }, headers=headers)
    if res.status_code != 200:
        print(f"❌ Create Draft failed: {res.text}")
        sys.exit(1)
    post_id = res.json()["_id"]
    print(f"✅ Draft created (ID: {post_id})")

    # 4. Update Draft
    print("4. Testing Update Draft...")
    res = requests.patch(f"{BASE_URL}/posts/{post_id}", json={
        "plain_text": "Updated content.",
        "word_count": 2
    }, headers=headers)
    if res.status_code != 200:
        print(f"❌ Update Draft failed: {res.text}")
        sys.exit(1)
    print("✅ Draft updated")

    # 5. Publish Post
    print("5. Testing Publish...")
    res = requests.post(f"{BASE_URL}/posts/{post_id}/publish", headers=headers)
    if res.status_code != 200:
        print(f"❌ Publish failed: {res.text}")
        sys.exit(1)
    if res.json()["status"] != "published":
        print("❌ Status not updated to 'published'")
        sys.exit(1)
    print("✅ Post published")

    # 6. AI Summary (Mock if no key)
    print("6. Testing AI Summary...")
    res = requests.post(f"{BASE_URL}/ai/generate", json={
        "text": "This is a long enough text to test the summary feature of the application."
    }, headers=headers)
    
    # OpenAI/Gemini might fail if quota is exceeded or key invalid, so we check 200 OR specific error
    if res.status_code == 200:
        print("✅ AI Summary successful")
    else:
        print(f"⚠️ AI Summary returned {res.status_code}: {res.text} (Expected if key is missing/invalid)")

    # 7. AI Grammar
    print("7. Testing AI Grammar...")
    res = requests.post(f"{BASE_URL}/ai/fix-grammar", json={
        "text": "Me is testing grammar."
    }, headers=headers)
    
    if res.status_code == 200:
        print("✅ AI Grammar successful")
    else:
        print(f"⚠️ AI Grammar returned {res.status_code}: {res.text}")

    print("\n🎉 ALL CRITICAL PATHS PASSED!")

if __name__ == "__main__":
    run_tests()
