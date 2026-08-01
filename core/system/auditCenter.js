// auditCenter.js - Logs all system changes via EventBus
window.LogaritmaAuditCenter = {
    init: function() {
        if(!window.LogaritmaEventBus) return;
        
        window.LogaritmaEventBus.on('*', (eventName, data) => {
            this.logEvent(eventName, data);
        });
    },
    
    logEvent: function(eventName, data) {
        const logEntry = {
            id: 'AUD-' + Date.now(),
            timestamp: new Date().toISOString(),
            event: eventName,
            user: 'System/Admin', // Mock user
            targetId: data && data.id ? data.id : 'Global'
        };
        
        let logs = window.LogaritmaStorage ? window.LogaritmaStorage.load('audit_logs') || [] : [];
        logs.unshift(logEntry);
        if(logs.length > 500) logs.pop();
        
        if(window.LogaritmaStorage) window.LogaritmaStorage.save('audit_logs', logs);
    }
};