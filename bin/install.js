#!/usr/bin/env node
// Installs the mesh-chain demo into <target>/MeshChain
// Usage: npx github:seeun92164-design/mesh-chain [targetDir]
// targetDir defaults to the current working directory.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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

// PubSubClient is only used by whoever flashes role D, but installing it for
// everyone avoids asking each teammate whether they need it.
const LIBRARIES = ["Painless Mesh", "Async TCP", "PubSubClient"];

let arduinoCliAvailable = true;
try {
  execSync("arduino-cli version", { stdio: "ignore" });
} catch (e) {
  arduinoCliAvailable = false;
}

if (arduinoCliAvailable) {
  console.log("Installing Arduino libraries via arduino-cli...");
  for (const lib of LIBRARIES) {
    try {
      execSync(`arduino-cli lib install "${lib}"`, { stdio: "inherit" });
    } catch (e) {
      console.log(`  WARNING: failed to install "${lib}" - install it manually (Library Manager or arduino-cli lib install).`);
    }
  }
} else {
  console.log("arduino-cli not found on PATH - skipping automatic library install.");
  console.log("Install these manually (Arduino IDE Library Manager or arduino-cli):");
  for (const lib of LIBRARIES) console.log(`  - ${lib}`);
  console.log('NOTE: "Async TCP" must be the ESP32Async fork, not the older "AsyncTCP" by dvarrel.');
}

console.log("");
console.log("Next steps:");
console.log(`  cd "${targetDir}"`);
console.log("  # role D also needs: cp mesh_secrets.h.example mesh_secrets.h  (fill in values)");
console.log("  # set #define MY_ROLE to 'A' / 'B' / 'C' / 'D' in MeshChain.ino, then compile+upload");
