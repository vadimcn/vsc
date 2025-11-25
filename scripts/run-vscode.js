const { spawnSync } = require('child_process');
const {
    downloadAndUnzipVSCode,
    resolveCliPathFromVSCodeExecutablePath
} = require('@vscode/test-electron');

async function main() {
    console.log('Downloading VS Code...');
    const vscodePath = await downloadAndUnzipVSCode('stable');
    console.log(`VS Code extracted to: ${vscodePath}`);

    const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodePath);
    const args = ['tunnel', '--accept-server-license-terms'];
    console.log(`Launching VS Code CLI with args: ${args.join(' ')}`);

    const result = spawnSync(cliPath, args, {
        stdio: 'inherit',
        env: {
            ...process.env,
            ELECTRON_RUN_AS_NODE: '1'
        }
    });

    if (result.status !== 0) {
        throw new Error('VS Code CLI exited with non-zero status');
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
