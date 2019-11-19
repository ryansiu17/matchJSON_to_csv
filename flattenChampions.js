const fs = require("fs");
require("dotenv").config();

const readChamps = path => {
  fs.readFile(path, (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      flattenChampions(JSON.parse(jsonString));
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
};

const flattenChampions = json => {
  let data = json.data;
  let championNames = {};
  let championRoles = {};
  for (let champ of Object.keys(data)) {
    championNames[data[champ].key] = data[champ].id;
    championRoles[data[champ].key] = data[champ].tags[0];
  }
  writeFlatChampionNamesJSON(championNames);
  writeFlatChampionRolesJSON(championRoles);
};

const writeFlatChampionNamesJSON = champions => {
  fs.writeFile("flatChampionNames.json", JSON.stringify(champions), err => {
    if (err !== null) {
      console.log("Error" + err);
    }
  });
};
const writeFlatChampionRolesJSON = champions => {
  fs.writeFile("flatChampionRoles.json", JSON.stringify(champions), err => {
    if (err !== null) {
      console.log("Error" + err);
    }
  });
};

const main = () => {
  readChamps("./champions.json");
};

main();
