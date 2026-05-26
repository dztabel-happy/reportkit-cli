#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const packageRoot = path.resolve(__dirname, "..");
const pythonPath = process.env.PYTHONPATH
  ? `${packageRoot}${path.delimiter}${process.env.PYTHONPATH}`
  : packageRoot;
const bundledBinary = findBundledBinary();

const result = bundledBinary ? runBundledBinary(bundledBinary) : runPythonPrototypeIfAvailable();

if (result.error) {
  console.error(`report-kit: failed to start: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);

function findBundledBinary() {
  const platformBinary = findPlatformPackageBinary();
  if (platformBinary) {
    return platformBinary;
  }

  const candidates = [
    path.join(packageRoot, "dist", process.platform === "win32" ? "report-kit.exe" : "report-kit"),
    path.join(packageRoot, "dist", "report-kit"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function findPlatformPackageBinary() {
  const packageName = platformPackageName();
  if (!packageName) {
    return null;
  }
  try {
    const packageJson = require.resolve(`${packageName}/package.json`, { paths: [packageRoot] });
    const platformRoot = path.dirname(packageJson);
    const binary = path.join(platformRoot, process.platform === "win32" ? "report-kit.exe" : "report-kit");
    return fs.existsSync(binary) ? binary : null;
  } catch (_) {
    return null;
  }
}

function platformPackageName() {
  const arch = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
  if (!arch) {
    return null;
  }
  if (process.platform === "darwin") {
    return `@dztabel/reportkit-darwin-${arch}`;
  }
  if (process.platform === "linux") {
    return `@dztabel/reportkit-linux-${arch}`;
  }
  if (process.platform === "win32") {
    return `@dztabel/reportkit-windows-${arch}`;
  }
  return null;
}

function runBundledBinary(binary) {
  return spawnSync(binary, process.argv.slice(2), {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });
}

function runPythonPrototypeIfAvailable() {
  if (!fs.existsSync(path.join(packageRoot, "report_kit", "cli.py"))) {
    const packageName = platformPackageName();
    console.error("report-kit: platform package is missing.");
    console.error(
      packageName
        ? `report-kit: expected optional dependency ${packageName} to provide the binary.`
        : `report-kit: unsupported platform ${process.platform}/${process.arch}.`,
    );
    console.error("report-kit: reinstall report-kit or install a package built for this platform.");
    process.exit(1);
  }
  const python = selectPython();
  return spawnSync(python, ["-m", "report_kit.cli", ...process.argv.slice(2)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PYTHONPATH: pythonPath,
    },
    stdio: "inherit",
  });
}

function selectPython() {
  const explicit = [process.env.REPORT_KIT_PYTHON, process.env.PYTHON].filter(Boolean);
  const candidates = explicit.length
    ? explicit
    : ["python3.13", "python3.12", "python3.11", "python3.10", "python3", "python"];

  for (const candidate of candidates) {
    const probe = spawnSync(
      candidate,
      ["-c", "import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)"],
      { stdio: "ignore" },
    );
    if (probe.status === 0) {
      return candidate;
    }
  }

  console.error("report-kit: Python 3.10+ is required for local source checkout fallback.");
  console.error("report-kit: set REPORT_KIT_PYTHON to a compatible Python interpreter.");
  process.exit(1);
}
