const fs = require('fs');
const path = require('path');

const inputName = process.argv.slice(2).join(' ');

if (!inputName) {
    console.error('Please provide a module name: npm run add-module <name>');
    process.exit(1);
}

const moduleName = inputName.toLowerCase().replace(/\s+/g, '-');
const capitalizedModule = inputName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
const componentName = capitalizedModule.replace(/\s+/g, '');
const appPath = path.join(process.cwd(), 'app', moduleName);
const sidebarPath = path.join(process.cwd(), 'components', 'Sidebar.tsx');

// 1. Create directory
if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath, { recursive: true });
}

// 2. Create layout.tsx
const layoutContent = `import Sidebar from '@/components/Sidebar';

export default function ${componentName}Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background transition-colors duration-300">
            <Sidebar />
            <div className="flex flex-col p-8 flex-1 min-w-0 relative">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
`;

// 3. Create page.tsx
const pageContent = `export default function ${componentName}Page() {
    return (
        <div className="max-w-full mx-auto">
            <h1 className="text-2xl font-bold mb-4">${capitalizedModule} Module</h1>
            <p className="opacity-60">Welcome to the ${capitalizedModule} module.</p>
        </div>
    );
}
`;

fs.writeFileSync(path.join(appPath, 'layout.tsx'), layoutContent);
fs.writeFileSync(path.join(appPath, 'page.tsx'), pageContent);

// 4. Update Sidebar.tsx
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

const newModuleItem = `{ name: '${capitalizedModule}', href: '/${moduleName}', icon: Settings }`;
const marker = '// MODULE_INSERTION_MARKER';

if (sidebarContent.includes(`href: '/${moduleName}'`)) {
    console.log(`Module "${inputName}" (${moduleName}) already exists in sidebar.`);
} else if (sidebarContent.includes(marker)) {
    const insertion = `${newModuleItem},\n                ${marker}`;
    sidebarContent = sidebarContent.replace(marker, insertion);
    fs.writeFileSync(sidebarPath, sidebarContent);
    console.log(`Successfully added module "${inputName}" (${moduleName}) to sidebar and app directory.`);
} else {
    console.error(`Error: Could not find marker "${marker}" in Sidebar.tsx`);
}
