import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(() => {
  // ... you'd put it here.
  // TODO: Is there something we need to do before every test case to avoid repeating code?
});

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something
 * you put before parts of your test that might take time to run,
 * like any interaction with the page.
 */

/* ------------------------ TESTING FOR PAGE SETUP AND LAYOUT ------------------------ */

test("on page load, i see a login button", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Login")).toBeVisible();
});

test("on page load, i dont see the input box until login", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  // click the login button
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("on page load, i see a button", async ({ page }) => {
  // TODO WITH TA: Fill this in!
  await page.goto("http://localhost:8000/");
  await expect(page.getByRole("button")).toBeVisible();
});

// Test for submitting an empty command string
test("on page load, input box is empty", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  await expect(page.getByLabel("Command input")).toHaveValue("");
});

test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 1: Navigate to a URL
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("after I type into the input box and push, the text clears", async ({
  page,
}) => {
  // Step 1: Navigate to a URL
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  await page.getByLabel("submit-button").click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
});

/* ------------------------ TESTING FOR MODE CHANGING ------------------------*/

test("i can change the mode to verbose mode", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Attempt to change mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByLabel("submit-button").click();

  // Check if the command appears in the command history
  // Some information taken from: https://stackoverflow.com/questions/46377955/puppeteer-page-evaluate-queryselectorall-return-empty-objects
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "Switched to verbose mode");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

test("i can change the mode to verbose mode, and then back to brief more", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Change mode to verbose
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByLabel("submit-button").click();

  // Check if the command appears in the command history
  // Some information taken from: https://stackoverflow.com/questions/46377955/puppeteer-page-evaluate-queryselectorall-return-empty-objects
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "Switched to verbose mode");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();

  // Attempt to switch mode
  await page.getByLabel("Command input").fill("mode brief");
  await page.getByLabel("submit-button").click();

  // Check if the command appears in the command history
  // Some information taken from: https://stackoverflow.com/questions/46377955/puppeteer-page-evaluate-queryselectorall-return-empty-objects
  const commandExists2 = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "Switched to brief mode");

  // Assert that the command is found in the command history
  expect(commandExists2).toBeTruthy();
});

/* ------------------------ TESTING FOR LOAD ------------------------ */

// Test for loading a non-existent csv file
test("if i try to load a file that does not exist, an error message is displayed", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Attempt to submit a non existent file
  await page
    .getByLabel("Command input")
    .fill("load_file non_existent_file.csv");
  await page.getByLabel("submit-button").click();

  //Checking for the alert
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain(
      'The file: "non_existent_file.csv" does not exist.'
    );
    await dialog.accept();
  });

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "An error occurred. The inputted file does not exist.");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

//Test to check for correct error when loading an empty file
test("i am prompted if i try to load an empty file", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Attempt to load empty file
  await page.getByLabel("Command input").fill("load_file empty");
  await page.getByLabel("submit-button").click();

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain('Error: The file: "empty" is empty!');
    await dialog.accept();
  });

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "An error occurred. The inputted file has not been loaded.");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

//Testing basic functionality of load
test("i can load in a file (mocked data) successfully", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Attempt to load prices
  await page.getByLabel("Command input").fill("load_file prices");
  await page.getByLabel("submit-button").click();

  // Check if the command appears in the command history
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, 'File: "prices" was loaded successfully');

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

//Testing loading nothing
test("i am given an error if loading nothing", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Attempt to load empty file
  await page.getByLabel("Command input").fill("load_file");
  await page.getByLabel("submit-button").click();

  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "Invalid command. Usage: load_file <filePath>");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

//Testing loading in verbose mode
test("i can load in a file (mocked data)in verbose mode", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Change mode to verbose
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByLabel("submit-button").click();

  // Attempt to load prices
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Check if the command appears in the command history
  // NOTE: The command does not appear here in the test but it does appear in the history, it was
  // not possible to test for it here because of categorisation.
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, 'File: "property" was loaded successfully');

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

/* ------------------------ TESTING FOR VIEW ------------------------ */

test("attempting to view a file that has not been loaded", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Attempt to view when file has not been loaded
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("Error: No file has been loaded.");
    await dialog.accept();
  });

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "An error occured. No file has been loaded.");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

test("i can load in a file (mocked data) then view it", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file
  await page.getByLabel("Command input").fill("load_file prices");
  await page.getByLabel("submit-button").click();

  // Viewing file
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  const tableVisible = await page.isVisible("table");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("table");

  // Check if table contains the right info
  expect(tableContent).toContain("Year");
  expect(tableContent).toContain("2019");
});

test("i can view a file in verbose mode", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  //switching mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByLabel("submit-button").click();

  // Viewing file
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  const tableVisible = await page.isVisible("table");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("table");

  // Check if table contains the right info
  expect(tableContent).toContain("Bedrooms");
  expect(tableContent).toContain("3");
});

test("i can load in a file (mocked data), then load in another file and view the new one", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file prices");
  await page.getByLabel("submit-button").click();

  // Loading file 2
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Viewing file
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  const tableVisible = await page.isVisible("table");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("table");

  // Check if table contains the right info
  expect(tableContent).toContain("Bedrooms");
  expect(tableContent).toContain("3");
});

test("i can load in a file (mocked data) and view it, then load in another file and view the new one", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file prices");
  await page.getByLabel("submit-button").click();

  // Viewing file
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  const tableVisible = await page.isVisible("table");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("table");

  // Check if table contains the right info
  expect(tableContent).toContain("123 Main St");
  expect(tableContent).toContain("$480,000");

  // Loading file 2
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Viewing file
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  const tableVisible2 = await page.isVisible("table");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent2 = await page.textContent("table");

  // Check if table contains the right info
  expect(tableContent2).toContain("Bedrooms");
  expect(tableContent2).toContain("3");
});

