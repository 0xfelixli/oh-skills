# Security Policy

## Reporting a Vulnerability

Please report security issues privately by opening a GitHub security advisory or contacting the repository owner through GitHub.

Do not include working credentials, access tokens, cookies, private keys, or unpublished exploit details in public issues.

## Scope

This repository contains agent skills and supporting scripts. Reports are especially useful when they involve:

- credential leakage or unsafe credential handling
- unintended local file access
- unsafe shell execution
- browser automation that can expose account data
- dependency or supply-chain risks in bundled scripts

## User Responsibility

Review each skill before installing it. Some skills intentionally use local files, browser automation, external APIs, or credentials when the user asks for those workflows.
