# Public Repository Boundary

This repository is the public entry point for ReportKit.

Local repository path:

```text
/Users/abel/project/zhiyun-product/cli-mcp/reportkit-cli
```

It contains:

- the npm wrapper package metadata;
- the `report-kit` Node.js command shim;
- public platform package metadata;
- the Codex skill, Claude Code skill, and their public references;
- user-facing installation and usage documentation.

It does not contain:

- renderer source code;
- private templates;
- schemas;
- visual regression fixtures;
- release pressure tests;
- built platform binaries;
- source maps.

Platform binaries are published as npm platform packages from release artifacts. Do not commit `report-kit`, `report-kit.exe`, `.map` files, or private implementation files to this repository.
