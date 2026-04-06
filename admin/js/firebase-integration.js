// Firebase Integration for Real-time Updates
// This module handles Firebase real-time database connections

class FirebaseIntegration {
    constructor(config) {
        this.config = config;
        this.db = null;
        this.listeners = new Map();
    }

    /**
     * Initialize Firebase connection
     */
    async initialize() {
        try {
            // Check if Firebase SDK is loaded
            if (typeof firebase === 'undefined') {
                console.warn('Firebase SDK not loaded. Real-time updates disabled.');
                return false;
            }

            // Initialize Firebase app
            if (!firebase.apps.length) {
                firebase.initializeApp(this.config);
            }

            this.db = firebase.database();
            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Firebase:', error);
            return false;
        }
    }

    /**
     * Listen for real-time updates on a specific path
     */
    listenToPath(path, callback) {
        if (!this.db) {
            console.warn('Firebase not initialized');
            return null;
        }

        const ref = this.db.ref(path);
        const listener = ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });

        this.listeners.set(path, { ref, listener });
        return listener;
    }

    /**
     * Stop listening to a specific path
     */
    stopListening(path) {
        const listener = this.listeners.get(path);
        if (listener) {
            listener.ref.off('value', listener.listener);
            this.listeners.delete(path);
        }
    }

    /**
     * Update data at a specific path
     */
    async updateData(path, data) {
        if (!this.db) {
            console.warn('Firebase not initialized');
            return false;
        }

        try {
            await this.db.ref(path).set(data);
            return true;
        } catch (error) {
            console.error('Error updating data:', error);
            return false;
        }
    }

    /**
     * Read data from a specific path
     */
    async readData(path) {
        if (!this.db) {
            console.warn('Firebase not initialized');
            return null;
        }

        try {
            const snapshot = await this.db.ref(path).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }

    /**
     * Clean up all listeners
     */
    cleanup() {
        this.listeners.forEach((listener, path) => {
            this.stopListening(path);
        });
    }
}

export default FirebaseIntegration;
