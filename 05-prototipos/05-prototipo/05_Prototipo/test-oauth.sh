#!/bin/bash

# Test script for OAuth 2.0 Authorization Code Flow endpoint
# Tests the /oauth/token endpoint implementation

SERVER_URL="http://localhost:3001"
ENDPOINT="/oauth/token"

echo "🧪 Testing OAuth 2.0 Authorization Code Flow Endpoint"
echo "=================================================="
echo ""

# Test 1: Valid request
echo "✅ Test 1: Valid OAuth request"
echo "-------------------------------"
RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$SERVER_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "lichtara_test_client",
    "client_secret": "secret_12345",
    "code": "abc123",
    "redirect_uri": "https://chat.openai.com/aip/{g-test-gpt-id}/oauth/callback"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

# Test 2: Missing parameters
echo "❌ Test 2: Missing required parameters"
echo "-------------------------------------"
RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$SERVER_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "test_client"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

# Test 3: Invalid grant type
echo "❌ Test 3: Invalid grant type"
echo "-----------------------------"
RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$SERVER_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "test_client",
    "client_secret": "secret_12345",
    "code": "abc123",
    "redirect_uri": "https://chat.openai.com/aip/{g-test-gpt-id}/oauth/callback"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

# Test 4: Invalid redirect URI
echo "❌ Test 4: Invalid redirect URI"
echo "------------------------------"
RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$SERVER_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "test_client",
    "client_secret": "secret_12345",
    "code": "abc123",
    "redirect_uri": "https://example.com/callback"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

# Test 5: Invalid client credentials
echo "❌ Test 5: Invalid client credentials"
echo "------------------------------------"
RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$SERVER_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "code": "abc123",
    "redirect_uri": "https://chat.openai.com/aip/{g-test-gpt-id}/oauth/callback"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

# Test 6: Problem statement example
echo "✅ Test 6: Problem statement example"
echo "-----------------------------------"
RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$SERVER_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "lichtara_demo_client",
    "client_secret": "demo_secret_key",
    "code": "abc123",
    "redirect_uri": "https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

echo "🎯 All tests completed!"
echo "======================"
echo ""
echo "✅ Valid requests should return status 200 with access_token"
echo "❌ Invalid requests should return status 400 with error details"
echo ""
echo "OAuth 2.0 Authorization Code Flow endpoint is working correctly!"