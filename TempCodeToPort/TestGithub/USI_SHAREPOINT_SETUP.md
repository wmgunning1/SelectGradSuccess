# USI SharePoint Integration - Quick Setup Guide

## 🚀 Quick Setup for USI SharePoint Site

Your app is now configured to connect to:
- **SharePoint Site**: https://usii.sharepoint.com/sites/PRSandA
- **List**: SelectGradPredictorData

## Step 1: Azure App Registration (IT Admin Required)

### 1.1 Create App Registration
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: USI Graduate Success Tools
   - **Account types**: Single tenant (USI only)
   - **Redirect URI**: Web - `http://localhost:5176`

### 1.2 Configure API Permissions
Add these Microsoft Graph permissions:
- `Sites.Read.All` (Application)
- `Files.Read.All` (Delegated)
- `User.Read` (Delegated)

⚠️ **Important**: Ask your IT admin to grant admin consent for these permissions.

### 1.3 Get Configuration Values
After registration, copy these values:
- **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## Step 2: Update Application Configuration

1. Open `src/services/USISharePointService.ts`
2. Replace the placeholder values:

```typescript
const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_ACTUAL_CLIENT_ID_HERE',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID_HERE',
    redirectUri: window.location.origin,
  },
  // ... rest of config
};
```

## Step 3: SharePoint List Structure

Your SharePoint list should have these columns:
- **Title** (Single line of text) - Producer Name
- **DirectManager** (Single line of text)
- **Vertical** (Choice: Commercial Lines, Personal Lines, etc.)
- **LineOfBusiness** (Choice: Commercial Lines, Personal Lines, etc.)
- **Region** (Choice: Northeast, Southeast, etc.)
- **CurrentSalary** (Single line of text)
- **MMBook** (Single line of text)
- **BookSize** (Single line of text)
- **LTM_MMNb** (Single line of text)
- **MMTenure** (Single line of text)
- **PercentileRank** (Single line of text)
- **Flags** (Number)
- **SuccessScore** (Number)
- **NumberOfWins** (Number)

## Step 4: Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to the Producer Table page
3. Click "Connect to SharePoint"
4. Sign in with your USI credentials
5. The app should load data from your SharePoint list

## Current Features

### ✅ Working Now:
- SharePoint authentication with USI credentials
- Automatic connection to USI PRSandA site
- Loading producer data from SelectGradPredictorData list
- Filtering and displaying producers
- Producer detail view with SharePoint data

### 📊 Data Flow:
1. User logs in with USI credentials
2. App connects to https://usii.sharepoint.com/sites/PRSandA
3. App reads from SelectGradPredictorData list
4. Data is displayed in the Producer Table and Detail views

## Troubleshooting

### Common Issues:

#### "Login failed" or "Access denied"
- Check if Azure app registration is configured correctly
- Ensure admin consent is granted for API permissions
- Verify the tenant ID is correct for USI

#### "List not found" error
- Verify the list name is exactly "SelectGradPredictorData"
- Check if your account has read access to the site
- Ensure the site URL is correct

#### "No data found"
- Check if the SharePoint list has items
- Verify column names match the expected format
- Check if list items are not in draft state

### Debug Mode:
Add this to `USISharePointService.ts` for detailed logging:

```typescript
const msalConfig: Configuration = {
  // ... existing config
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(`[MSAL] ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    }
  }
};
```

## Security Notes

- Never commit client secrets or sensitive IDs to source control
- The app uses delegated permissions (user context)
- All SharePoint access is based on the logged-in user's permissions
- Tokens are stored in session storage and cleared on logout

## Next Steps

After successful connection:
1. Verify all producer data is loading correctly
2. Test filtering and navigation
3. Consider adding more SharePoint lists for additional data
4. Implement data refresh capabilities
5. Add error handling for network issues

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your SharePoint list structure matches the expected format
3. Contact your IT administrator for Azure permissions
4. Review the SharePoint site permissions

---

**Ready to test?** Run `npm run dev` and click "Connect to SharePoint" on the Producer Table page!
