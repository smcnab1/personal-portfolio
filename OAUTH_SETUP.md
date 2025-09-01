# OAuth Setup Guide for Vercel Deployment

This guide will help you fix the "redirect_uri_mismatch" error when deploying your NextAuth.js application to Vercel.

## 🚨 Current Issue

You're getting this error because your OAuth providers (GitHub and Google) are configured with redirect URIs that don't match your Vercel deployment URLs.

## 🔧 Step-by-Step Fix

### 1. Get Your Vercel Domain

First, find your Vercel deployment URL:
- Go to your [Vercel Dashboard](https://vercel.com/dashboard)
- Select your project
- Copy the production URL (e.g., `https://your-app.vercel.app`)

### 2. Update GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App
3. In the **Authorization callback URL** field, add:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```
4. **Save changes**

### 3. Update Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, add:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. **Save**

### 4. Set Environment Variables in Vercel

In your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### 5. Generate NEXTAUTH_SECRET

If you don't have a secret, generate one:

```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

### 6. Redeploy Your App

After setting environment variables:

1. Go to **Deployments** in Vercel
2. Click **Redeploy** on your latest deployment
3. Wait for the build to complete

## 🔍 Verification Steps

### Test Local Development

1. Create `.env.local` file in your project root:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

2. Test OAuth locally:
```bash
npm run dev
# Visit http://localhost:3000/api/auth/signin
```

### Test Production

1. Visit your Vercel deployment
2. Try to sign in with GitHub/Google
3. Check that you're redirected back to your app

## 🚀 Advanced Configuration

### Custom Domains

If you have a custom domain:

1. Add it to your OAuth apps:
   ```
   https://yourdomain.com/api/auth/callback/github
   https://yourdomain.com/api/auth/callback/google
   ```

2. Update `NEXTAUTH_URL` in Vercel:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

### Multiple Environments

For different environments, add multiple redirect URIs:

**GitHub:**
```
http://localhost:3000/api/auth/callback/github
https://your-app.vercel.app/api/auth/callback/github
https://yourdomain.com/api/auth/callback/github
```

**Google:**
```
http://localhost:3000/api/auth/callback/google
https://your-app.vercel.app/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
```

## 🐛 Troubleshooting

### Common Issues

1. **Still getting redirect_uri_mismatch**
   - Double-check the exact URL in your OAuth app settings
   - Ensure no trailing slashes
   - Wait a few minutes for changes to propagate

2. **OAuth app not found**
   - Verify you're using the correct Client ID and Secret
   - Check that the OAuth app is in the correct GitHub organization

3. **Environment variables not working**
   - Redeploy after setting environment variables
   - Check that variable names are exactly correct
   - Ensure no extra spaces or quotes

### Debug Mode

Enable NextAuth debug mode temporarily:

```typescript
// src/pages/api/auth/[...nextauth].ts
export default NextAuth({
  debug: true, // Add this line
  providers: [...],
  // ... rest of config
});
```

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub OAuth App Setup](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## ✅ Checklist

- [ ] Updated GitHub OAuth app redirect URI
- [ ] Updated Google OAuth app redirect URI
- [ ] Set `NEXTAUTH_URL` in Vercel
- [ ] Set `NEXTAUTH_SECRET` in Vercel
- [ ] Set OAuth client IDs and secrets in Vercel
- [ ] Redeployed application
- [ ] Tested OAuth flow locally
- [ ] Tested OAuth flow in production

After completing these steps, your OAuth authentication should work correctly on Vercel!
