window.LogaritmaWorkflowEngine = {
    getWorkflow: function(workflowId) {
        return window.LogaritmaRegistryEngine.getRegistry('workflows').find(w => w.id === workflowId);
    },
    getChecklist: function(checklistId) {
        return window.LogaritmaRegistryEngine.getRegistry('checklists').find(c => c.id === checklistId);
    }
};
