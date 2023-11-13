// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
console.log("Loading preload scripts...");

const path = require("path");
const fs = require("fs");
const os = require("os");
const { contextBridge } = require("electron");
const { exec } = require("child_process");
const { PythonShell } = require("python-shell");

const configPath = process.env.LOCALAPPDATA + "\\Sentic\\config.json";

function getConfig() {
  console.log("Getting config...");
  checkCreateConfig();

  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
function createNewConfig() {
  if (fs.existsSync(configPath)) return;

  let obj = {
    "time-data": {
      "last-change": "Sun, 22 Oct 2023 14:46:27 GMT",
      "change-frequency": "10000",
    },
    "file-paths": {
      quotes: "C:\\Users\\{user}\\Pictures\\Sentic\\",
    },
    "quote-data": {
      quote: "Nothing updated yet!",
      author: "Sentic",
    },
    settings: {
      "wallpaper-size": {
        width: "screen",
        height: "screen",
      },
      text: {
        size: "18",
        color: "EEEEEE",
      },
      "display-author": true,
      "author-quote-offset": "20",
      "quote-font": "arial",
      "author-font": "arial",
    },
  };

  console.log(`Adding new config to ${configPath}...`);

  fs.writeFileSync(path.join(configPath), JSON.stringify(obj));

  runScript();
}
function checkCreateConfig() {
  if (!fs.existsSync(configPath)) {
    console.log("Config not found!");

    if (!fs.existsSync(process.env.LOCALAPPDATA + "\\Sentic")) {
      console.log(
        "Creating folder at " + process.env.LOCALAPPDATA + "\\Sentic"
      );

      fs.mkdirSync(path.join(process.env.LOCALAPPDATA, "\\Sentic"));
    }
    createNewConfig();
  }
}

function getHistory() {
  let quotesPath = getConfig()["file-paths"]["quotes"].replace(
    "{user}",
    os.userInfo().username
  );
  let fileNames = fs.readdirSync(quotesPath, "utf-8");
  let quotesData = fileNames.map((fileName) => {
    return [
      `${quotesPath}${fileName}`,
      fileName.split(".")[0],
      fileName.split(".")[1],
    ];
  });

  return quotesData;
}
function getQuotesPath() {
  return getConfig()["file-paths"]["quotes"].replace(
    "{user}",
    os.userInfo().username
  );
}
function renameFile(original, replacement) {
  fs.renameSync(original, replacement);
}
function openImage(imagePath) {
  const openCommand =
    process.platform === "win32"
      ? "start"
      : process.platform === "darwin"
      ? "open"
      : "xdg-open";

  // Execute the command to open the image file
  exec(`${openCommand} ${imagePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Error opening image file:", err);
      return;
    }

    console.log("Image file opened successfully");
  });
}
function updateWriteJsonValue(keyPath, newValue) {
  try {
    // Read the JSON file synchronously
    const data = fs.readFileSync(configPath, "utf8");

    // Parse the JSON data
    const json = JSON.parse(data);

    // Split the key path by '.' to access nested properties
    const keys = keyPath.split(".");

    // Traverse the JSON object to the specified key path
    let current = json;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
      if (current === undefined || current === null) {
        console.error(`Key path ${keyPath} not found in JSON.`);
        return;
      }
    }

    // Update the value at the specified key path
    current[keys[keys.length - 1]] = newValue;

    // Write the updated JSON back to the file synchronously
    fs.writeFileSync(configPath, JSON.stringify(json, null, 2));

    console.log(
      `Updated value at path ${keyPath} to ${newValue} in ${configPath}`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

function runScript() {
  let options = {
    pythonPath: path.join(process.cwd(), "Misc/PythonVenv/Scripts/python.exe"),
    args: [configPath],
  };

  PythonShell.run(
    path.join(process.cwd(), "src/PYTHON/main.pyw"),
    options
  ).then((messages) => {
    messages.forEach((m) => console.log(`[ PYTHON ] ${m}`));
  });

  console.log("Options for python shell: " + JSON.stringify(options));
}

contextBridge.exposeInMainWorld("main", {
  configPath: path.join(__dirname, "config.json"),
  getConfig: getConfig,
  getHistory: getHistory,
  getQuotesPath: getQuotesPath,
  renameFile: renameFile,
  openImage: openImage,
  updateJsonValue: updateWriteJsonValue,
  runScript: runScript,
});
