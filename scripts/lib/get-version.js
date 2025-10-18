/*
 * Script was made by: @electron
 * Will not be refactored or touched, for more information, see their
 * GitHub page:
 * https://github.com/electron/electron
 *
 * Electron.js repository is licensed and distributed under
 * MIT License.
 *
 * Copyright (c) Electron contributors
 * Copyright (c) 2013-2020 GitHub Inc.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

import { ELECTRON_DIR, getOutDir } from './utils';

// Print the value of electron_version set in gn config.
export function getElectronVersion() {
    // Read the override_electron_version from args.gn file.
    try {
        const outDir = resolve(ELECTRON_DIR, '..', 'out', getOutDir());
        const content = readFileSync(join(outDir, 'args.gn'));
        const regex = /override_electron_version\s*=\s*["']([^"']+)["']/;
        const match = content.toString().match(regex);
        if (match) {
            return match[1];
        }
    } catch {
        // Error may happen when trying to get version before running gn, which is a
        // valid case and error will be ignored.
    }
    // Get the version from git tag if it is not defined in gn args.
    const output = spawnSync('python3', [join(ELECTRON_DIR, 'script', 'get-git-version.py')]);
    if (output.status !== 0) {
        throw new Error(`Failed to get git tag, script quit with ${output.status}: ${output.stdout}`);
    }
    return output.stdout.toString().trim();
}
