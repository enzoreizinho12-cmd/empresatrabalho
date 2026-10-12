import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.execPath,
  [
    "--use-system-ca",
    "--env-file=.env.local",
    "--env-file=.env.homologation",
    "./node_modules/vitest/vitest.mjs",
    "run",
    "scripts/homologation.test.ts",
  ],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_SYSTEM_CA: "1" },
  },
);

if (result.error) {
  console.error(`Não foi possível iniciar a suíte de homologação: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);