// Admin Actions - Quick actions for the admin dashboard

const adminActions = {
    /**
     * Open Lyric Live repository
     */
    viewLyricRepo() {
        const repoUrl = 'https://github.com/Glass-Wizard-Australia-Pty-Ltd/Lyric-Live-Free-Basic-Pro';
        window.open(repoUrl, '_blank');
        this.logAction('Viewed Lyric Live repository');
    },

    /**
     * Open Subscription Starter repository
     */
    viewSubscriptionRepo() {
        const repoUrl = 'https://github.com/Glass-Wizard-Australia-Pty-Ltd/subscription-starter';
        window.open(repoUrl, '_blank');
        this.logAction('Viewed Subscription Starter repository');
    },

    /**
     * Check all issues across repositories
     */
    checkIssues() {
        const issuesUrl = 'https://github.com/wizardofoztralia85-lab/Wizard-s-Outreach-Aus/issues';
        window.open(issuesUrl, '_blank');
        this.logAction('Checked all issues');
    },

    /**
     * Check all pull requests
     */
    checkPullRequests() {
        const prsUrl = 'https://github.com/wizardofoztralia85-lab/Wizard-s-Outreach-Aus/pulls';
        window.open(prsUrl, '_blank');
        this.logAction('Checked pull requests');
    },

    /**
     * Log action to console and potentially to analytics
     */
    logAction(action) {
        console.log(`[Admin Action] ${action} at ${new Date().toLocaleString()}`);

        // In production, you could send this to analytics
        // this.sendToAnalytics(action);
    },

    /**
     * Refresh all data manually
     */
    refreshAll() {
        if (window.adminUpdater) {
            window.adminUpdater.performUpdate();
            this.logAction('Manual refresh triggered');
        }
    },

    /**
     * Export dashboard data
     */
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            repositories: [
                'Lyric-Live-Free-Basic-Pro',
                'subscription-starter'
            ],
            exportedBy: 'Admin Dashboard'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wizard-outreach-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.logAction('Exported dashboard data');
    }
};

// Make adminActions globally available
window.adminActions = adminActions;
