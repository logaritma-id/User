// Storage Adapter Interface
const LocalStorageAdapter = {
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        return Promise.resolve(true);
    },
    load: function(key) {
        const raw = localStorage.getItem(key);
        return Promise.resolve(raw ? JSON.parse(raw) : null);
    },
    remove: function(key) {
        localStorage.removeItem(key);
        return Promise.resolve(true);
    },
    has: function(key) {
        return Promise.resolve(localStorage.getItem(key) !== null);
    }
};

window.LogaritmaStorage = {
    adapter: LocalStorageAdapter,
    
    setAdapter: function(adapter) {
        this.adapter = adapter;
    },
    
    // Sync wrapper for legacy code (since some components expect synchronous returns)
    // Warning: New modules should use Async methods if planning to migrate to Firebase
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    load: function(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },
    update: function(key, updateFn) {
        let data = this.load(key);
        if(data) {
            data = updateFn(data);
            this.save(key, data);
        }
    },
    remove: function(key) {
        localStorage.removeItem(key);
    },
    has: function(key) {
        return localStorage.getItem(key) !== null;
    },
    
    // Async standard for new modules (Production Readiness)
    saveAsync: async function(key, data) {
        return await this.adapter.save(key, data);
    },
    loadAsync: async function(key) {
        return await this.adapter.load(key);
    },
    removeAsync: async function(key) {
        return await this.adapter.remove(key);
    }
};
