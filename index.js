import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import readline from 'readline';


console.log(chalk.yellow('───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄─── \n') +
            chalk.yellow('───█▒▒░░░░░░░░░▒▒█─── \n') +
            chalk.yellow('────█░░█░░░░░█░░█──── \n') +
            chalk.yellow('─▄▄──█░░░▀█▀░░░█──▄▄─ \n') +
            chalk.yellow('█░░█─▀▄░░░░░░░▄▀─█░░█ \n'));

console.log(chalk.green('SPEED SEARCH'));


function searchFile(filePath, searchQuery) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
      });
      const matchingLines = [];
      rl.on('line', (line, lineNumber) => {
        if (line.includes(searchQuery)) {
          matchingLines.push({ filePath });
        }
      });
      rl.on('error', reject);
      rl.on('close', () => {
        resolve(matchingLines);
      });
    });
  }
  
  function searchDirectory(directoryPath, searchQuery) {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        const promises = files.map(file => {
          const filePath = path.join(directoryPath, file);
          return fs.promises.stat(filePath)
            .then(stat => {
              if (stat.isDirectory()) {
                return searchDirectory(filePath, searchQuery);
              } else {
                return searchFile(filePath, searchQuery);
              }
            });
        });
        Promise.all(promises)
          .then(results => {
            const matchingLines = results.flat();
            resolve(matchingLines);
          })
          .catch(reject);
      });
    });
  }
  
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'path',
        message: 'Enter path to directory:',
        validate: function (input) {
          return new Promise(function (resolve, reject) {
            fs.access(input, fs.constants.R_OK, function (err) {
              if (err) {
                reject('Cannot access directory: ' + input);
              } else {
                resolve(true);
              }
            });
          });
        },
      },
      {
        type: 'input',
        name: 'search',
        message: 'Enter search query:',
      },
    ])
    .then((answers) => {
      console.log(chalk.green('Directory: ' + answers.path));
      console.log(chalk.green('Search query: ' + answers.search));
      searchDirectory(answers.path, answers.search)
        .then((matchingLines) => {
          if (matchingLines.length === 0) {
            console.log(chalk.yellow('No matches found.'));
          } else {
            console.log(chalk.green('Matches found: ') + chalk.yellow(matchingLines.length));
            matchingLines = matchingLines.filter((v, i, a) => a.findIndex(t => (t.filePath === v.filePath)) === i);
            matchingLines.forEach((match) => {
              console.log(chalk.cyan(`${match.filePath}`));
            });
          }
        })
        .catch((err) => {
          console.error(chalk.red('Error searching directory: ' + answers.path));
          console.error(chalk.red(err));
        });
    });