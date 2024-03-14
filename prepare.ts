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
import * as path from 'path';
import * as dotenv from 'dotenv';
import readline from 'readline';

import colors from 'colors/safe';

const ROOT_DIRECTORY = __dirname;

const EXCLUDING_DIRECTORIES = ['node_modules', 'venv', '.git', 'out'];

let TARGET_VALUES = ['FALCION', 'PATTERNU', 'PATTERNUGIT'];

(async () => {
  /**
   * Searches for specific strings in a file.
   * @param {string} filePath - The path to the file to search in.
   * @param {string[]} searchData - The strings to search for.
   */
  const searchData = async (filePath: string, searchData: string[]) => {
    const content = (await fs.readFile(filePath, 'utf-8')).split('\n');

    for (let i = 0; i < content.length; i++) {
      const line = content[i].toUpperCase();

      for (const searchingString of searchData) {
        if (line.includes(searchingString)) {
          console.log(colors.green(`Found "${searchingString}" in L#${i} of:\n` + colors.blue(`"${filePath}"`)));
        }
      }
    }
  };

  /**
   * Traverses directories recursively and searches for target values.
   * @param {string} dirPath - The path to the directory to traverse.
   */
  const traverseDir = async (dirPath: string) => {
    try {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStat = await fs.stat(filePath);

        if (fileStat.isDirectory()) {
          if (!EXCLUDING_DIRECTORIES.includes(file)) {
            await traverseDir(filePath);
          }
        } else if (fileStat.isFile()) {
          await searchData(filePath, TARGET_VALUES);
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dirPath}: ${err}`);
    }
  };

  /**
   * Writes manifest data to a file.
   * @param {any} json - The data (in JSON) to write to the manifest.
   * @param {string} authorUrl - The URL of the author's profile.
   */
  const writeManifest = async (json: any, authorUrl: string | undefined) => {
    const manifestJSON = {
      id: json.name,
      name: `${json.name[0].toUpperCase()}${json.name.slice(1)}`,
      description: json.description,
      author: json.author,
      license: json.license,
      version: json.version,
      authorUrl: authorUrl === undefined ? '-' : authorUrl
    };

    await fs.writeFile('manifest.json', JSON.stringify(manifestJSON, null, 4));
  };

  if (!(await fs.pathExists(path.join(ROOT_DIRECTORY, '.env')))) {
    await fs.createFile('.env');
    await fs.writeFile('.env', 'EXAMPLE_API_KEY=');
  }

  dotenv.config({
    path: './.env',
    encoding: 'utf-8'
  });

  const packageJSON = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }));

  if (!(await fs.pathExists(path.join(ROOT_DIRECTORY, 'manifest.json')))) {
    await fs.createFile('manifest.json');
    await writeManifest(packageJSON, undefined);
  }

  const manifestAsJSON = JSON.parse(fs.readFileSync('manifest.json', { encoding: 'utf-8' }));

  let authorUrl = manifestAsJSON.authorUrl;

  if (authorUrl === '-') {
    authorUrl = undefined;
  }

  const checkingRes = packageJSON.id === manifestAsJSON.id
    && packageJSON.name === manifestAsJSON.name
    && packageJSON.description === manifestAsJSON.description
    && packageJSON.author === manifestAsJSON.author
    && packageJSON.license === manifestAsJSON.license
    && packageJSON.version === manifestAsJSON.version;

  if (!checkingRes) {
    console.error(colors.red('There is desync in Manifest JSON and Package JSON! Causing override to manifest.json, but backing up at manifest-copy.json'));
  }

  await fs.copyFile('manifest.json', 'manifest-backup.json');

  await writeManifest(packageJSON, authorUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(colors.yellow('Do you want to change the finding signature for the script? (y/n): '), (answ1) => {
    if (answ1 === 'y') {
      rl.question(colors.yellow('What words do you need to find? (separated by comma): '), (answ2) => {
        const res = answ2.split(',');
        TARGET_VALUES = res;
        traverseDir(ROOT_DIRECTORY);
        rl.close();
      });
    } else {
      traverseDir(ROOT_DIRECTORY);
      rl.close();
    }
  });
})();
