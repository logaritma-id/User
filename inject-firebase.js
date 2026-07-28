const fs = require('fs');

const files = [
    'index.html',
    'admin/index.html',
    'login/index.html',
    'tools/index.html'
];

const firebaseScripts = `    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
    <script src="/js/db.js"></script>
    `;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Prevent double injection
        if (!content.includes('firebase-app.js')) {
            // Find where to inject. Usually before <script src="/js/main.js"></script>
            // or <script src="../js/main.js"></script>
            
            // Adjust script path based on depth
            let dbScriptPath = '/js/db.js';
            if (file !== 'index.html') {
                dbScriptPath = '../js/db.js';
            } else {
                dbScriptPath = 'js/db.js';
            }
            
            const scriptsToInject = `    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
    <script src="${dbScriptPath}"></script>
`;

            content = content.replace(/<script src=".*main\.js".*><\/script>/, match => scriptsToInject + '    ' + match);
            fs.writeFileSync(file, content);
            console.log(`Injected Firebase into ${file}`);
        } else {
            console.log(`Firebase already in ${file}`);
        }
    } catch (e) {
        console.error(`Error processing ${file}: `, e);
    }
});
