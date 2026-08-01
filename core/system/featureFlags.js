// featureFlags.js - Toggle modules on/off
window.LogaritmaFeatureFlags = {
    flags: {
        'AI_AUTOMATION': true,
        'PAYMENT_GATEWAY': false,
        'META_API_SYNC': false,
        'WHATSAPP_NOTIF': false,
        'LLM_REAL_API': false
    },
    
    init: function() {
        // Load overrides from local storage
        const overrides = window.LogaritmaStorage ? window.LogaritmaStorage.load('feature_flags') : null;
        if (overrides) {
            this.flags = { ...this.flags, ...overrides };
        }
    },
    
    isEnabled: function(flagName) {
        return !!this.flags[flagName];
    },
    
    toggle: function(flagName, state) {
        this.flags[flagName] = state;
        if(window.LogaritmaStorage) window.LogaritmaStorage.save('feature_flags', this.flags);
        console.log(`[Feature Flag] ${flagName} is now ${state ? 'ON' : 'OFF'}`);
    }
};