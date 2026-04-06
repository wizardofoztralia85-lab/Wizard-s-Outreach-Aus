# Admin Front-End Updater

A self-updating admin dashboard for Wizard's Outreach Australia that automatically refreshes data and monitors repository status.

## Features

### 🔄 Auto-Refresh
- Automatically updates every 30 seconds
- Manual refresh button for immediate updates
- Toggle auto-refresh on/off
- Countdown timer showing next update

### 📊 Repository Monitoring
- Real-time status of Lyric Live Free Basic Pro repository
- Real-time status of Subscription Starter repository
- Display of open issues, pull requests, and recent commits
- Visual indicators for repository health

### 📰 Activity Feed
- Recent activity across all repositories
- Commit history
- Issue and PR updates
- Team activity tracking

### ⚡ Quick Actions
- Direct links to repositories
- Quick access to issues and pull requests
- One-click navigation to key resources

### 🏥 System Health Monitoring
- API status checking
- Firebase connection monitoring
- GitHub API health checks
- Visual health indicators

## Getting Started

### 1. Setup

1. Copy the environment configuration:
   ```bash
   cp admin/config/.env.example admin/config/.env
   ```

2. Edit `admin/config/.env` with your Firebase credentials

3. Update `admin/config/firebase-config.js` with your Firebase project details

### 2. Firebase Setup (Optional)

If you want real-time updates via Firebase:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Copy your Firebase configuration
4. Update the config files with your credentials

### 3. Open the Dashboard

Simply open `admin/index.html` in a web browser:

```bash
open admin/index.html
```

Or serve it using a local web server:

```bash
cd admin
python -m http.server 8000
# Then visit http://localhost:8000
```

## File Structure

```
admin/
├── index.html                          # Main dashboard page
├── css/
│   └── admin-styles.css               # Dashboard styling
├── js/
│   ├── admin-updater.js               # Auto-refresh logic
│   ├── admin-actions.js               # Quick action handlers
│   └── firebase-integration.js        # Firebase real-time updates
└── config/
    ├── .env.example                   # Environment variables template
    └── firebase-config.js             # Firebase configuration
```

## Usage

### Auto-Refresh

The dashboard automatically refreshes every 30 seconds. You can:

- **Toggle auto-refresh**: Use the checkbox in the header
- **Manual refresh**: Click the "↻ Refresh Now" button
- **View countdown**: See the countdown timer until next update

### Quick Actions

Use the action buttons to:

- **View Lyric Live Repo**: Opens the Lyric Live repository in a new tab
- **View Subscription Repo**: Opens the Subscription Starter repository in a new tab
- **Check All Issues**: View all open issues
- **Check Pull Requests**: View all open pull requests

### Monitoring

The dashboard displays:

- **Repository Status**: Last commits, branches, issues, and PRs
- **Activity Feed**: Recent events across all repositories
- **System Health**: Status of APIs and connections

## Customization

### Change Refresh Interval

Edit `admin/js/admin-updater.js`:

```javascript
this.refreshInterval = 30000; // Change to desired milliseconds
```

### Add More Repositories

Edit the `updateRepositoryStatus()` method in `admin-updater.js` to add more repositories.

### Customize Styling

Edit `admin/css/admin-styles.css` to change colors, fonts, and layout.

## Integration with GitHub API

To fetch real data from GitHub:

1. Get a GitHub Personal Access Token
2. Add it to your `.env` file
3. Update the `fetchRepoStatus()` method in `admin-updater.js` to call the GitHub API

Example:
```javascript
async fetchRepoStatus(owner, repo) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            'Authorization': `token ${YOUR_GITHUB_TOKEN}`
        }
    });
    return await response.json();
}
```

## Security Notes

- **Never commit** `.env` files with real credentials
- **Use environment variables** for sensitive data
- **Restrict API tokens** to minimum required permissions
- **Enable CORS** if hosting on a different domain

## Troubleshooting

### Dashboard not updating?

1. Check browser console for errors
2. Verify auto-refresh is enabled
3. Check network connectivity
4. Verify Firebase configuration (if using real-time updates)

### Firebase not connecting?

1. Verify Firebase credentials in config files
2. Check Firebase console for project status
3. Ensure Realtime Database is enabled
4. Check browser console for Firebase errors

### Styling issues?

1. Clear browser cache
2. Check that CSS file is loaded
3. Verify file paths are correct

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers supported

## Contributing

This dashboard is part of the Wizard's Outreach Australia project. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See LICENSE file in the root directory.

## Support

For issues or questions, please open an issue on GitHub.

---

**Wizard's Outreach Australia** - Making admin work easier! 🧙✨
