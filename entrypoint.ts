import { spawn, spawnSync } from 'child_process'

const runOrExit = (
  command: string,
  args: string[],
  name: string,
  envOverrides: Record<string, string> = {},
) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...envOverrides },
  })

  if (result.status !== 0) {
    console.error(`${name} failed with exit code ${result.status ?? 'unknown'}`)
    process.exit(result.status ?? 1)
  }
}

// Payload manages schema changes automatically outside production.
// Run the one-off bootstrap with a development env, then start the real servers in production mode.
runOrExit('bun', ['run', 'backend/src/docker-init.ts'], 'Docker init', {
  NODE_ENV: 'development',
})

spawn('nginx', ['-g', 'daemon off;'], { stdio: 'inherit' })
spawn('bun', ['run', 'backend/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3000', HOSTNAME: '127.0.0.1' },
})
spawn('bun', ['run', 'app/.output/server/index.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001', HOST: '127.0.0.1' },
})
