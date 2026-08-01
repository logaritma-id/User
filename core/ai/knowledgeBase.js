// knowledgeBase.js - Permanent AI Asset Storage
window.LogaritmaKnowledgeBase = {
    // Categories: copywriting, report_summary, sop, prompt_library, case_study
    maxPerCategory: 50,
    
    saveAsset: function(category, title, content, meta = {}) {
        let kb = window.LogaritmaStorage ? window.LogaritmaStorage.load('knowledge_base') || {} : {};
        if(!kb[category]) kb[category] = [];
        
        const asset = {
            id: 'KB-' + Date.now(),
            version: 1,
            timestamp: new Date().toISOString(),
            category: category,
            title: title,
            content: content,
            rating: 0, // Used to curate quality assets
            learning_queue: true, // Mark for periodic RAG embedding
            ...meta
        };
        
        kb[category].unshift(asset);
        
        // Enforce limits
        if(kb[category].length > this.maxPerCategory) {
            // Keep top rated, prune oldest unrated
            kb[category].sort((a, b) => b.rating - a.rating || new Date(b.timestamp) - new Date(a.timestamp));
            kb[category] = kb[category].slice(0, this.maxPerCategory);
        }
        
        if(window.LogaritmaStorage) window.LogaritmaStorage.save('knowledge_base', kb);
        console.log(`[Knowledge Base] Saved asset to ${category}: ${title}`);
        
        return asset.id;
    },
    
    rateAsset: function(id, delta) {
        let kb = window.LogaritmaStorage ? window.LogaritmaStorage.load('knowledge_base') || {} : {};
        let found = false;
        
        for(const cat in kb) {
            const asset = kb[cat].find(a => a.id === id);
            if(asset) {
                asset.rating += delta;
                found = true;
                break;
            }
        }
        
        if(found && window.LogaritmaStorage) {
            window.LogaritmaStorage.save('knowledge_base', kb);
        }
    },
    
    getAssets: function(category) {
        let kb = window.LogaritmaStorage ? window.LogaritmaStorage.load('knowledge_base') || {} : {};
        return kb[category] || [];
    }
};