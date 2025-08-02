// Configuration for different environments
const config = {
    // Replace this with your actual Render URL after deployment
    // Example: 'https://chat-server-abc123.onrender.com'
    PRODUCTION_SERVER_URL: 'YOUR_RENDER_URL_HERE', // ⬅️ REPLACE WITH YOUR RENDER URL

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
