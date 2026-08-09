#!/usr/bin/env node
// Installs the mesh-chain demo into <target>/MeshChain
// Usage: npx github:seeun92164-design/mesh-chain [targetDir]
// targetDir defaults to the current working directory.

const fs = require("fs");
const path = require("path");

const pkgRoot = path.join(__dirname, "..");
const targetBase = process.argv[2] || process.cwd();
const targetDir = path.join(targetBase, "MeshChain");

// npm strips dotfiles like .gitignore out of packed/cloned installs, so it
// is written directly here instead of being copied from the repo.
const ITEMS = ["README.md", "MeshChain.ino", "mesh-dashboard.html", "mesh_secrets.h.example"];

fs.mkdirSync(targetDir, { recursive: true });

for (const item of ITEMS) {
  const src = path.join(pkgRoot, item);
  const dest = path.join(targetDir, item);
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, dest, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, ".gitignore"), "mesh_secrets.h\n");

console.log(`mesh-chain installed to ${targetDir}`);
console.log("");
console.log("Next steps:");
console.log(`  cd "${targetDir}"`);
console.log("  arduino-cli lib install \"Painless Mesh\" \"Async TCP\"");
console.log("  # role D also needs: arduino-cli lib install PubSubClient");
console.log("  #                    cp mesh_secrets.h.example mesh_secrets.h  (fill in values)");
console.log("  # set #define MY_ROLE to 'A' / 'B' / 'C' / 'D' in MeshChain.ino, then compile+upload");
