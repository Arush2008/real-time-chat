// Configuration for different environments
const config = {
    // Change this to your deployed server URL once deployed
    PRODUCTION_SERVER_URL: 'https://your-app-name.up.railway.app', // Update this after deployment
    
    // Local development
    LOCAL_SERVER_URL: 'http://localhost:3000',
    
    // Auto-detect environment
    getServerUrl: function() {
        // If running on localhost, use local server
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.LOCAL_SERVER_URL;
        }
        // Otherwise use production server
        return this.PRODUCTION_SERVER_URL;
    }
};
