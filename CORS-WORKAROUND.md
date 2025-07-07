# CORS Workaround - Temporary Solution

## Overview
This document describes a temporary workaround for CORS issues when your public website tries to communicate with the admin app (app.samedayramps.com).

## Problem
The admin app is not properly configured to handle CORS requests, causing the following issues:
- OPTIONS preflight requests are being redirected instead of handled properly
- Missing CORS headers in responses
- API calls from the public website are failing

## Temporary Solution

### 1. Health Check Endpoint
Use this endpoint to verify connectivity and CORS configuration:

```
GET https://app.samedayramps.com/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "server": "Same Day Ramps Admin API",
  "version": "1.0.0",
  "cors": {
    "enabled": true,
    "allowedOrigins": ["*"],
    "allowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}
```

### 2. Proxy Endpoint
Use this endpoint to proxy requests to the admin app's internal APIs:

```
GET/POST/PUT/DELETE https://app.samedayramps.com/api/proxy?path=/quotes
```

**Parameters:**
- `path`: The API path you want to call (e.g., `/quotes`, `/customers`, `/quotes/123`)

**Example Usage:**

```javascript
// Instead of calling:
// https://app.samedayramps.com/api/quotes

// Use the proxy:
fetch('https://app.samedayramps.com/api/proxy?path=/quotes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => console.log(data));
```

**POST Example:**
```javascript
// Create a new quote
fetch('https://app.samedayramps.com/api/proxy?path=/quotes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    customerId: 123,
    rampHeight: 24,
    // ... other quote data
  }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## How It Works

1. **Health Check**: The `/api/health` endpoint provides a simple way to test CORS connectivity
2. **Proxy**: The `/api/proxy` endpoint acts as a middleman:
   - Receives requests from your public website
   - Forwards them to the admin app's internal APIs
   - Returns responses with proper CORS headers
3. **CORS Headers**: All endpoints return the necessary CORS headers to allow cross-origin requests

## Important Notes

### Security
- **This is a temporary workaround** - The CORS configuration is permissive (`*` origins)
- **Do not use in production long-term** - Fix the actual admin app CORS configuration
- Consider restricting origins to your specific domains when ready

### Next Steps
1. **Fix the Admin App**: Configure proper CORS headers in your admin app
2. **Update Public Website**: Once fixed, update your public website to call the admin app directly
3. **Remove Workaround**: Delete these proxy endpoints once the proper fix is in place

### Admin App CORS Fix
Your admin app needs to:

1. **Add CORS Headers:**
   ```
   Access-Control-Allow-Origin: https://www.samedayramps.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Allow-Credentials: true
   Access-Control-Max-Age: 86400
   ```

2. **Handle OPTIONS Requests:**
   - Return status 200 or 204 (not a redirect)
   - Include all CORS headers
   - Empty response body

## Testing

### Test Health Check
```bash
curl -X GET https://app.samedayramps.com/api/health \
  -H "Origin: https://www.samedayramps.com"
```

### Test Proxy
```bash
curl -X GET https://app.samedayramps.com/api/proxy?path=/quotes \
  -H "Origin: https://www.samedayramps.com" \
  -H "Content-Type: application/json"
```

### Test OPTIONS Request
```bash
curl -X OPTIONS https://app.samedayramps.com/api/health \
  -H "Origin: https://www.samedayramps.com" \
  -H "Access-Control-Request-Method: GET"
```

## Troubleshooting

If you're still experiencing issues:

1. **Check the browser console** for specific error messages
2. **Verify the proxy path** parameter is correct
3. **Test the health endpoint** first to ensure basic connectivity
4. **Check network logs** to see if requests are reaching the proxy

## Support

This workaround should resolve the immediate CORS issues. Once your admin app is properly configured with CORS headers, you can remove this temporary solution. 