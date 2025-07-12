# OAuth 2.0 Authorization Code Flow Implementation

## Overview

This implementation provides an OAuth 2.0 authorization code flow endpoint specifically designed to support OpenAI GPT integrations with the Lichtara OS platform.

## Endpoint

```
POST /oauth/token
```

## Request Parameters

The endpoint accepts the following parameters in JSON format:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `grant_type` | string | ✅ | Must be `authorization_code` |
| `client_id` | string | ✅ | Client identifier for the OAuth application |
| `client_secret` | string | ✅ | Client secret for authentication |
| `code` | string | ✅ | Authorization code received from authorization server |
| `redirect_uri` | string | ✅ | Callback URL for OAuth (must match OpenAI GPT format) |

## Request Example

```bash
curl -X POST http://localhost:3001/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "code": "abc123",
    "redirect_uri": "https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback"
  }'
```

## Response

### Success Response (200 OK)

```json
{
  "access_token": "lichtara_1752301013573_fus7fju9j",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_1752301013573_vaau8wfsp",
  "scope": "lichtara:portal lichtara:ai-integration",
  "issued_at": "2025-07-12T06:16:53.573Z"
}
```

### Error Responses

#### Missing Parameters (400 Bad Request)
```json
{
  "error": "invalid_request",
  "error_description": "Missing required parameters: grant_type, client_id, client_secret, code, redirect_uri"
}
```

#### Unsupported Grant Type (400 Bad Request)
```json
{
  "error": "unsupported_grant_type",
  "error_description": "Only authorization_code grant type is supported"
}
```

#### Invalid Redirect URI (400 Bad Request)
```json
{
  "error": "invalid_request",
  "error_description": "Invalid redirect_uri format. Expected: https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback"
}
```

#### Invalid Client Credentials (400 Bad Request)
```json
{
  "error": "invalid_client",
  "error_description": "Invalid client credentials. Please provide valid client_id and client_secret"
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "error": "server_error",
  "error_description": "Internal server error processing OAuth request"
}
```

## Validation Rules

### Redirect URI Validation
The `redirect_uri` must match the OpenAI GPT callback format:
```
https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback
```

Where `{g-YOUR-GPT-ID-HERE}` should be replaced with your actual GPT ID.

### Client Credentials Validation
- `client_id` and `client_secret` cannot be the placeholder values `YOUR_CLIENT_ID` or `YOUR_CLIENT_SECRET`
- Both must be provided and non-empty

### Authorization Code Validation
- The `code` parameter must be at least 6 characters long
- In a production environment, this would validate against stored authorization codes

## Testing

Run the OAuth test suite:

```bash
npm run test:oauth
```

Or run the test script directly:

```bash
./test-oauth.sh
```

## Security Considerations

### Current Implementation (Development/Demo)
This implementation is designed for development and demonstration purposes. For production use, consider implementing:

1. **Secure Code Storage**: Store authorization codes securely with expiration times
2. **Client Registration**: Implement proper client registration and validation
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **HTTPS Only**: Enforce HTTPS for all OAuth endpoints
5. **Proper Secret Management**: Use environment variables for sensitive configuration
6. **Code Validation**: Implement proper authorization code validation against stored codes
7. **Scope Validation**: Implement proper scope validation and enforcement

### Token Security
- Access tokens are generated with timestamps and random strings
- In production, use cryptographically secure token generation
- Implement proper token storage and validation
- Consider JWT tokens for stateless authentication

## Integration with OpenAI GPTs

This endpoint is specifically designed to work with OpenAI's GPT Action system. To use:

1. Configure your GPT Action with this OAuth endpoint
2. Set the redirect URI to match your GPT ID
3. Provide valid client credentials
4. The GPT will exchange authorization codes for access tokens
5. Use the access tokens to authenticate requests to your Lichtara OS APIs

## Future Enhancements

- [ ] Implement refresh token flow
- [ ] Add support for additional grant types
- [ ] Implement proper client registration
- [ ] Add detailed logging and monitoring
- [ ] Implement token introspection endpoint
- [ ] Add support for custom scopes
- [ ] Implement PKCE for enhanced security