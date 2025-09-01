# Spotify API Setup

To fix the Spotify API 400 errors, you need to configure your Spotify API credentials.

## Steps:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Get your Client ID and Client Secret
4. Set up a redirect URI (e.g., `http://localhost:3000/api/auth/callback/spotify`)
5. Get a refresh token using the Spotify OAuth flow

## Environment Variables

Create a `.env.local` file in your project root with:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token_here
```

## Getting a Refresh Token

1. Visit: `https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-currently-playing,user-read-playback-state`
2. Authorize the app
3. Copy the `code` from the redirect URL
4. Exchange the code for a refresh token using the Spotify API

## Alternative: Disable Spotify Features

If you don't want to use Spotify features, the app will now gracefully handle missing credentials and return empty data instead of crashing. 