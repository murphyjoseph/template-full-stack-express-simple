import { execSync } from 'child_process';

export function setup() {
  execSync('pnpm db:push', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'ignore',
  });
}
