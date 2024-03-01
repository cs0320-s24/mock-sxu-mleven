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

// test("i can change the mode to verbose mode, and then back to brief more", async ({page}) =>{

// })

// test("i can load in a file (mocked data)", async ({
//   page,
// }) => {});

// test("i can load in a file (mocked data) then view it", async ({ page }) => {});

// test("i can search in a file I am viewing", async ({ page }) => {});

// test("i can search in a file I have loaded but am not viewing", async ({ page }) => {});

// test("i am prompted if i try to load a file that does not exist", async ({ page }) => {});

// test("i am prompted if i try to load an empty file", async ({ page }) => {});

// Test for loading a non-existent csv file
test("on submitting an invalid command, an error message is displayed", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Attempt to submit an invalid command
  await page
    .getByLabel("Command input")
    .fill("load_file non_existent_file.csv");
  await page.getByLabel("button").click;

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("hi");
    await dialog.accept();
  });

  // await expect(page.getByLabel("repl-history")).toHaveValue("An error occurred. The inputted file does not exist.");
});

// // Test for command case sensitivity
// test("commands are case-insensitive", async ({ page }) => {
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   // Submit commands with different casing
//   await page.getByLabel("Command input").fill("View");
//   await page.keyboard.press("Enter");
//   await page.getByLabel("Command input").fill("view");
//   await page.keyboard.press("Enter");

//   // Verify that both commands are treated the same
//   await expect(page).toHaveText("Now viewing file:");
// });

// // Test for loading a file that does not exist
// test("attempting to load a nonexistent file displays an error message", async ({ page }) => {
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   // Attempt to load a nonexistent file
//   await page.getByLabel("Command input").fill("load_file non_existent_file.csv");
//   await page.keyboard.press("Enter");

//   // Verify that an error message is displayed
//   await expect(page).toHaveText("The file: \"non_existent_file.csv\" does not exist.");
// });

// Test for loading an empty file
// test("attempting to load an empty file displays an error message", async ({ page }) => {
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   // Attempt to load an empty file
//   await page.getByLabel("Command input").fill("load_file empty");
//  await page.getByLabel("button").click;

// Verify that an error message is displayed
//   await expect(page).toHaveText("The file: \"empty_file.csv\" is empty!");
// });

// test("attempting to view a file that has not been loaded", async ({ page }) => {
