const fs = require("fs");
let filepaths = [];

getFilePathsFromDir = dir => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Error reading directory", err);
      return;
    }
    files.forEach(file => {
      filepaths.push(`./${dir}/${file}`);
    });
    console.log(filepaths);
  });
};

readJSONFromPath = path => {
  fs.readFile(path, "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      const a = JSON.parse(jsonString);
      console.log(a); // => "Customer address is: Infinity Loop Drive"
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
};

// getFilePathsFromDir("json");
readJSONFromPath("./json/3187631326.json");
