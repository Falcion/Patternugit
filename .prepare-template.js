/*
 * MIT License
 *
 * Copyright (c) 2023-2024 Falcion
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Any code and/or API associated with OBSIDIAN behaves as stated in their distribution policy.
 */

import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'fs-extra';
import * as readline from 'readline';

import colors from 'colors/safe';

const PROMPTS = [
    'DO YOU WANT TO UPDATE AND CHECK YOUR MANIFEST FOR THE SYNC',
    'DO YOU WANT TO ADD WORDS TO SEARCH FOR THEM IN THE PROJECT',
    'WRITE THE WORDS SEPARATED BY COMMA',
];

// Abort process if running on macOS or iOS.
if (os.type() === 'Darwin') process.abort();

/**
 * Logger class for logging messages with various severity levels.
 */
export class LocaleLogger {
    /**
     * Session ID of the current process.
     * @type {number}
     */
    static sessionId = process.ppid;

    /**
     * Logs an informational message.
     * @param {...any} data - Data to log.
     */
    static info(...data) {
        const datetime = new Date().toLocaleString();
        console.info(colors.blue(`[${datetime}] <${this.sessionId}> \t - ${data.join(' ')}`));
    }

    /**
     * Logs a warning message.
     * @param {...any} data - Data to log.
     */
    static warn(...data) {
        const datetime = new Date().toLocaleString();
        console.warn(colors.yellow(`[${datetime}] <${this.sessionId}> \t - ${data.join(' ')}`));
    }

    /**
     * Logs an error message.
     * @param {...any} data - Data to log.
     */
    static error(...data) {
        const datetime = new Date().toLocaleString();
        console.error(colors.bgRed(colors.white(`[${datetime}] <${this.sessionId}> \t - ${data}`)));
    }

    /**
     * Logs a success message.
     * @param {...any} data - Data to log.
     */
    static success(...data) {
        const datetime = new Date().toLocaleString();
        console.log(colors.green(`[${datetime}] <${this.sessionId}> \t - ${data.join(' ')}`));
    }

    /**
     * Logs a raw message with a custom color.
     * @param {(str: string) => string} color - The color function.
     * @param {...any} data - Data to log.
     */
    static raw(color, ...data) {
        console.debug(color(data.join(' ')));
    }

    /**
     * Formats a message with a custom color.
     * @param {(str: string) => string} color - The color function.
     * @param {string} message - The message to format.
     * @returns {string} The formatted message.
     */
    static formatMessage(color, message) {
        return color(message);
    }
}

/**
 * Class representing file search and update operations.
 */
export default class LocaleModule {
    /**
     * The root directory of the module.
     * @type {string}
     */
    rootDirectory = __dirname;

    /**
     * Directories to exclude from traversal.
     * @type {string[]}
     */
    excludingFolders = [
        'node_modules',
        'dist',
        'venv',
        '.git',
        '$git',
        '$',
        'out',
        'bin',
    ];

    /**
     * Values to exclude from file content search.
     * @type {string[]}
     */
    excludingValues = [
        'FALCION',
        'PATTERNU',
        'PATTERNUGIT',
        'PATTERNUGIT.NET',
    ];

    /**
     * Updates exclusion lists based on user input.
     * @param {string[]} entries - Entries to add.
     * @param {string} action - User action ('Y' or 'N').
     */
    updateExclusions(entries, action) {
        if (action.length !== 1) {
            throw new RangeError('Action input must be a single character.');
        }

        if (action === 'Y') {
            this.excludingValues.push(...entries);
        } else if (action === 'N') {
            this.excludingFolders = entries;
        }
    }

    /**
     * Searches for specified words in a file.
     * @param {string} filePath - The file path.
     * @param {string[]} searchTerms - Words to search for.
     * @returns {Promise<void>}
     */
    async searchFile(filePath, searchTerms) {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const lines = fileContent.split(os.EOL);

            lines.forEach((line, index) => {
                const upperCaseLine = line.toUpperCase();
                searchTerms.forEach((term) => {
                    if (upperCaseLine.includes(term)) {
                        LocaleLogger.raw(colors.green, `Found "${term}" in L#${index} of:`);
                        LocaleLogger.raw(colors.cyan, filePath);
                    }
                });
            });
        } catch (err) {
            LocaleLogger.error(`Error reading file: ${filePath} - ${err}`);
        }
    }

    /**
     * Traverses directories and searches files for words.
     * @param {string} [directory=__dirname] - Directory to traverse.
     * @returns {Promise<void>}
     */
    async traverseDirectory(directory = __dirname) {
        try {
            const items = await fs.readdir(directory);

            for (const item of items) {
                const itemPath = path.join(directory, item);
                const itemStats = await fs.stat(itemPath);

                if (itemStats.isDirectory()) {
                    if (!this.excludingFolders.includes(item)) {
                        await this.traverseDirectory(itemPath);
                    }
                } else if (itemStats.isFile()) {
                    await this.searchFile(itemPath, this.excludingValues);
                }
            }
        } catch (err) {
            LocaleLogger.error(`Error traversing directory: ${directory} - ${err}`);
        }
    }
}

/**
 * Main function to initialize the search and update process.
 */
(async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const localeModule = new LocaleModule();

    rl.question(PROMPTS[1], (mode) => {
        if (mode.toUpperCase() !== 'IGNORE') {
            rl.question(PROMPTS[2], (input) => {
                const words = input.split(',').map((word) => word.trim());
                localeModule.updateExclusions(words, mode.toUpperCase());
                localeModule.traverseDirectory();
            });
        } else {
            localeModule.traverseDirectory();
        }
        rl.close();
    });
})();
