> This guide explains how to manually migrate the PATTERNU repository template
> into your own repository, using the base ZIP archive attached in the release.
> It is intended for cases when you choose to migrate this template manually, typically
> into an unpublished local repository.
> You may choose to keep or update this ASCII art to reflect your own branding.

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Step-by-step migration](#step-by-step-migration)
  - [1. Copy archive contents](#1-copy-archive-contents)
  - [2. Edit Git environment files](#2-edit-git-environment-files)
    - [2.1 `.gitignore`](#21-gitignore)
    - [2.2 `.gitattributes`](#22-gitattributes)
    - [2.3 Dependabot configuration](#23-dependabot-configuration)
    - [2.4 Repository settings \& apps](#24-repository-settings--apps)
  - [3. Clean residual template references](#3-clean-residual-template-references)
  - [4. Using automation and scripts](#4-using-automation-and-scripts)
  - [5. Web setup after publishing your repository](#5-web-setup-after-publishing-your-repository)
    - [5.1 Import rulesets for branches and tags](#51-import-rulesets-for-branches-and-tags)
    - [5.2 Configure web settings](#52-configure-web-settings)
- [Notes and tips](#notes-and-tips)

## Introduction

This document describes how to migrate the PATTERNU template repository into your
own project repository. It applies when you perform a **manual** migration, typically
to an unpublished, local repository. Follow each step carefully to ensure you remove
or update all template-specific settings, metadata, and documentation, and configure
your project environment correctly.

## Prerequisites

- A local or remote repository (empty or existing) where you want to migrate the
  template.
- The ZIP archive of the PATTERNU template release downloaded locally.
- Permissions to configure repository settings (e.g., GitHub repository admin rights)
  for web-based setup later.
- Familiarity with Git, GitHub Actions/Apps, Dependabot, Node.js/TypeScript environment
  (since PATTERNU uses scripts in TypeScript), and other tools you plan to integrate.

## Step-by-step migration

### 1. Copy archive contents

1. Download and unzip the PATTERNU template ZIP archive from the release.
2. Copy all files and directories from the unzipped archive into the root of your
   target repository.
   - If cloning directly from a local ZIP, you may use commands like:

     ```bash
     unzip PATTERNU-template.zip -d temp-patternu
     cp -R temp-patternu/* /path/to/your-repo/
     ```

   - Ensure hidden files (e.g., `.gitignore`, `.gitattributes`, `.github/`) are included.

### 2. Edit Git environment files

In the root of your repository, locate and adapt the following:

#### 2.1 `.gitignore`

- Review entries; keep those relevant (e.g., build artifacts, secrets) and remove
  or adjust entries that do not apply.
- Add patterns specific to your project technology stack (e.g., IDE temp files,
  system-specific files).

#### 2.2 `.gitattributes`

- Adjust any text/binary handling rules, end-of-line settings, language-specific
  attributes.
- Remove or modify rules tailored to the PATTERNU template but not needed in your
  project.

> _Refer to any `*-readme` or documentation files included in the template for_
  _guidance on special tools or configurations._

#### 2.3 Dependabot configuration

- Locate the Dependabot config file (e.g., `.github/dependabot.yml`).
- Update package-ecosystem entries, directories, schedules, and any credentials
  or secrets references to match your project dependencies.

#### 2.4 Repository settings & apps

- Open `settings.yml` and `settings.json` (depending on template).
- Configure all fields for your project:
  - Update names, endpoints, tokens, schedules, or other parameters.
  - Remove entries referencing PATTERNU-specific apps or settings you do not use.
- Connect GitHub Apps or Actions your project uses, including basics like:
    1. ImgBot
    2. Settings

### 3. Clean residual template references

Search for and update or remove mentions of the template project and its metadata.
Typical places include:

- **Issue and discussion templates**:
  - `/.github/ISSUE_TEMPLATE/`
  - `/.github/DISCUSSION_TEMPLATE/`
  - Review files and replace references (text, links) to the original template repository.
- **Keys directory**:
  - `/.github/keys/`
  - Remove or replace any keys or signatures belonging to the template project to
    avoid using its identities.
- **CODEOWNERS**:
  - Open `CODEOWNERS`; update the author or team entries so that you (or your organization)
    are listed as owners.
  - Remove references to PATTERNU maintainers.
- **Documentation files**:
  - Files that contain project name or links:
    - `SECURITY.md`
    - `CONTRIBUTING.md`
    - `ISSUE_POLICY.md`
    - `ISSUE_TEMPLATE.md`
    - `CODE_OF_CONDUCT.md`
    - `PULL_REQUEST_TEMPLATE.md`
  - Update project name, URLs, contact emails, issue links to point to your
    repository and maintainers.
  - If some docs are not relevant, consider removing them.
- **Optional documentation folders** (remove if unnecessary):
  - `/.husky/docs/`
  - `/build/README`
  - `/data/`
  - `/docs/`
  - If you run your own Kubernetes instance: remove `/kubernetes/` or adapt
    configuration inside.
  - `/release/`
  - If you run your own shfmt instance: note that the script file is named `shfmt.cmd`;
    remove `/shfmt/` folder or adapt it.
  - Pattern-specific docs: files matching `*-comments`, `*-readme`.
  - `REFERENCES.md`
  - `REFERENCES.json`
  - `UNSUPPORTED_VERSIONS.md` (remove if you won't use the versioning script or
    SemVer policy).

> **Tip:** Use search (e.g., `grep -R "PATTERNU" .` or search for template repo URL)
> to find leftover references.

### 4. Using automation and scripts

PATTERNU includes TypeScript scripts to automate reference-finding and setup.
Key points:

- **Reference-Finder Script (`index.ts`)**:
  - The main script for finding references to the template is `index.ts` in the
    root or scripts folder.
  - You can run it via:

    ```bash
    # Using ts-node or tsx if installed globally or in project
    ts-node index.ts
    # or
    tsx index.ts
    # or via npm script, often defined as:
    npm start
    ```

  - Ensure you have installed dependencies (`npm install`) so that TypeScript and
    related packages are available.
  - Review `index.ts` logic to understand what it scans (e.g., file patterns, author
    references), and adapt or extend as needed for your project structure.

- **Preparation script integration**:
  - During package installation (e.g., `npm install`), the `index.ts` preparation
    script may run to automate future manifest updates or initial setup.
  - Check `package.json` scripts section to see if `preinstall`, `postinstall`,
    or other hooks invoke `index.ts`.
  - If you change file structure or configuration, update `index.ts` or related
    scripts so automation continues to work correctly.
- **ESBUILD configuration**:
  - PATTERNU includes ESBUILD configuration to bundle or transpile scripts.
  - Review and edit this config if you add/remove entry points, change output targets,
    or adjust plugin settings.
- **SHFMT script**:
  - The formatting script is provided as `shfmt.cmd` (Windows-only).
  - If you use shfmt in CI or locally, adapt or remove `shfmt.cmd` as appropriate.

> **IMPORTANT**: Review all scripts before running; adapt them if they assume
> specific paths, names, or environment variables tied to PATTERNU. Ensure Node.js/TypeScript
> toolchain is installed in your development environment.

### 5. Web setup after publishing your repository

Once you push your repository (e.g., to GitHub):

#### 5.1 Import rulesets for branches and tags

- Locate the rules definition files under `/.github/rules/` in the template.
- In your repository's settings (e.g., GitHub branch protection rules), import or
  manually configure branch and tag rules matching those definitions.
  - This may include requiring PR reviews, status checks, signing commits, etc.

#### 5.2 Configure web settings

- Open web-settings files (commonly JSON/YAML) provided by the template.
- In GitHub (or other hosting) settings, integrate apps, set environment variables,
  enable Actions, set secrets, webhooks, etc., as specified.
- Ensure any third-party integrations (e.g., imgbot) are authorized and configured
  for your repository.

## Notes and tips

- **Backup first**: If migrating into an existing repository with content, commit
  or stash existing work before copying template contents. Better open pull request.
- **Version control**: After migration, make a dedicated initial commit or series
  of commits clearly documenting "Apply PATTERNU template" so history is clear.
- **Testing**: Run CI workflows locally or in a test branch to verify that Actions,
  Dependabot updates, linters, formatting scripts (e.g., shfmt), and TypeScript
  scripts function correctly after migration.
- **Documentation**: Update readme, badges, and project metadata (e.g., `package.json`)
  to reflect your project's purpose.
- **Consistent naming**: Replace all occurrences of the template's name, author
  details, URLs, and badges with your own project's equivalents.
- **Security**: Audit any secrets, keys, or tokens included or referenced by the
  template; generate new ones for your project.
- **Community guidelines**: Adapt `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, and `ISSUE_POLICY.md`
  to match your project's governance and maintainers.
- **Automation scripts**: After initial migration, consider deleting or archiving
  PATTERNU-specific scripts unless you intend to reuse them; avoid confusion.
