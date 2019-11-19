const fs = require("fs");
require("dotenv").config();

const rankHeader =
  "leagueId,queueType,tier,rank,summonerId,summonerName,leaguePoints,wins,losses,veteran,inactive,freshBlood,hotStreak,miniSeries-target,miniSeries-wins,miniSeries-losses,miniSeries-progress";
const getFilePathsFromDir = (dir, cb) => {
  let filepaths = [];
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Error reading directory", err);
      return;
    }
    files.forEach(file => {
      filepaths.push(`./${dir}/${file}`);
    });
    cb(filepaths);
  });
};

const readPlayerRankJSON = path => {
  fs.readFile(path, (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      flattenPlayerRankJSON(JSON.parse(jsonString));
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
};

const flattenPlayerRankJSON = ranks => {
  for (let rank of ranks) {
    if (Object.keys(rank).includes("miniSeries")) {
      rank["miniSeries-target"] = rank.miniSeries.target;
      rank["miniSeries-wins"] = rank.miniSeries.wins;
      rank["miniSeries-losses"] = rank.miniSeries.losses;
      rank["miniSeries-progress"] = rank.miniSeries.progress;
      delete rank.miniSeries;
    } else {
      rank["miniSeries-target"] = "NA";
      rank["miniSeries-wins"] = "NA";
      rank["miniSeries-losses"] = "NA";
      rank["miniSeries-progress"] = "NA";
    }
    writeRankCSV(rank);
  }
};

const writeRankCSV = player => {
  fs.appendFile(
    "playerRank.csv",
    Object.values(player).join(",") + "\n",
    err => {
      if (err !== null) {
        console.log("Error" + err);
      }
    }
  );
};

const main = () => {
  getFilePathsFromDir("leaguedata", async paths => {
    for (let path of paths) {
      await readPlayerRankJSON(path);
      console.log(path);
    }
  });
};

main();
