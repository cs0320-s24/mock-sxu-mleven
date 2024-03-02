import "../styles/main.css";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import { ControlledInput } from "./ControlledInput";

//Importing the mocked data
import {
  PROPERTY_DATA,
  PRICES_DATA,
  NEIGHBORHOOD_DATA,
  EMPTY,
} from "./mocks/mockedData.js";
//import { fileURLToPath } from "url";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
}

//Setting up where the loaded files and the name of the file will be stored
var loadedFile = new Array<Array<String>>();
var loadedFileName = "";

//Interface for the functions we have created + user story 6
export interface REPLFunction {
  (args: Array<string>): string | string[][];
}

//Where the commands will be stored
class CommandRegistry {
  //Mapping the name of the command to the function
  private commands = new Map<string, REPLFunction>();

  //Registering commands
  registerCommand(name: string, func: REPLFunction) {
    this.commands.set(name, func);
  }

  //Running the command, returning an error message if the command is unknown.
  runCommand(command: string): string | string[][] {
    const [name, ...args] = command.split(" ");
    const func = this.commands.get(name);
    if (func) {
      return func(args);
    } else {
      return `Unknown command: ${name}`;
    }
  }
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<string>("brief");

  //Map to hold the mocked data
  var mockedDataMap = new Map();
  mockedDataMap.set("property", PROPERTY_DATA);
  mockedDataMap.set("prices", PRICES_DATA);
  mockedDataMap.set("neighborhood", NEIGHBORHOOD_DATA);
  mockedDataMap.set("empty", EMPTY);

  const commandRegistry = useRef(new CommandRegistry()).current;

  //CHecking for mode switching
  commandRegistry.registerCommand("mode", (args) => {
    if (args[0] === "brief") {
      setMode("brief");
      return "Switched to brief mode";
    } else if (args[0] === "verbose") {
      setMode("verbose");
      return "Switched to verbose mode";
    } else {
      return `Invalid mode: ${args[0]}`;
    }
  });

  //Registering the load_file command, returning error if no filepath is given
  commandRegistry.registerCommand("load_file", (args) => {
    if (args.length !== 1) {
      return "Invalid command. Usage: load_file <filePath>";
    }
    const filePath = args[0];
    return loadFile(filePath);
  });

  //Registering the view command
  commandRegistry.registerCommand("view", () => {
    return viewFile();
  });

  //Registering the search command, returning error if incorrect format for search 
  commandRegistry.registerCommand("search", (args) => {
    if (args.length !== 2) {
      return "Invalid command. Usage: search <column> <value>";
    }
    const [column, value] = args;
    return searchFile(column, value);
  });

  //For testing, echos what the user inputs
  const echoCommand: REPLFunction = (args) => {
    return args.join(" ");
  };
  commandRegistry.registerCommand("echo", echoCommand);

  //Running command and adding to history based on mode
  function handleSubmit(command: string) {
    setCount(count + 1);
    let result = commandRegistry.runCommand(command);
    let formattedCommand = Array.isArray(result) ? result.join("\n") : result;
    if (mode === "verbose") {
      formattedCommand = `Command: ${command}\nOutput: ${formattedCommand}`;
    }
    props.setHistory([...props.history, formattedCommand]);
    setCommandString("");
  }

