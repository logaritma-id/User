window.DefaultServices = [
    { id: 'SRV001', name: 'Booster Prospek', category: 'Meta Ads', icon: 'fa-bullhorn', active: true, workflowId: 'WF001', checklistId: 'CHK001', pricingIds: ['PRICE001', 'PRICE002', 'PRICE003'], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('service') : {} },
    { id: 'SRV002', name: 'Search Dominance', category: 'Google Ads', icon: 'fa-magnifying-glass', active: false, workflowId: 'WF001', checklistId: 'CHK002', pricingIds: [], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('service') : {} },
    { id: 'SRV003', name: 'Viral Reach', category: 'TikTok Ads', icon: 'fa-music', active: false, workflowId: 'WF001', checklistId: 'CHK001', pricingIds: [], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('service') : {} },
    { id: 'SRV004', name: 'SEO Optimization', category: 'Website', icon: 'fa-chart-line', active: false, workflowId: 'WF002', checklistId: 'CHK003', pricingIds: [], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('service') : {} }
];
