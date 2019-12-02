const fs = require("graceful-fs");
require("dotenv").config();

const getFilePathsFromDir = (dir, cb) => {
  let gameIdList = [];
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Error reading directory", err);
      return;
    }
    files.forEach(file => {
      gameIdList.push({
        directory: dir,
        path: file,
        id: file.replace(".json", "")
      });
    });
    cb(gameIdList);
  });
};

const readTimelineJSON = game => {
  let path = `./${game.directory}/${game.path}`;

  fs.readFile(path, (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      flattenTimelineJSON(JSON.parse(jsonString), game.id);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
};

const flattenTimelineJSON = (match, matchId) => {
  // participant frames first
  for (let frame of match.frames) {
    let participants = frame.participantFrames;
    for (let id in participants) {
      let pf = participants[id];
      let out = {};
      out.timestamp = frame.timestamp;
      out.matchId = matchId;
      out.participantId = pf.participantId;
      out.currentGold = pf.currentGold;
      out.totalGold = pf.totalGold;
      out.teamScore = pf.teamScore;
      out.level = pf.level;
      out.jungleMinionsKilled = pf.jungleMinionsKilled;
      out.xp = pf.xp;
      out.minionsKilled = pf.minionsKilled;
      out.dominionScore = pf.dominionScore;
      if (pf.position !== undefined) {
        out.position_x = pf.position.x;
        out.position_y = pf.position.y;
      } else {
        out.position_x = undefined;
        out.position_y = undefined;
      }
      writeParticipantsCSV(out);
    }

    // events
    let events = frame.events;
    for (let event of events) {
      if (event !== undefined) {
        let output = {};
        output.matchId = matchId;
        output.timestamp = event.timestamp;
        output.participantId = event.participantId;
        output.teamId = event.teamId;
        output.type = event.type;
        if (event.position !== undefined) {
          output.position_x = event.position.x;
          output.position_y = event.position.y;
        } else {
          output.position_x = undefined;
          output.position_y = undefined;
        }
        output.eventType = event.eventType;
        output.wardType = event.wardType;
        output.towerType = event.towerType;
        output.killerId = event.killerId;
        output.victimId = event.victimId;
        output.levelUpType = event.levelUpType;
        output.skillSlot = event.skillSlot;
        output.monsterType = event.monsterType;
        output.monsterSubType = event.monsterSubType;
        output.laneType = event.laneType;
        output.itemId = event.itemId;
        output.buildingType = event.buildingType;
        output.creatorId = event.creatorId;
        output.beforeId = event.beforeId;
        output.afterId = event.afterId;
        output.ascendedType = event.ascendedType;
        output.pointCaptured = event.pointCaptured;
        writeEventCSV(output);
      }
    }
  }
};

const writeEventCSV = event => {
  fs.appendFile("events.csv", Object.values(event).join(",") + "\n", err => {
    if (err !== null) {
      console.log("Error" + err);
    }
  });
};

const writeParticipantsCSV = participant => {
  fs.appendFile(
    "participants.csv",
    Object.values(participant).join(",") + "\n",
    err => {
      if (err !== null) {
        console.log("Error" + err);
      }
    }
  );
};

const main = () => {
  getFilePathsFromDir("timelinejsons", async games => {
    for (let game of games) {
      await readTimelineJSON(game);
      console.log("flattened match " + game.id);
    }
  });
};

main();
