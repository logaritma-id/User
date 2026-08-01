// errorCenter.js - Global Exception Handler
window.LogaritmaErrorCenter = {
    errors: [],
    
    init: function() {
        // Load existing errors
        if(window.LogaritmaStorage) {
            this.errors = window.LogaritmaStorage.load('system_errors') || [];
        }
        
        // Catch unhandled JS errors
        window.addEventListener('error', (event) => {
            this.log('Javascript', event.message, event.filename, event.lineno);
        });
        
        // Catch unhandled Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.log('Promise', event.reason ? event.reason.message || event.reason : 'Unknown Promise Rejection');
        });
    },
    
    log: function(source, message, file = 'N/A', line = 0) {
        const errorEntry = {
            id: 'ERR-' + Date.now(),
            timestamp: new Date().toISOString(),
            source: source,
            message: message,
            file: file,
            line: line,
            resolved: false
        };
        
        this.errors.unshift(errorEntry); // Add to top
        if(this.errors.length > 100) this.errors.pop(); // Cap at 100
        
        if(window.LogaritmaStorage) {
            window.LogaritmaStorage.save('system_errors', this.errors);
        }
        
        console.error(`[${source} Error] ${message} (${file}:${line})`);
    },
    
    getUnresolved: function() {
        return this.errors.filter(e => !e.resolved);
    }
};