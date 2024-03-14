/**
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @license MIT
 * @author Falcion
 * @year 2023-2024
 */

import * as fs from 'fs-extra';

/**
 * @module Workflows
 */

/**
 * Reads the settings from a file and returns them as a string (CodeQL).
 * @returns {string | undefined} The settings read from the file, or undefined if the file doesn't exist.
 */
export function getSettings() {
  const settingsPath = `${__dirname}/../../codeql-analytics.txt`;

  if (fs.existsSync(settingsPath)) {
    return fs.readFileSync(settingsPath).toString();
  } else {
    return undefined;
  }
}

/**
 * Updates the settings in the workflow file with the provided parameters (CodeQL).
 * @param {string | undefined} settingsParams - The settings parameters to be updated in the workflow file.
 */
export function updateSettings(settingsParams: string | undefined) {
  if (settingsParams === undefined) {
    return;
  }

  const entryLine = settingsParams.split(',').map(x => `'${x.trim()}'`).join(', ');

  console.log(entryLine);

  const workflowPath = `${__dirname}/../../.github/workflows/analytics.yml`;

  const workflowFile = fs.readFileSync(workflowPath).toString().split('\n');

  const matrixRegExp = /language:\s*\[\s*'([^']*)'\s*,\s*'([^']*)'\s*\]/;

  console.log(workflowFile);

  for (let i = 0; i < workflowFile.length; i++) {
    if (matrixRegExp.test(workflowFile[i])) {
      // Tabs are not allowed in YAML so we use spaces
      // 2 spaces equals 1 tab in YAML
      workflowFile[i] = `        language: [ ${entryLine} ]`;
    }
  }

  fs.writeFile(workflowPath, workflowFile.join('\n'));
}
