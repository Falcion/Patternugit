import * as fs from 'fs-extra';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

import * as colors from 'colors';

const ROOT_DIRECTORY = __dirname;

const EXCLUDING_DIRECTORIES = ['node_modules', 'venv', '.git', 'out'];

let TARGET_VALUES = ['FALCION', 'PATTERNU', 'PATTERNUGIT'];

(async () => {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  const searchData = async (path: string, searchData: string[]) => {
    const content = (await fs.readFile(path, 'utf-8')).split('\n');

    for(let i = 0; i < content.length; i++) {
      const line = content[i].toUpperCase();

      for(const searchingString of searchData)
        if(line.includes(searchingString))
          console.log(`Found "${searchingString}" in L#${i++} of "${path}"`);
    }
  };

  const traverseDir = async (dirpath: string) => {
    try {
      const files = await fs.readdir(dirpath);

      for (const file of files) {
        const fpath = path.join(dirpath, file);
        const fstat = await fs.stat(fpath);

        if (fstat.isDirectory()) {
          if (!EXCLUDING_DIRECTORIES.includes(file))
            await traverseDir(fpath);
        else if (fstat.isFile())
          await searchData(fpath, TARGET_VALUES);
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dirpath}: ${err}`);
    }
  };

  const writeManifest = async (json: any, authorUrl: string | undefined) => {
    const manifestJSON = {
      id: json.name,
      name: `${json.name[0].toUpperCase()}${json.name.slice(1, json.name.length)}`,
      description: json.description,
      author: json.author,
      license: json.license,
      version: json.version,
      authorUrl: `${authorUrl === undefined ? '-' : authorUrl}`
    };

    await fs.writeFile('manifest.json', JSON.stringify(manifestJSON, null, 4));
  };

  if(!await fs.pathExists(ROOT_DIRECTORY + '/.env')) {
    await fs.createFile('.env').then(async () => {
      await fs.writeFile('.env', 'EXAMPLE_API_KEY=');
    });
  }

  dotenv.config({
    path: './.env',
    encoding: 'utf-8'
  });

  const packageJSON = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8'}));

  if(!await fs.pathExists(ROOT_DIRECTORY + '/manifest.json')) {
    await fs.createFile('manifest.json').then(async () => {
      await writeManifest(packageJSON, undefined);
    });
  }

  const manifestAsJSON = JSON.parse(fs.readFileSync('manifest.json', { encoding: 'utf-8'}));

  let authorUrl = manifestAsJSON.authorUrl;

  if(authorUrl === '-')
    authorUrl = undefined;

  const checkingRes = packageJSON.id === manifestAsJSON.id && packageJSON.name === manifestAsJSON.name
                  && packageJSON.description === manifestAsJSON.description && packageJSON.author === manifestAsJSON.author
                  && packageJSON.license === manifestAsJSON.license && packageJSON.version === manifestAsJSON.version;

  if(!checkingRes)
    console.error(colors.red('There is desync in Manifest JSON and Package JSON! Causing override to manifest.json, but backuping at manifest-copy.json'));

  await fs.copyFile('manifest.json', 'manifest-backup.json');

  await writeManifest(packageJSON, authorUrl);

  rl.question(colors.yellow('Do you want to change the finding signature for the script? (y/n): '), (answ1) => {
    if(answ1 == 'y')
      rl.question(colors.yellow('What words you need to find? (separated by comma): '), (answ2) => {
        const res = answ2.split(',');

        TARGET_VALUES = res;

        traverseDir(ROOT_DIRECTORY);
        rl.close();
      });
    else {
      traverseDir(ROOT_DIRECTORY);
      rl.close();
    }
  });
})();
