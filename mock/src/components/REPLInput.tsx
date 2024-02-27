import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

import {
  PROPERTY_DATA,
  PRICES_DATA,
  NEIGHBORHOOD_DATA,
  EMPTY,
} from "./mocks/mockedData.js";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
}

var loadedFile = new Array<Array<String>>();
var loadedFileName = "";

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<string>("brief");

  // var table = document.getElementById("table");

  var mockedDataMap = new Map();
  mockedDataMap.set("property", PROPERTY_DATA);
  mockedDataMap.set("prices", PRICES_DATA);
  mockedDataMap.set("neighborhood", NEIGHBORHOOD_DATA);
  mockedDataMap.set("empty", EMPTY);

  function handleSubmit(command: string) {
    setCount(count + 1);
    let formattedCommand = command;
    if (mode === "verbose") {
      formattedCommand = `Command: ${command}\nOutput: ${runCommand(command)}`;
    } else {
      formattedCommand = runCommand(command);
    }
    props.setHistory([...props.history, formattedCommand]);
    setCommandString("");
  }

  function runCommand(command: string): string {
    if (command === "mode brief") {
      setMode("brief");
      return "Switched to brief mode";
    } else if (command === "mode verbose") {
      setMode("verbose");
      return "Switched to verbose mode";
    } else if (command.startsWith("load_file")) {
      const filePath = command.split(" ")[1];
      return loadFile(filePath);
    } else if (command == "view") {
      viewFile();
      return 'Now viewing file: "' + loadedFileName + '".';
    } else if (command.startsWith("search")) {
      const args = command.split(" ").slice(1);
      if (args.length !== 2) {
        return "Invalid command. Usage: search <column> <value>";
      }
      const [column, value] = args;
      return searchFile(column, value);
    }

    return command || "Command executed with no return value";
  }

  function searchFile(column: string, value: string): string {
    var rowDisp = document.getElementById("rowDisp");
    let columnIndex: number;
    if (isNaN(Number(column))) {
      columnIndex = loadedFile[0].indexOf(column);
      if (columnIndex === -1) {
        return `Column "${column}" not found.`;
      }
    } else {
      columnIndex = Number(column);
      if (columnIndex < 0 || columnIndex >= loadedFile[0].length) {
        return `Column index ${column} out of range.`;
      }
    }

    const matchingRows = loadedFile
      .slice(1)
      .filter((row) => row[columnIndex] === value);
    if (matchingRows.length === 0) {
      return `No rows found with value "${value}" in column "${column}".`;
    }

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
      return "Error: Element with id 'rowDisp' not found.";
    }

    // Add a default return statement
    return "Search completed successfully";
  }

  function loadFile(filePath: string) {
    const fileName = filePath;
    if (!mockedDataMap.has(filePath)) {
      alert('The file: "' + fileName + '" does not exist.');
      return "An error occurred. The inputted file does not exist.";
    } else {
      loadedFile = mockedDataMap.get(filePath);
      loadedFileName = filePath;
    }

    if (loadedFile.length == 0) {
      alert('The file: "' + fileName + '" is empty!');
      return "An error occurred. The inputted file has not been loaded.";
    }
    return 'File: "' + loadedFileName + '" was loaded successfully';
  }

  function viewFile() {
    var table = document.getElementById("table");
    if (!table) {
      return "An error occurred. The inputted file can not be viewed";
    }

    //Code adapted from this page: https://stackoverflow.com/questions/34494032/loading-a-csv-file-into-an-html-table-using-javascript
    table.innerHTML = "";
    var tableContent = "";

    // Add table header row
    var headerRow = "<tr>";
    loadedFile[0].forEach(function (header) {
      headerRow += "<th>" + header + "</th>";
    });
    headerRow += "</tr>";

    tableContent += headerRow;

    loadedFile.slice(1).forEach(function (row) {
      tableContent += "<tr>";
      row.forEach(function (cell) {
        tableContent += "<td>" + cell + "</td>";
      });
      tableContent += "</tr>";
    });
    table.innerHTML = tableContent;
  }

  return (
    <div className="repl-input">
      <table id="table"></table>
      <table id="rowDisp"></table>
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times!
      </button>
    </div>
  );
}
