const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const appDir = path.join(process.cwd(), 'app');

const MAIN_MENU = 'MAIN_MENU';
const REMOVE_MENU = 'REMOVE_MENU';
const CONFIRM_REMOVE = 'CONFIRM_REMOVE';

let currentView = MAIN_MENU;
let selectedIndex = 0;
let firstRender = true;

// Main Menu Options
const mainOptions = [
    { label: 'Create New Module', action: 'create', description: 'Scaffold a new module folder, layout, page, and sidebar entry.' },
    { label: 'Remove Module', action: 'remove', description: 'Delete a module and remove its sidebar entry.' },
    { label: 'Exit', action: 'exit', description: 'Close this CLI.' },
];

let dynamicOptions = [];
let moduleToRemove = null;

const runCommand = (command, args) => {
    return new Promise((resolve) => {
        console.log(`\n> Running: ${command} ${args.join(' ')}\n`);
        const child = spawn(command, args, { stdio: 'inherit', shell: true });
        child.on('close', (code) => {
            resolve(code);
        });
    });
};

const getInstalledModules = () => {
    try {
        const dirs = fs.readdirSync(appDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        return dirs;
    } catch (e) {
        return [];
    }
};

const renderMainTitle = () => {
    console.log('\n  EXA TEMPLATE CLI\n');
};

const renderMenu = () => {
    if (firstRender) {
        console.clear();
        firstRender = false;
    } else {
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }

    renderMainTitle();

    let optionsToRender = [];
    let titleContext = '';

    if (currentView === MAIN_MENU) {
        optionsToRender = mainOptions;
    } else if (currentView === REMOVE_MENU) {
        titleContext = '  Select a module to remove:\n';
        optionsToRender = dynamicOptions;
    } else if (currentView === CONFIRM_REMOVE) {
        titleContext = `  Are you sure you want to completely delete "${moduleToRemove}"?\n`;
        optionsToRender = dynamicOptions;
    }

    if (titleContext) console.log(titleContext);

    optionsToRender.forEach((option, index) => {
        if (index === selectedIndex) {
            console.log(`  > \x1b[36m${option.label}\x1b[0m`);
        } else {
            console.log(`    ${option.label}`);
        }
    });

    if (optionsToRender[selectedIndex]?.description) {
        console.log('\n  \x1b[90m' + optionsToRender[selectedIndex].description + '\x1b[0m\n'); // gray
    } else {
        console.log('\n');
    }
};

const setupKeyPress = () => {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    const keypressHandler = async (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit(0);
        }

        let currentOptions = [];
        if (currentView === MAIN_MENU) currentOptions = mainOptions;
        else if (currentView === REMOVE_MENU || currentView === CONFIRM_REMOVE) currentOptions = dynamicOptions;

        if (key.name === 'up') {
            selectedIndex = (selectedIndex === 0) ? currentOptions.length - 1 : selectedIndex - 1;
            renderMenu();
        } else if (key.name === 'down') {
            selectedIndex = (selectedIndex === currentOptions.length - 1) ? 0 : selectedIndex + 1;
            renderMenu();
        } else if (key.name === 'return') {

            const selectedOption = currentOptions[selectedIndex];

            if (currentView === MAIN_MENU) {
                if (selectedOption.action === 'create') {
                    process.stdin.removeListener('keypress', keypressHandler);
                    if (process.stdin.isTTY) process.stdin.setRawMode(false);
                    process.stdin.pause();

                    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                    console.clear();
                    renderMainTitle();
                    rl.question('  Enter the name of the new module (e.g. Products): ', async (name) => {
                        rl.close();
                        if (name.trim()) {
                            await runCommand('node', [path.join(__dirname, 'add-module.js'), name.trim()]);
                        }
                        // Reset to main
                        selectedIndex = 0;
                        firstRender = true;
                        setupKeyPress();
                    });
                    return;
                }
                else if (selectedOption.action === 'remove') {
                    const modules = getInstalledModules();
                    if (modules.length === 0) {
                        dynamicOptions = [{ label: 'Go Back', action: 'back', description: 'Return to the main menu.' }];
                    } else {
                        dynamicOptions = modules.map(m => ({ label: m, action: 'select_module', value: m, description: `Select "${m}" to view deletion options.` }));
                        dynamicOptions.push({ label: 'Back', action: 'back', description: 'Return to the main menu.' });
                    }
                    currentView = REMOVE_MENU;
                    selectedIndex = 0;
                    renderMenu();
                }
                else if (selectedOption.action === 'exit') {
                    console.clear();
                    process.exit(0);
                }
            }
            else if (currentView === REMOVE_MENU) {
                if (selectedOption.action === 'back') {
                    currentView = MAIN_MENU;
                    selectedIndex = 0;
                    renderMenu();
                } else if (selectedOption.action === 'select_module') {
                    moduleToRemove = selectedOption.value;
                    dynamicOptions = [
                        { label: 'Yes', action: 'confirm_delete', description: `PERMANENTLY delete the "${moduleToRemove}" module.` },
                        { label: 'No', action: 'back_to_remove', description: 'Cancel and return to the module list.' }
                    ];
                    currentView = CONFIRM_REMOVE;
                    selectedIndex = 1; // Default to 'No' for safety
                    renderMenu();
                }
            }
            else if (currentView === CONFIRM_REMOVE) {
                if (selectedOption.action === 'back_to_remove') {
                    // Go back to remove list
                    const modules = getInstalledModules();
                    dynamicOptions = modules.map(m => ({ label: m, action: 'select_module', value: m, description: `Select "${m}" to view deletion options.` }));
                    dynamicOptions.push({ label: 'Back', action: 'back', description: 'Return to the main menu.' });
                    currentView = REMOVE_MENU;
                    selectedIndex = 0;
                    renderMenu();
                } else if (selectedOption.action === 'confirm_delete') {
                    // Execute removal
                    process.stdin.removeListener('keypress', keypressHandler);
                    if (process.stdin.isTTY) process.stdin.setRawMode(false);
                    process.stdin.pause();

                    await runCommand('node', [path.join(__dirname, 'remove-module.js'), moduleToRemove, '--force']);

                    // After it finishes, return to MAIN
                    currentView = MAIN_MENU;
                    selectedIndex = 0;
                    firstRender = true;
                    setupKeyPress();
                }
            }
        }
    };

    process.stdin.on('keypress', keypressHandler);
    process.stdin.resume();
    renderMenu();
};
setupKeyPress();
