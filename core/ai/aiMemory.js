// aiMemory.js - Handles short-term and long-term storage for the AI
window.LogaritmaAIMemory = {
    saveContextState: function(sessionId, state) {
        window.LogaritmaStorage.save('ai_memory_' + sessionId, state);
    },
    getContextState: function(sessionId) {
        return window.LogaritmaStorage.load('ai_memory_' + sessionId) || {};
    },
    pushToHistory: function(sessionId, message) {
        let state = this.getContextState(sessionId);
        if(!state.history) state.history = [];
        state.history.push({ time: new Date().toISOString(), ...message });
        this.saveContextState(sessionId, state);
    },
    getHistory: function(sessionId) {
        const state = this.getContextState(sessionId);
        return state.history || [];
    },
    clearHistory: function(sessionId) {
        window.LogaritmaStorage.remove('ai_memory_' + sessionId);
    }
};