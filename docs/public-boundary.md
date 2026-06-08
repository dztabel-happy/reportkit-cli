# Public Repository Boundary

This repository is the public entry point for ReportKit.

It contains:

- the npm wrapper package metadata;
- the `report-kit` Node.js command shim;
- public platform package metadata;
- the Codex skill, Claude Code skill, and their public references;
- user-facing installation and usage documentation;
- lightweight public showcase screenshots used by the README.

It does not contain:

- renderer source code;
- private templates;
- schemas;
- full visual regression fixtures;
- release pressure tests;
- built platform binaries;
- source maps.

Platform binaries are published as npm platform packages from release artifacts. Do not commit `report-kit`, `report-kit.exe`, `.map` files, or private implementation files to this repository.
