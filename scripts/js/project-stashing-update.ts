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


import { exec } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';

/**
 * @module UpdateProject
 */

/**
 * Updates the entire project and loads the old version into a directory named "old_patch-{version}" based on the latest release tag of the repository.
 * @param {string} repositoryPath - The path to the repository.
 */
async function updateProject(repositoryPath: string) {
  try {
    // Fetch latest release tag from GitHub
    const latestTag = await getLatestReleaseTag();
    if (!latestTag) {
      console.error('Failed to fetch latest release tag from GitHub.');
      return;
    }

    const tempDir = path.join(repositoryPath, 'temp');
    await fs.ensureDir(tempDir);

    const currentBranch = await getCurrentBranch(repositoryPath);

    // Stash any local changes
    await executeCommand('git stash');
    // Checkout the desired tag
    await executeCommand(`git checkout ${latestTag}`);

    const oldVersionDir = path.join(tempDir, `old_patch-${latestTag}`);
    await fs.copy(repositoryPath, oldVersionDir);

    // Checkout back to the current branch
    await executeCommand(`git checkout ${currentBranch}`);

    console.log(`Old version from tag '${latestTag}' loaded into '${oldVersionDir}'`);
  } catch (error) {
    console.error('Error during project update:', error);
  }
}

/**
 * Executes a shell command asynchronously.
 * @param {string} command - The command to execute.
 * @returns {Promise<void>} A promise that resolves when the command execution is completed.
 */
function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }
      console.log(stdout);
      resolve(stdout.trim());
    });
  });
}

/**
 * Gets the name of the current branch of the repository.
 * @param {string} repositoryPath - The path to the repository.
 * @returns {Promise<string>} A promise that resolves with the name of the current branch.
 */
async function getCurrentBranch(repositoryPath: string): Promise<string> {
  const stdout = await executeCommand('git branch --show-current');
  return stdout;
}

/**
 * Fetches the latest release tag from the GitHub repository.
 * @returns {Promise<string|null>} A promise that resolves with the latest release tag, or null if it fails.
 */
async function getLatestReleaseTag(): Promise<string | null> {
  try {
    const response = await axios.get('https://api.github.com/repos/your-username/your-repository/releases/latest');
    return response.data.tag_name;
  } catch (error) {
    console.error('Error fetching latest release tag:', error);
    return null;
  }
}

// Execute the update with the provided repository path
const packageJsonPath = path.resolve(__dirname, '../../../package.json');

fs.readFile(packageJsonPath, 'utf-8')
  .then((data) => {
    const packageJson = JSON.parse(data);
    const repositoryPath = path.resolve(__dirname, '../../../', packageJson.name);
    updateProject(repositoryPath);
  })
  .catch((error) => {
    console.error('Error reading package.json:', error);
  });
