window.LogaritmaRegistryEngine = {
    cache: null,

    init: function() {
        if (!window.LogaritmaStorage.has('logaritma_registry')) {
            window.LogaritmaStorage.save('logaritma_registry', window.LogaritmaDefaultRegistry);
        }
        this.cache = window.LogaritmaStorage.load('logaritma_registry');
        
        // Auto-heal if cache is corrupted or empty
        if(!this.cache.services || this.cache.services.length === 0) {
            this.cache = window.LogaritmaDefaultRegistry;
        }

        // Force sync pricing with code defaults (since no UI editor exists yet)
        if (window.DefaultPricing) {
            this.cache.pricing = window.DefaultPricing;
        }
        window.LogaritmaStorage.save('logaritma_registry', this.cache);
    },

    getRegistry: function(type) {
        if (!this.cache) this.init();
        return this.cache[type] || [];
    },

    saveRegistry: function(type, data) {
        if (!this.cache) this.init();
        this.cache[type] = data;
        window.LogaritmaStorage.save('logaritma_registry', this.cache);
        if(window.LogaritmaEventBus) window.LogaritmaEventBus.emit('registry.updated', { type: type });
    },

    getActiveServices: function() {
        return this.getRegistry('services').filter(s => s.active);
    },

    getAllServices: function() {
        return this.getRegistry('services');
    },

    getService: function(id) {
        return this.getRegistry('services').find(s => s.id === id);
    },
    
    updateService: function(id, updates) {
        const services = this.getRegistry('services');
        const index = services.findIndex(s => s.id === id);
        if (index > -1) {
            services[index] = { ...services[index], ...updates };
            this.saveRegistry('services', services);
        }
    },

    getPricingForService: function(serviceId) {
        const service = this.getService(serviceId);
        if (!service || !service.pricingIds) return [];
        return this.getRegistry('pricing').filter(p => service.pricingIds.includes(p.id));
    },

    getActivePaymentProvider: function() {
        return this.getRegistry('paymentProviders').find(p => p.active);
    }
};
