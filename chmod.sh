#!/bin/bash
git config core.fileMode true
git update-index --chmod=+x .husky/pre-commit
git update-index --chmod=+x kubernetes/install.sh
git update-index --chmod=+x prepare.sh
git update-index --chmod=+x kubernetes/deinstall.sh
git update-index --chmod=+x scripts/shell/publish-npm.sh
git update-index --chmod=+x scripts/shell/publish-nuget.sh
git add .
git commit -m "chore: fix SH for exec-bash"
