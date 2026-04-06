// Admin Updater - Auto-refresh functionality for Wizard's Outreach Admin Dashboard

class AdminUpdater {
    constructor() {
        this.refreshInterval = 30000; // 30 seconds
        this.countdownInterval = null;
        this.updateInterval = null;
        this.autoRefreshEnabled = true;
        this.countdown = 30;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoRefresh();
        this.performUpdate();
    }

    setupEventListeners() {
        const manualRefreshBtn = document.getElementById('manual-refresh');
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');

        manualRefreshBtn.addEventListener('click', () => {
            this.performUpdate();
            this.resetCountdown();
        });

        autoRefreshToggle.addEventListener('change', (e) => {
            this.autoRefreshEnabled = e.target.checked;
            if (this.autoRefreshEnabled) {
                this.startAutoRefresh();
            } else {
                this.stopAutoRefresh();
            }
        });
    }

    startAutoRefresh() {
        this.stopAutoRefresh(); // Clear any existing intervals

        // Update countdown every second
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            document.getElementById('countdown').textContent = this.countdown;

            if (this.countdown <= 0) {
                this.resetCountdown();
            }
        }, 1000);

        // Perform update every 30 seconds
        this.updateInterval = setInterval(() => {
            if (this.autoRefreshEnabled) {
                this.performUpdate();
            }
        }, this.refreshInterval);
    }

    stopAutoRefresh() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    resetCountdown() {
        this.countdown = 30;
        document.getElementById('countdown').textContent = this.countdown;
    }

    async performUpdate() {
        console.log('Performing update...');
        const timestamp = new Date().toLocaleString();
        document.getElementById('last-update').textContent = `Last updated: ${timestamp}`;

        await Promise.all([
            this.updateRepositoryStatus(),
            this.updateActivityFeed(),
            this.updateSystemHealth()
        ]);
    }

    async updateRepositoryStatus() {
        try {
            // Update Lyric Live status
            const lyricStatus = await this.fetchRepoStatus('Glass-Wizard-Australia-Pty-Ltd', 'Lyric-Live-Free-Basic-Pro');
            this.updateStatusCard('lyric-status', lyricStatus);

            // Update Subscription Starter status
            const subscriptionStatus = await this.fetchRepoStatus('Glass-Wizard-Australia-Pty-Ltd', 'subscription-starter');
            this.updateStatusCard('subscription-status', subscriptionStatus);
        } catch (error) {
            console.error('Error updating repository status:', error);
        }
    }

    async fetchRepoStatus(owner, repo) {
        // Simulated API call - in production, this would call GitHub API
        // For now, return mock data
        return {
            status: 'success',
            lastCommit: 'Updated dependencies',
            lastUpdate: new Date().toLocaleDateString(),
            branches: Math.floor(Math.random() * 5) + 1,
            openIssues: Math.floor(Math.random() * 10),
            openPRs: Math.floor(Math.random() * 3)
        };
    }

    updateStatusCard(elementId, data) {
        const element = document.getElementById(elementId);
        const card = element.closest('.status-card');
        const indicator = card.querySelector('.status-indicator');

        if (data.status === 'success') {
            indicator.className = 'status-indicator success';
            indicator.textContent = '✓ Active';
        } else {
            indicator.className = 'status-indicator error';
            indicator.textContent = '✗ Error';
        }

        element.innerHTML = `
            <p><strong>Last Commit:</strong> ${data.lastCommit}</p>
            <p><strong>Last Update:</strong> ${data.lastUpdate}</p>
            <p><strong>Branches:</strong> ${data.branches}</p>
            <p><strong>Open Issues:</strong> ${data.openIssues}</p>
            <p><strong>Open PRs:</strong> ${data.openPRs}</p>
        `;
    }

    async updateActivityFeed() {
        const activityFeed = document.getElementById('activity-feed');

        // Simulated activity data - in production, fetch from GitHub API
        const activities = [
            {
                timestamp: new Date(Date.now() - 300000).toLocaleString(),
                description: 'New pull request opened in Lyric-Live-Free-Basic-Pro'
            },
            {
                timestamp: new Date(Date.now() - 600000).toLocaleString(),
                description: 'Issue #12 was closed in subscription-starter'
            },
            {
                timestamp: new Date(Date.now() - 900000).toLocaleString(),
                description: 'Code pushed to main branch in Lyric-Live-Free-Basic-Pro'
            },
            {
                timestamp: new Date(Date.now() - 1200000).toLocaleString(),
                description: 'New contributor joined subscription-starter'
            }
        ];

        activityFeed.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="timestamp">${activity.timestamp}</div>
                <div class="description">${activity.description}</div>
            </div>
        `).join('');
    }

    async updateSystemHealth() {
        // Simulate health checks
        await this.checkAPIHealth();
        await this.checkFirebaseHealth();
        await this.checkGitHubHealth();
    }

    async checkAPIHealth() {
        const indicator = document.getElementById('api-health');
        indicator.className = 'health-indicator healthy';
        indicator.textContent = '✓ Operational';
    }

    async checkFirebaseHealth() {
        const indicator = document.getElementById('firebase-health');
        // Simulate Firebase check
        const isHealthy = Math.random() > 0.1; // 90% chance of being healthy

        if (isHealthy) {
            indicator.className = 'health-indicator healthy';
            indicator.textContent = '✓ Connected';
        } else {
            indicator.className = 'health-indicator warning';
            indicator.textContent = '⚠ Degraded';
        }
    }

    async checkGitHubHealth() {
        const indicator = document.getElementById('github-health');
        indicator.className = 'health-indicator healthy';
        indicator.textContent = '✓ Operational';
    }
}

// Initialize the admin updater when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const updater = new AdminUpdater();
    window.adminUpdater = updater; // Make it globally accessible for debugging
});

// Export for potential module usage
export default AdminUpdater;
