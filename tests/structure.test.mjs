import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));
const expected = {
  name: "contacts",
  version: "0.1.6",
  url: "https://github.com/PedroAVJ/contacts"
};

async function json(...parts) {
  return JSON.parse(await readFile(join(root, ...parts), "utf8"));
}

test("standalone plugin metadata is synchronized", async () => {
  const codex = await json(".codex-plugin", "plugin.json");
  const claude = await json(".claude-plugin", "plugin.json");
  assert.equal(codex.name, expected.name);
  assert.equal(codex.version, expected.version);
  assert.equal(codex.homepage, expected.url);
  assert.equal(codex.repository, expected.url);
  assert.equal(claude.name, codex.name);
  assert.equal(claude.version, codex.version);
  assert.equal(claude.homepage, expected.url);
  assert.equal(claude.repository, expected.url);

  const pkg = await json("package.json");
  assert.equal(pkg.version, expected.version);
  assert.equal(pkg.homepage, expected.url + "#readme");
  assert.equal(pkg.repository.url, "git+" + expected.url + ".git");

  await access(join(root, "assets", "contacts-icon.svg"));
  await access(join(root, "ICON-SOURCES.md"));
  assert.equal(codex.interface.composerIcon, "./assets/contacts-icon.svg");
  assert.equal(codex.interface.logo, "./assets/contacts-icon.svg");
});

test("the command wrapper resolves an installed symlink", async () => {
  const wrapper = await readFile(join(root, "bin", "contacts"), "utf8");
  assert.match(wrapper, /while \[ -L "\$source_path" \]/);
  assert.match(wrapper, /readlink "\$source_path"/);
});
