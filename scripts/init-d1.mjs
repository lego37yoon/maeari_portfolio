import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const mode = args.includes('--local') ? '--local' : '--remote';

const cmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
const result = spawnSync(cmd, ['wrangler', 'd1', 'migrations', 'apply', 'DB', mode], {
	stdio: 'inherit'
});

if (result.error) {
	console.error(result.error.message);
	process.exit(1);
}

process.exit(result.status ?? 1);
