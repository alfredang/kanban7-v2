// Keeps the Content-Security-Policy hashes in index.html in step with its
// inline <style> and <script> blocks.
//
//   node tools/csp.mjs --write   recompute the hashes and update the CSP meta tag
//   node tools/csp.mjs --check   exit 1 if the hashes are stale (used by CI)
//
// No dependencies: Node's built-in fs and crypto only.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const file = new URL("../index.html", import.meta.url);
const mode = process.argv[2];
if (mode !== "--write" && mode !== "--check") {
  console.error("Usage: node tools/csp.mjs --write | --check");
  process.exit(2);
}

const html = readFileSync(file, "utf8");
const block = tag => {
  const matches = [...html.matchAll(new RegExp(`^<${tag}>([\\s\\S]*?)^</${tag}>`, "gm"))];
  if (matches.length !== 1) throw new Error(`Expected exactly one inline <${tag}> block, found ${matches.length}`);
  return matches[0][1];
};
const sha = text => `sha256-${createHash("sha256").update(text, "utf8").digest("base64")}`;

const scriptHash = sha(block("script"));
const styleHash = sha(block("style"));

const updated = html
  .replace(/script-src '[^']*'/, `script-src '${scriptHash}'`)
  .replace(/style-src '[^']*'/, `style-src '${styleHash}'`);

if (mode === "--write") {
  writeFileSync(file, updated);
  console.log(`CSP updated\n  script-src '${scriptHash}'\n  style-src  '${styleHash}'`);
} else if (updated !== html) {
  console.error("CSP hashes in index.html are stale. Run: node tools/csp.mjs --write");
  process.exit(1);
} else {
  console.log("CSP hashes are up to date.");
}
