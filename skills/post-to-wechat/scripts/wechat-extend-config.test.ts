import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import test, { type TestContext } from "node:test";

import { loadCredentials, parseWechatExtend } from "./wechat-extend-config.ts";

function useWechatEnv(
  t: TestContext,
  values: Partial<Record<"WECHAT_APP_ID" | "WECHAT_APP_SECRET", string | undefined>>,
): void {
  const previous = {
    WECHAT_APP_ID: process.env.WECHAT_APP_ID,
    WECHAT_APP_SECRET: process.env.WECHAT_APP_SECRET,
  };

  if (values.WECHAT_APP_ID === undefined) {
    delete process.env.WECHAT_APP_ID;
  } else {
    process.env.WECHAT_APP_ID = values.WECHAT_APP_ID;
  }

  if (values.WECHAT_APP_SECRET === undefined) {
    delete process.env.WECHAT_APP_SECRET;
  } else {
    process.env.WECHAT_APP_SECRET = values.WECHAT_APP_SECRET;
  }

  t.after(() => {
    if (previous.WECHAT_APP_ID === undefined) {
      delete process.env.WECHAT_APP_ID;
    } else {
      process.env.WECHAT_APP_ID = previous.WECHAT_APP_ID;
    }

    if (previous.WECHAT_APP_SECRET === undefined) {
      delete process.env.WECHAT_APP_SECRET;
    } else {
      process.env.WECHAT_APP_SECRET = previous.WECHAT_APP_SECRET;
    }
  });
}

async function makeTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

async function writeSkillEnvFile(root: string, content: string): Promise<void> {
  const envPath = path.join(root, ".env");
  await fs.mkdir(path.dirname(envPath), { recursive: true });
  await fs.writeFile(envPath, content);
}

test("loadCredentials reads from the skill-local .env when process.env is incomplete", async (t) => {
  const skillRoot = await makeTempDir("wechat-creds-skill-");

  useWechatEnv(t, {
    WECHAT_APP_ID: undefined,
    WECHAT_APP_SECRET: "stale-secret-from-process-env",
  });

  await writeSkillEnvFile(skillRoot, "WECHAT_APP_ID=skill-app-id\nWECHAT_APP_SECRET=skill-app-secret\n");

  const credentials = loadCredentials(undefined, {
    skillDir: skillRoot,
  });

  assert.equal(credentials.appId, "skill-app-id");
  assert.equal(credentials.appSecret, "skill-app-secret");
  assert.equal(credentials.source, "<skill>/.env");
  assert.deepEqual(credentials.skippedSources, [
    "process.env missing WECHAT_APP_ID",
  ]);
});

test("loadCredentials prefers a complete process.env pair over the skill-local .env", async (t) => {
  const skillRoot = await makeTempDir("wechat-creds-skill-");

  useWechatEnv(t, {
    WECHAT_APP_ID: "env-app-id",
    WECHAT_APP_SECRET: "env-app-secret",
  });

  await writeSkillEnvFile(skillRoot, "WECHAT_APP_ID=skill-app-id\nWECHAT_APP_SECRET=skill-app-secret\n");

  const credentials = loadCredentials(undefined, {
    skillDir: skillRoot,
  });

  assert.equal(credentials.appId, "env-app-id");
  assert.equal(credentials.appSecret, "env-app-secret");
  assert.equal(credentials.source, "process.env");
  assert.deepEqual(credentials.skippedSources, []);
});

test("loadCredentials reports skipped incomplete process.env values when no complete pair exists", async (t) => {
  const skillRoot = await makeTempDir("wechat-creds-skill-");

  useWechatEnv(t, {
    WECHAT_APP_ID: "env-app-id",
    WECHAT_APP_SECRET: undefined,
  });

  assert.throws(
    () => loadCredentials(undefined, {
      skillDir: skillRoot,
    }),
    /Incomplete credential sources skipped:\n- process\.env missing WECHAT_APP_SECRET/,
  );
});

test("loadCredentials reads credentials from the skill-local .env", async (t) => {
  const skillRoot = await makeTempDir("wechat-creds-skill-");

  useWechatEnv(t, {
    WECHAT_APP_ID: undefined,
    WECHAT_APP_SECRET: undefined,
  });

  await writeSkillEnvFile(skillRoot, "WECHAT_APP_ID=skill-app-id\nWECHAT_APP_SECRET=skill-app-secret\n");

  const credentials = loadCredentials(undefined, {
    skillDir: skillRoot,
  });

  assert.equal(credentials.appId, "skill-app-id");
  assert.equal(credentials.appSecret, "skill-app-secret");
  assert.equal(credentials.source, "<skill>/.env");
});

test("parseWechatExtend reads personal style preview preferences", () => {
  const config = parseWechatExtend(`
default_theme: zhiyuan
default_color: gray
default_author: 智元安全
preview_before_publish: 1
default_style_gallery: true
need_open_comment: 1
only_fans_can_comment: 0
`);

  assert.equal(config.default_author, "智元安全");
  assert.equal(config.default_theme, "zhiyuan");
  assert.equal(config.default_color, "gray");
  assert.equal(config.preview_before_publish, 1);
  assert.equal(config.default_style_gallery, 1);
});