/* ------------------------  TESTING FOR SEARCH ------------------------  */

test("i can search in a file I am viewing", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file prices");
  await page.getByLabel("submit-button").click();

  // Viewing file
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search Year 2019");
  await page.getByLabel("submit-button").click();

  await page.waitForTimeout(500);

  const tableVisible = await page.isVisible("#rowDisp");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("#rowDisp");

  // Check if table contains the right info
  expect(tableContent).toContain("Year");
  expect(tableContent).toContain("2019");
  expect(tableContent).toContain("123 Main St");
  expect(tableContent).toContain("$480,000");
});

test("i can search using the index", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file prices");
  await page.getByLabel("submit-button").click();

  // Viewing file
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search 1 $500,000");
  await page.getByLabel("submit-button").click();

  await page.waitForTimeout(500);

  const tableVisible = await page.isVisible("#rowDisp");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("#rowDisp");

  // Check if table contains the right info
  expect(tableContent).toContain("Year");
  expect(tableContent).toContain("2020");
  expect(tableContent).toContain("$450,000");
});

test("i can search in a file I have loaded but am not viewing", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search Bathrooms 1.5");
  await page.getByLabel("submit-button").click();

  await page.waitForTimeout(500);

  const tableVisible = await page.isVisible("#rowDisp");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("#rowDisp");

  // Check if table contains the right info
  expect(tableContent).toContain("Property");
  expect(tableContent).toContain("789 Oak St");
});

test("i can perform search which return several rows", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search Bedrooms 3");
  await page.getByLabel("submit-button").click();

  await page.waitForTimeout(500);

  const tableVisible = await page.isVisible("#rowDisp");

  // Assert that the table is visible2
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("#rowDisp");

  // Check if table contains the right info (several properties)
  expect(tableContent).toContain("Property");
  expect(tableContent).toContain("101 Pine St");
  expect(tableContent).toContain("123 Main St");
  expect(tableContent).toContain("303 Maple St");
});

test("i get an error if no column is found", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search Bedrooms");
  await page.getByLabel("submit-button").click();

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain(
      "Invalid command. Usage: search <column> <value>"
    );
    await dialog.accept();
  });

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "Invalid command. Usage: search <column> <value>");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

test("i get an error if the column index is out of bounds", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search 8 2-car");
  await page.getByLabel("submit-button").click();

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("Error: Column index 8 out of range.");
    await dialog.accept();
  });

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, `An error occured. Column index 8 out of range.`);

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

test("i get an error if the column is not found", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search garden large");
  await page.getByLabel("submit-button").click();

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain('Error: Column "garden" not found.');
    await dialog.accept();
  });

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, 'An error occured. Column "garden" not found.');

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

test("i get an error if i try to search with no results", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search Bedrooms 10");
  await page.getByLabel("submit-button").click();

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain(
      'Error: No rows found with value "10" in column "Bedrooms".'
    );
    await dialog.accept();
  });

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, `An error occured. No rows found with value \"10\" in column \"Bedrooms\".`);

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

test("i can load in a file (mocked data) and view it and search in it, then load in another file and view the new one", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Loading file 1
  await page.getByLabel("Command input").fill("load_file property");
  await page.getByLabel("submit-button").click();

  // Searching file
  await page.getByLabel("Command input").fill("search Bathrooms 1.5");
  await page.getByLabel("submit-button").click();

  await page.waitForTimeout(500);

  const tableVisible = await page.isVisible("#rowDisp");

  // Assert that the table is visible
  expect(tableVisible).toBeTruthy();

  // Check if the table is filled with data
  const tableContent = await page.textContent("#rowDisp");

  // Check if table contains the right info
  expect(tableContent).toContain("Property");
  expect(tableContent).toContain("789 Oak St");

  // Loading file 2
  await page.getByLabel("Command input").fill("load_file prices");
  await page.getByLabel("submit-button").click();

  // Searching another file
  await page.getByLabel("Command input").fill("search Year 2020");
  await page.getByLabel("submit-button").click();

  await page.waitForTimeout(500);

  const tableVisible2 = await page.isVisible("#rowDisp");

  // Assert that the table is visible
  expect(tableVisible2).toBeTruthy();

  // Check if the table is filled with data
  const tableContent2 = await page.textContent("#rowDisp");

  // Check if table contains the right info
  expect(tableContent2).toContain("$500,000");
});

/* ------------------------  TESTING FOR OTHER ERRORS ------------------------  */

// Test for command case sensitivity
test("commands are case-insensitive", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // capitalise load file (incorrect)
  await page.getByLabel("Command input").fill("Load_File prices");
  await page.getByLabel("submit-button").click();

  //Checking that the history contains the error message
  const commandExists = await page.evaluate((commandText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(commandText)
    );
  }, "Unknown command: Load_File");

  // Assert that the command is found in the command history
  expect(commandExists).toBeTruthy();
});

/* ------------------------  TESTING INTERFACE ------------------------  */

test("i can use the echo command to repeat text", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  const testCommand = "echo Hello, world!";

  await page.getByLabel("Command input").fill(testCommand);
  await page.getByLabel("submit-button").click();

  const commandOutputExists = await page.evaluate((outputText) => {
    const commandElements = Array.from(
      document.querySelectorAll(".repl-history p")
    );
    return commandElements.some((element) =>
      element.textContent.includes(outputText)
    );
  }, "Hello, world!");

  expect(commandOutputExists).toBeTruthy();
});
