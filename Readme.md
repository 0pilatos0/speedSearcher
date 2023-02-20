# File Search Program

This is a simple program that searches a directory and its subdirectories for files that contain a specified search query. The program returns a list of filenames and line numbers where the search query is found.

## Installation

To use this program, you need to have Node.js installed on your computer.

1. Clone this repository or download the ZIP file and extract it to a directory on your computer.
2. Open a terminal window and navigate to the directory where you extracted the files.
3. Run `npm install` to install the required dependencies.

## Usage

To use the program, run the following command in a terminal window:

```shell
node index.js
```

The program will prompt you to enter the path to a directory and a search query. Enter the path to the directory that you want to search, and the search query that you want to look for. The program will then search all the files in the directory and its subdirectories, and return a list of filenames and line numbers where the search query is found.

If no matches are found, the program will display a message indicating that no matches were found.

## Notes

- This program assumes that all the files in the specified directory and its subdirectories are text files that can be read using the default encoding.
- The line numbers start from 1, not from 0.
