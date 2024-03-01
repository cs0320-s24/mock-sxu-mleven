> **GETTING STARTED:** You should likely start with the `/mock` folder from your solution code for the mock gearup.

# Project Details

Project Name: Mock

Team Members: Jack Xu and Malin Leven

Estimated time to finish project: 10 hours each

Repo link: https://github.com/cs0320-s24/mock-sxu-mleven

# Design Choices

Components:
- mocks contains mockedData in JSON format and TS format, this is what we use to test our program
- The rest of the .tsx files are what make up the program
- The bulk of the program is written in REPLInput.tsx

Styles:
- main.tss contains our specs for various components on the html

Tests:
- App.spec.ts contains all our testing

index.html contains the main html

# Errors/Bugs

- There are no errors or bugs

# Tests

- We have extensive testing for every functionality as well as edge cases
- To run tests, open a new terminal in VSCode, cd mock, and then run 'npx playwright test', then to view the results,
  run 'npx playwright show-report'

# How to

- Open a new terminal in VSCode, cd mock, and then run 'npm start' to start the server on your local host. This will open a server at
  (http://localhost:8000/)
- Click the login button
- In the command box, enter your command of choice then press the button to perform the command
- To load a file, enter "load_file ~filename~"
- To view the file (which has been loaded), enter "view"
- To search for a specific row in the table, enter "search ~column name~ ~target~"
- To change the mode to brief mode, enter "mode brief", to change it to verbose mode, enter "mode verbose"

# Collaboration

Some code was adapted from this page: https://stackoverflow.com/questions/34494032/loading-a-csv-file-into-an-html-table-using-javascript

Some information to do with testing was learnt from this page: https://stackoverflow.com/questions/46377955/puppeteer-page-evaluate-queryselectorall-return-empty-objects
