const { spawnSync } = require('child_process');
const {
    downloadAndUnzipVSCode,
    resolveCliArgsFromVSCodeExecutablePath
} = require('@vscode/test-electron');

function resolveCliPlatform() {
    switch (process.platform) {
        case 'linux':
            return process.arch === 'arm64' ? 'cli-linux-arm64' : 'cli-linux-x64';
        case 'darwin':
            return process.arch === 'arm64' ? 'cli-darwin-arm64' : 'cli-darwin-x64';
        case 'win32':
            return process.arch === 'arm64' ? 'cli-win32-arm64' : 'cli-win32-x64';
        default:
            throw new Error(`Unsupported platform ${process.platform} / ${process.arch}`);
    }
}

function runCliCommand(cliPath, args) {
    console.log(`Running ${cliPath} ${args.join(' ')}`);
    const result = spawnSync(cliPath, args, { stdio: 'inherit' });
    if (result.status !== 0) {
        console.error(`Exited with non-zero status ${result.status}`);
    }
    return result.status;
}

async function main() {
    const platform = resolveCliPlatform();
    console.log(`Downloading VS Code CLI for platform: ${platform}`);
    const vscodePath = await downloadAndUnzipVSCode({ version: 'stable', platform });
    console.log(`VS Code CLI extracted to: ${vscodePath}`);

    const [cliPath, ...cliDefaults] = resolveCliArgsFromVSCodeExecutablePath(vscodePath, { platform });

    runCliCommand(cliPath, [...cliDefaults, 'tunnel', '--accept-server-license-terms']);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
