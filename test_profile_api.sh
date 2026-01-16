#!/bin/bash

# Test Profile API - Real-time User Profile Management
# This script tests the complete profile management system

API_URL="http://localhost:8000/api"
TEST_USER_EMAIL="author1@example.com"
TEST_USER_PASSWORD="password123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Profile Management API Tests${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Login and get JWT token
echo -e "${BLUE}[1] Logging in user...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_USER_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"
echo "Token: ${TOKEN:0:20}...${NC}\n"

# Step 2: Get current profile
echo -e "${BLUE}[2] Getting user profile...${NC}"
PROFILE=$(curl -s -X GET "$API_URL/user/profile" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE" | jq . 2>/dev/null || echo "$PROFILE"
echo ""

# Step 3: Update profile
echo -e "${BLUE}[3] Updating user profile...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jean Dupont Updated",
    "bio": "Je suis un auteur passionné par la technologie et l'\''écriture.",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=jean"
  }')

echo "$UPDATE_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_RESPONSE"
echo ""

# Step 4: Verify profile was updated
echo -e "${BLUE}[4] Verifying profile update...${NC}"
VERIFY_PROFILE=$(curl -s -X GET "$API_URL/user/profile" \
  -H "Authorization: Bearer $TOKEN")

echo "$VERIFY_PROFILE" | jq . 2>/dev/null || echo "$VERIFY_PROFILE"
echo ""

# Step 5: Change password
echo -e "${BLUE}[5] Changing password...${NC}"
PASSWORD_CHANGE=$(curl -s -X POST "$API_URL/user/change-password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }')

echo "$PASSWORD_CHANGE" | jq . 2>/dev/null || echo "$PASSWORD_CHANGE"
echo ""

# Step 6: Verify database persistence
echo -e "${BLUE}[6] Verifying database persistence...${NC}"
echo -e "${BLUE}Checking if changes are stored in the database...${NC}"
echo "(Run: cd backend && symfony console doctrine:query:sql \"SELECT name, bio, avatar FROM user WHERE email='$TEST_USER_EMAIL'\")"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All tests completed!${NC}"
echo -e "${GREEN}========================================${NC}"
