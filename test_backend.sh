#!/bin/bash

# API Testing Script for Backend
# This script tests all the main endpoints of the API

API_URL="http://localhost:8000/api"
AUTHOR_TOKEN=""
ADMIN_TOKEN=""
ARTICLE_ID=""
COMMENT_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== API Testing Script ===${NC}\n"

# Test 1: Register Author
echo -e "${YELLOW}1. Testing Register Author${NC}"
AUTHOR_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@test.com",
    "password": "Author123!",
    "name": "Test Author",
    "userType": "AUTHOR"
  }')
AUTHOR_TOKEN=$(echo $AUTHOR_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo -e "Response: $AUTHOR_RESPONSE\n"

if [ ! -z "$AUTHOR_TOKEN" ]; then
  echo -e "${GREEN}✓ Author registered and token obtained${NC}\n"
else
  echo -e "${RED}✗ Failed to register author${NC}\n"
fi

# Test 2: Register Admin
echo -e "${YELLOW}2. Testing Register Admin${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "name": "Test Admin",
    "userType": "ADMIN"
  }')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo -e "Response: $ADMIN_RESPONSE\n"

if [ ! -z "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Admin registered and token obtained${NC}\n"
else
  echo -e "${RED}✗ Failed to register admin${NC}\n"
fi

# Test 3: Get Current User (Author)
echo -e "${YELLOW}3. Testing Get Current User (Author)${NC}"
curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $AUTHOR_TOKEN" | jq '.'
echo ""

# Test 4: Create Article (Author)
echo -e "${YELLOW}4. Testing Create Article (Author)${NC}"
ARTICLE_RESPONSE=$(curl -s -X POST "$API_URL/articles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTHOR_TOKEN" \
  -d '{
    "title": "Test Article",
    "content": "This is a test article content that should be long enough to test the API properly.",
    "description": "A test article"
  }')
ARTICLE_ID=$(echo $ARTICLE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo -e "Response: $ARTICLE_RESPONSE\n"

if [ ! -z "$ARTICLE_ID" ]; then
  echo -e "${GREEN}✓ Article created with ID: $ARTICLE_ID${NC}\n"
else
  echo -e "${RED}✗ Failed to create article${NC}\n"
fi

# Test 5: Publish Article (Author)
echo -e "${YELLOW}5. Testing Publish Article (Author)${NC}"
curl -s -X POST "$API_URL/articles/$ARTICLE_ID/publish" \
  -H "Authorization: Bearer $AUTHOR_TOKEN" | jq '.'
echo ""

# Test 6: Get My Articles (Author)
echo -e "${YELLOW}6. Testing Get My Articles (Author)${NC}"
curl -s -X GET "$API_URL/articles/my-articles" \
  -H "Authorization: Bearer $AUTHOR_TOKEN" | jq '.'
echo ""

# Test 7: List Published Articles (Public)
echo -e "${YELLOW}7. Testing List Published Articles (Public)${NC}"
curl -s -X GET "$API_URL/articles" | jq '.'
echo ""

# Test 8: Get Article Detail (Public)
echo -e "${YELLOW}8. Testing Get Article Detail (Public)${NC}"
curl -s -X GET "$API_URL/articles/$ARTICLE_ID" | jq '.'
echo ""

# Test 9: Create Comment (Admin)
echo -e "${YELLOW}9. Testing Create Comment (Admin)${NC}"
COMMENT_RESPONSE=$(curl -s -X POST "$API_URL/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "content": "Great article! Admin comment.",
    "articleId": '$ARTICLE_ID'
  }')
COMMENT_ID=$(echo $COMMENT_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo -e "Response: $COMMENT_RESPONSE\n"

if [ ! -z "$COMMENT_ID" ]; then
  echo -e "${GREEN}✓ Comment created with ID: $COMMENT_ID${NC}\n"
else
  echo -e "${RED}✗ Failed to create comment${NC}\n"
fi

# Test 10: List Comments (Public)
echo -e "${YELLOW}10. Testing List Comments for Article (Public)${NC}"
curl -s -X GET "$API_URL/comments/article/$ARTICLE_ID" | jq '.'
echo ""

# Test 11: List All Users (Admin)
echo -e "${YELLOW}11. Testing List All Users (Admin)${NC}"
curl -s -X GET "$API_URL/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Test 12: Update User Role (Admin)
echo -e "${YELLOW}12. Testing Update User Role (Admin)${NC}"
curl -s -X PUT "$API_URL/admin/users/1/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "userType": "ADMIN"
  }' | jq '.'
echo ""

# Test 13: Delete Comment (Admin)
echo -e "${YELLOW}13. Testing Delete Comment (Admin)${NC}"
curl -s -X DELETE "$API_URL/comments/$COMMENT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Test 14: Delete Article (Author)
echo -e "${YELLOW}14. Testing Delete Article (Author)${NC}"
curl -s -X DELETE "$API_URL/articles/$ARTICLE_ID" \
  -H "Authorization: Bearer $AUTHOR_TOKEN" | jq '.'
echo ""

echo -e "${GREEN}=== Testing Complete ===${NC}\n"
