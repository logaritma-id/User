window.DefaultRoles = [
    { id: 'ROLE_OWNER', name: 'Owner', permissions: ['workorder.read', 'workorder.write', 'service.edit', 'workflow.edit', 'checklist.edit', 'pricing.edit', 'payment.edit', 'role.edit'], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('role') : {} },
    { id: 'ROLE_ADMIN', name: 'Admin', permissions: ['workorder.read', 'workorder.write', 'service.read', 'workflow.read', 'checklist.read', 'pricing.read'], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('role') : {} },
    { id: 'ROLE_PIC', name: 'PIC', permissions: ['workorder.read', 'workorder.update_status'], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('role') : {} },
    { id: 'ROLE_CUSTOMER', name: 'Customer', permissions: ['workorder.read_own', 'workorder.create'], _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('role') : {} }
];
