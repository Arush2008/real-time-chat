// Configuration for different environments
const config = {
    // Update this URL after deploying to Railway
    // Example: 'https://real-time-chat-production.up.railway.app'
    PRODUCTION_SERVER_URL: 'https://real-time-chat-production.up.railway.app', 
    
    // Local development
    LOCAL_SERVER_URL: 'http://localhost:3000',
    
    // Auto-detect environment
    getServerUrl: function() {
        // If running on localhost, use local server
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:') {
            return this.LOCAL_SERVER_URL;
        }
        // Otherwise use production server
        return this.PRODUCTION_SERVER_URL;
    }
};
