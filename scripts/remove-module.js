const fs = require('fs');
const path = require('path');
const readline = require('readline');

const inputName = process.argv.slice(2).join(' ');

if (!inputName) {
    console.error('Please provide a module name: npm run remove-module <name>');
    process.exit(1);
}

const moduleName = inputName.toLowerCase().replace(/\s+/g, '-');
const appPath = path.join(process.cwd(), 'app', moduleName);
const sidebarPath = path.join(process.cwd(), 'components', 'Sidebar.tsx');

const existsInApp = fs.existsSync(appPath);
let existsInSidebar = false;

if (fs.existsSync(sidebarPath)) {
    const content = fs.readFileSync(sidebarPath, 'utf8');
    if (content.includes(`href: '/${moduleName}'`)) {
        existsInSidebar = true;
    }
}

if (!existsInApp && !existsInSidebar) {
    console.error(`Error: Module "${inputName}" (${moduleName}) was not found in /app or Sidebar.tsx.`);
    process.exit(1);
}

const isForced = process.argv.includes('--force');

if (isForced) {
    performRemoval();
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`Are you sure you want to remove the module "${inputName}" (${moduleName})? (Y/N): `, (answer) => {
        if (answer.toLowerCase() === 'y') {
            performRemoval();
        } else {
            console.log('Action cancelled.');
        }
        rl.close();
    });
}

function performRemoval() {
    // 1. Remove directory
    if (fs.existsSync(appPath)) {
        fs.rmSync(appPath, { recursive: true, force: true });
        console.log(`Successfully removed directory: app/${moduleName}`);
    } else {
        console.warn(`Warning: Directory app/${moduleName} not found.`);
    }

    // 2. Update Sidebar.tsx
    if (fs.existsSync(sidebarPath)) {
        let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

        // Regex to find the object with the module's href
        // This regex looks for { ... href: '/moduleName' ... }
        const itemRegex = new RegExp(`\\{\\s*name:\\s*['"][^'"]+['"],\\s*href:\\s*['"]/${moduleName}['"],\\s*icon:\\s*\\w+\\s*\\},?`, 'g');

        if (itemRegex.test(sidebarContent)) {
            sidebarContent = sidebarContent.replace(itemRegex, '');
            // Clean up multiple newlines or empty commas left behind
            // sidebarContent = sidebarContent.replace(/,\s*,/g, ','); 

            fs.writeFileSync(sidebarPath, sidebarContent);
            console.log(`Successfully removed module "${inputName}" (${moduleName}) from sidebar.`);
        } else {
            console.log(`Module "${inputName}" (${moduleName}) not found in Sidebar.tsx.`);
        }
    } else {
        console.error('Error: Sidebar.tsx not found.');
    }
}
