const { spawnSync } = require('child_process');
const {
    downloadAndUnzipVSCode,
    resolveCliPathFromVSCodeExecutablePath
} = require('@vscode/test-electron');

function runCli(cliPath, args, env) {
    const result = spawnSync(cliPath, args, {
        stdio: 'inherit',
        env
    });

    if (result.status !== 0) {
        throw new Error(`VS Code CLI exited with non-zero status for args: ${args.join(' ')}`);
    }
}

async function main() {
    console.log('Downloading VS Code...');
    const vscodePath = await downloadAndUnzipVSCode('stable');
    console.log(`VS Code extracted to: ${vscodePath}`);

    const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodePath);
    const commonEnv = {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1'
    };

    const runTunnelArgs = ['tunnel', '--accept-server-license-terms'];
    console.log(`Launching VS Code CLI with args: ${runTunnelArgs.join(' ')}`);
    runCli(cliPath, runTunnelArgs, commonEnv);

    const unregisterArgs = ['tunnel', 'unregister'];
    console.log('Unregistering tunnel...');
    runCli(cliPath, unregisterArgs, commonEnv);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

