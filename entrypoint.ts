import { spawn, spawnSync } from 'child_process'

const runOrExit = (command: string, args: string[], name: string) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    console.error(`${name} failed with exit code ${result.status ?? 'unknown'}`)
    process.exit(result.status ?? 1)
  }
}

runOrExit('bun', ['run', 'backend/src/docker-init.ts'], 'Docker init')

spawn('nginx', ['-g', 'daemon off;'], { stdio: 'inherit' })
spawn('bun', ['run', 'backend/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3000', HOSTNAME: '127.0.0.1' },
})
spawn('bun', ['run', 'app/.output/server/index.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001', HOST: '127.0.0.1' },
})