  //Function to search file
  function searchFile(column: string, value: string): string {
    var rowDisp = document.getElementById("rowDisp");
    let columnIndex: number;
    if (isNaN(Number(column))) {
      columnIndex = loadedFile[0].indexOf(column);
      //Checking if the index is out of bounds
      if (columnIndex === -1) {
        alert(`Error: Column "${column}" not found.`);
        return `An error occured. Column "${column}" not found.`;
      }
    } else {
      columnIndex = Number(column);
      //Checking if the index is out of bounds
      if (columnIndex < 0 || columnIndex >= loadedFile[0].length) {
        alert(`Error: Column index ${column} out of range.`);
        return `An error occured. Column index ${column} out of range.`;
      }
    }

    //Searching the rows in the loaded file for the search value
    const matchingRows = loadedFile
      .slice(1)
      .filter((row) => row[columnIndex] === value);
    if (matchingRows.length === 0) {
      alert(
        `Error: No rows found with value "${value}" in column "${column}".`
      );
      return `An error occured. No rows found with value "${value}" in column "${column}".`;
    }

    //Setting up the table with search results
    if (rowDisp) {
      rowDisp.innerHTML = " ";
      let rowToString = "<tr>";
      loadedFile[0].forEach((header) => {
        rowToString += `<th>${header}</th>`;
      });
      rowToString += "</tr>";

      matchingRows.forEach((row) => {
        rowToString += "<tr>";
        row.forEach((cell) => {
          rowToString += `<td>${cell}</td>`;
        });
        rowToString += "</tr>";
      });

      rowDisp.innerHTML = rowToString;
    } else {
      alert("Error: Element with id 'rowDisp' not found.");
      return "An error occurred. Element with id 'rowDisp' not found.";
    }

    // Add a default return statement
    return "Search completed successfully";
  }

  //Function to load file 
  function loadFile(filePath: string) {
    const fileName = filePath;
    //Checking that the filepath exists in our mocked data map
    if (!mockedDataMap.has(filePath)) {
      //Returning errors if the file does not exist
      alert('The file: "' + fileName + '" does not exist.');
      return "An error occurred. The inputted file does not exist.";
    } else {
      loadedFile = mockedDataMap.get(filePath);
      loadedFileName = filePath;
    }

    //Returning error if the file is empty
    if (loadedFile.length == 0) {
      alert('Error: The file: "' + fileName + '" is empty!');
      return "An error occurred. The inputted file has not been loaded.";
    }

    //Success message if loaded
    return 'File: "' + loadedFileName + '" was loaded successfully';
  }

  function viewFile() {
    //Checking if a file has been loaded (cannot view file without loading first)
    if (loadedFile.length == 0) {
      alert("Error: No file has been loaded.");
      return "An error occured. No file has been loaded.";
    }

    //Finding elements on the page
    var table = document.getElementById("table");
    var searchTable = document.getElementById("rowDisp");
    if (!table || !searchTable) {
      alert("Error: The inputted file can not be viewed");
      return "An error occurred. The inputted file can not be viewed";
    }

    //Code adapted from this page: https://stackoverflow.com/questions/34494032/loading-a-csv-file-into-an-html-table-using-javascript
    table.innerHTML = "";
    var tableContent = "";

    //Clearing the search table if a new file is being viewed to avoid confusion for the user
    searchTable.innerHTML = "";

    // Add table header row with first row of CSV
    var headerRow = "<tr>";
    loadedFile[0].forEach(function (header) {
      headerRow += "<th>" + header + "</th>";
    });
    headerRow += "</tr>";

    //Adding it to the content of the table
    tableContent += headerRow;

    //Creating rows and adding cells
    loadedFile.slice(1).forEach(function (row) {
      tableContent += "<tr>";
      row.forEach(function (cell) {
        tableContent += "<td>" + cell + "</td>";
      });
      tableContent += "</tr>";
    });
    table.innerHTML = tableContent;

    //Returns this if successfull
    return 'Now viewing file: "' + loadedFileName + '".';
  }

  return (
    <div className="container">
      <div className="top-container">
        <div className="all-table">
          <table id="table"></table>
        </div>
        <div className="view-table">
          <table id="rowDisp"> </table>
        </div>
      </div>
      <div className="repl-input">
        <fieldset>
          <legend>Enter a command:</legend>
          <div className="repl-command-box">
            <ControlledInput
              value={commandString}
              setValue={setCommandString}
              ariaLabel={"Command input"}
            />
            <button
              aria-label="submit-button"
              onClick={() => handleSubmit(commandString)}
            >
              Submitted {count} times!
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
