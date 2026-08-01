window.DefaultWorkflows = [
    {
        id: 'WF001',
        name: 'Digital Ads Workflow',
        steps: [
            { id: 'draft', label: 'Draft', color: 'slate-500' },
            { id: 'waiting_payment', label: 'Waiting Payment', color: 'amber-500' },
            { id: 'paid', label: 'Paid', color: 'emerald-500' },
            { id: 'waiting_setup', label: 'Waiting Setup', color: 'amber-400' },
            { id: 'waiting_approval', label: 'Waiting Approval', color: 'blue-400' },
            { id: 'running', label: 'Running', color: 'indigo-500' },
            { id: 'completed', label: 'Completed', color: 'emerald-600' }
        ],
        _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('workflow') : {}
    },
    {
        id: 'WF002',
        name: 'Website Development',
        steps: [
            { id: 'requirement', label: 'Requirement', color: 'slate-500' },
            { id: 'wireframe', label: 'Wireframe', color: 'amber-500' },
            { id: 'development', label: 'Development', color: 'blue-500' },
            { id: 'qa', label: 'QA', color: 'purple-500' },
            { id: 'deploy', label: 'Deploy', color: 'indigo-500' },
            { id: 'completed', label: 'Completed', color: 'emerald-600' }
        ],
        _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('workflow') : {}
    }
];
