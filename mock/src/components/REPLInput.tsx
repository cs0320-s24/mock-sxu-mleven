import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<string>("brief");

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

  function runCommand(command: string) {
    if (command === "mode brief") {
      setMode("brief");
      return "Switched to brief mode";
    } else if (command === "mode verbose") {
      setMode("verbose");
      return "Switched to verbose mode";
    }
    return command;
  }
  return (
    <div className="repl-input">
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
