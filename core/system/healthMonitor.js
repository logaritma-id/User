// healthMonitor.js - Component Health Tracking
window.LogaritmaHealthMonitor = {
    status: {
        'Core Engine': '🟢',
        'Registry': '🟢',
        'Storage': '🟢',
        'AI Engine': '🟢',
        'Event Bus': '🟢',
        'Payment Adapter': '🟡',
        'Meta API': '🔴'
    },
    
    checkPulse: function() {
        // Mocking a health check
        if(!window.LogaritmaStorage) this.status['Storage'] = '🔴';
        if(!window.LogaritmaEventBus) this.status['Event Bus'] = '🔴';
        if(!window.LogaritmaAIEngine) this.status['AI Engine'] = '🔴';
        
        if(window.LogaritmaFeatureFlags) {
            this.status['Payment Adapter'] = window.LogaritmaFeatureFlags.isEnabled('PAYMENT_GATEWAY') ? '🟢' : '🟡';
            this.status['Meta API'] = window.LogaritmaFeatureFlags.isEnabled('META_API_SYNC') ? '🟢' : '🔴';
        }
        
        return this.status;
    }
};