// environment.js - Handles Dev/Stag/Prod environments
window.LogaritmaEnv = {
    current: 'development', // 'development', 'staging', 'production'
    
    config: {
        development: {
            apiBase: 'http://localhost:3000/api',
            logLevel: 'debug',
            mockApis: true
        },
        staging: {
            apiBase: 'https://staging.api.logaritma.id',
            logLevel: 'warn',
            mockApis: false
        },
        production: {
            apiBase: 'https://api.logaritma.id',
            logLevel: 'error',
            mockApis: false
        }
    },
    
    get: function(key) {
        return this.config[this.current][key];
    },
    
    setEnv: function(env) {
        if(this.config[env]) {
            this.current = env;
            console.log(`[Environment] Switched to ${env}`);
        }
    }
};