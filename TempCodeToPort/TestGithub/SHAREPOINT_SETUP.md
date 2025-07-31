# SharePoint Integration Setup Guide

## Prerequisites
1. Access to Microsoft 365 / SharePoint Online
2. Azure AD admin permissions to register an application
3. VS Code with SharePoint development extensions (recommended)

## Step 1: Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the application details:
   - **Name**: USI Graduate Success Tools
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - `http://localhost:5176` (for development)

5. After registration, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**

## Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `Sites.Read.All`
   - `Files.Read.All`
   - `Files.ReadWrite.All` (if you want upload functionality)
   - `User.Read`

6. Click **Grant admin consent** for your organization

## Step 3: Configure Authentication

1. Go to **Authentication** in your app registration
2. Under **Platform configurations**, configure the Web platform:
   - Redirect URIs: 
     - `http://localhost:5176` (development)
     - `https://yourdomain.com` (production)
3. Under **Implicit grant and hybrid flows**, enable:
   - **Access tokens**
   - **ID tokens**

## Step 4: Update Configuration

1. Open `src/services/SharePointService.ts`
2. Replace the placeholders with your actual values:

```typescript
const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // Replace with your Application (client) ID
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your Directory (tenant) ID
    redirectUri: window.location.origin,
  },
  // ... rest of config
};
```

## Step 5: Add SharePoint Component to Your App

You can add the SharePoint integration to any of your existing pages. For example, to add it to the Dashboard:

```typescript
// In Dashboard.tsx
import SharePointIntegration from './SharePointIntegration';

// Add to your component JSX
<SharePointIntegration />
```

## Available Features

### Authentication
- Login/logout with Microsoft 365 credentials
- Secure token management
- Automatic token refresh

### SharePoint Sites
- List all accessible SharePoint sites
- Get site details and metadata

### SharePoint Lists
- Retrieve lists from selected sites
- Access list items and metadata

### Document Libraries
- Browse documents and folders
- Upload new documents
- Download existing files

## Environment Variables (Optional)

For production, consider using environment variables:

```env
VITE_AZURE_CLIENT_ID=your_client_id
VITE_AZURE_TENANT_ID=your_tenant_id
VITE_REDIRECT_URI=https://yourdomain.com
```

Then update the service to use these:

```typescript
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  },
};
```

## Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to the page with SharePoint integration
3. Click "Connect to SharePoint"
4. Sign in with your Microsoft 365 credentials
5. You should see your sites, lists, and documents

## Troubleshooting

### Common Issues:

1. **Login popup blocked**: Ensure popup blockers are disabled for your development site
2. **CORS errors**: Make sure redirect URI matches exactly in Azure and your app
3. **Permission errors**: Ensure admin consent is granted for the required permissions
4. **Token expiration**: The service handles automatic token refresh

### Debug Mode:
Add this to enable MSAL logging:

```typescript
const msalConfig: Configuration = {
  // ... existing config
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    }
  }
};
```

## Security Best Practices

1. Never commit client secrets to version control
2. Use environment variables for sensitive configuration
3. Implement proper error handling for authentication failures
4. Consider implementing role-based access control
5. Regularly review and update API permissions

## Next Steps

- Integrate SharePoint data into your existing producer tracking system
- Add file upload functionality for reports and documents
- Implement SharePoint list integration for producer data storage
- Add real-time collaboration features using SharePoint lists
