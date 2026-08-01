window.LogaritmaAI = {
    generateMetadata: function(entityType) {
        return {
            searchable: true,
            summarizable: true,
            reportable: true,
            embeddingKey: entityType,
            version: "1.0",
            lastIndexed: null
        };
    }
};
