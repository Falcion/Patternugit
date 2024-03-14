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
import colors from 'colors/safe';

/**
 * @module Deployment
 */

/**
 * Deploys the application by building a Docker image, tagging it, pushing it to a registry, and deploying it to Kubernetes.
 * @param {string} projectName - The name of the project.
 */
async function deploy(projectName: string) {
  try {
    //! Implement custom registry for user
    const registry = 'your-registry';
    const imageTag = 'latest';

    if(registry === 'your-registry') {
      let errorMessage: string = "Implement your own Docker's registry before using containerization script!";

      console.error(colors.red(errorMessage));

      throw new Error(errorMessage);
    }

    const imageFullName = `${registry}/${projectName}:${imageTag}`;
    const deploymentFilePath = path.resolve(__dirname, '../../../deployment.yml');

    await new Promise((resolve, reject) => {
      const command = ['docker', 'build', '-t', projectName, '.'].join(' '); // Join arguments into a single command string
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          console.error(stderr);
        }
        console.log(stdout);
        resolve(undefined);
      });
    });

    await new Promise((resolve, reject) => {
      const command = ['docker', 'tag', projectName, imageFullName].join(' '); // Join arguments into a single command string
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          console.error(stderr);
        }
        console.log(stdout);
        resolve(undefined);
      });
    });

    await new Promise((resolve, reject) => {
      const command = ['docker', 'push', `${imageFullName}`].join(' '); // Join arguments into a single command string
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          console.error(stderr);
        }
        console.log(stdout);
        resolve(undefined);
      });
    });

    await new Promise((resolve, reject) => {
      const command = ['kubectl', 'apply', '-f', `${deploymentFilePath}`].join(' '); // Join arguments into a single command string
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          console.error(stderr);
        }
        console.log(stdout);
        resolve(undefined);
      });
    });

    console.log('Deployment completed successfully!');
  } catch (error) {
    console.error('Error during deployment:', error);
  }
}

const packageJsonPath = path.resolve(__dirname, '../../../package.json');

fs.readFile(packageJsonPath, 'utf-8')
  .then((data) => {
    const packageJson = JSON.parse(data);
    const projectName = packageJson.name;
    deploy(projectName);
  })
  .catch((error) => {
    console.error('Error reading package.json:', error);
  });
