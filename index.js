const fs = require("fs");
require("dotenv").config();

const directory = process.env.JSON_DIRECTORY;
const matchesCSVHeader =
  "gameId,platformId,gameCreation,gameDuration,queueId,mapId,seasonId,gameVersion,gameMode,gameType,team0-teamId,team0-win,team0-firstBlood,team0-firstTower,team0-firstInhibitor,team0-firstBaron,team0-firstDragon,team0-firstRiftHerald,team0-towerKills,team0-inhibitorKills,team0-baronKills,team0-dragonKills,team0-vilemawKills,team0-riftHeraldKills,team0-dominionVictoryScore,team0-ban-0-championId,team0-ban-1-championId,team0-ban-2-championId,team0-ban-3-championId,team0-ban-4-championId,team1-teamId,team1-win,team1-firstBlood,team1-firstTower,team1-firstInhibitor,team1-firstBaron,team1-firstDragon,team1-firstRiftHerald,team1-towerKills,team1-inhibitorKills,team1-baronKills,team1-dragonKills,team1-vilemawKills,team1-riftHeraldKills,team1-dominionVictoryScore,team1-ban-0-championId,team1-ban-1-championId,team1-ban-2-championId,team1-ban-3-championId,team1-ban-4-championId";
const playersCSVHeader =
  "platformId,accountId,summonerName,summonerId,currentPlatformId,currentAccountId,matchHistoryUri,profileIcon,participantId,teamId,championId,spell1Id,spell2Id,win,item0,item1,item2,item3,item4,item5,item6,kills,deaths,assists,largestKillingSpree,largestMultiKill,killingSprees,longestTimeSpentLiving,doubleKills,tripleKills,quadraKills,pentaKills,unrealKills,totalDamageDealt,magicDamageDealt,physicalDamageDealt,trueDamageDealt,largestCriticalStrike,totalDamageDealtToChampions,magicDamageDealtToChampions,physicalDamageDealtToChampions,trueDamageDealtToChampions,totalHeal,totalUnitsHealed,damageSelfMitigated,damageDealtToObjectives,damageDealtToTurrets,visionScore,timeCCingOthers,totalDamageTaken,magicalDamageTaken,physicalDamageTaken,trueDamageTaken,goldEarned,goldSpent,turretKills,inhibitorKills,totalMinionsKilled,neutralMinionsKilled,neutralMinionsKilledTeamJungle,neutralMinionsKilledEnemyJungle,totalTimeCrowdControlDealt,champLevel,visionWardsBoughtInGame,sightWardsBoughtInGame,wardsPlaced,wardsKilled,combatPlayerScore,objectivePlayerScore,totalPlayerScore,totalScoreRank,playerScore0,playerScore1,playerScore2,playerScore3,playerScore4,playerScore5,playerScore6,playerScore7,playerScore8,playerScore9,perk0,perk0Var1,perk0Var2,perk0Var3,perk1,perk1Var1,perk1Var2,perk1Var3,perk2,perk2Var1,perk2Var2,perk2Var3,perk3,perk3Var1,perk3Var2,perk3Var3,perk4,perk4Var1,perk4Var2,perk4Var3,perk5,perk5Var1,perk5Var2,perk5Var3,perkPrimaryStyle,perkSubStyle,statPerk0,statPerk1,statPerk2,firstBloodKill,firstBloodAssist,firstTowerKill,firstTowerAssist,firstInhibitorKill,firstInhibitorAssist,creepsPerMinDeltas-0-10,creepsPerMinDeltas-10-20,xpPerMinDeltas-0-10,xpPerMinDeltas-10-20,goldPerMinDeltas-0-10,goldPerMinDeltas-10-20,csDiffPerMinDeltas-0-10,csDiffPerMinDeltas-10-20,xpDiffPerMinDeltas-0-10,xpDiffPerMinDeltas-10-20,damageTakenPerMinDeltas-0-10,damageTakenPerMinDeltas-10-20,damageTakenDiffPerMinDeltas-0-10,damageTakenDiffPerMinDeltas-10-20,role,lane,championName,championRole,gameId";
const timelineValues = [
  "creepsPerMinDeltas",
  "xpPerMinDeltas",
  "goldPerMinDeltas",
  "csDiffPerMinDeltas",
  "xpDiffPerMinDeltas",
  "damageTakenPerMinDeltas",
  "damageTakenDiffPerMinDeltas"
];
const special = [
  "firstBloodKill",
  "firstBloodAssist",
  "firstTowerKill",
  "firstTowerAssist",
  "firstInhibitorKill",
  "firstInhibitorAssist"
];

const championNames = JSON.parse(fs.readFileSync("flatChampionNames.json"));
const championRoles = JSON.parse(fs.readFileSync("flatChampionRoles.json"));

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

const readJSONFromPath = path => {
  fs.readFile(path, (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      flattenJSON(JSON.parse(jsonString));
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
};

const flattenJSON = match => {
  let id = match["participantIdentities"];
  let pl = match["participants"];
  // Go through "teams" array
  for (let teamNum of match.teams) {
    let j = match.teams.indexOf(teamNum);
    for (let i of Object.keys(match.teams[j])) {
      if (i !== "bans") {
        match[`team${j}-${i}`] = match.teams[j][i];
      } else {
        for (let ban of match.teams[j]["bans"]) {
          match[
            `team${j}-ban-${match.teams[j]["bans"].indexOf(ban)}-championId`
          ] = ban.championId;
        }
      }
    }
  }
  // Getting player data from "participants" and "participantIdentities"
  for (let i = 0; i < 10; i++) {
    let player = {};
    let identity = id[i];
    let playerData = pl[i];

    // Flatten "participantIdentities"
    for (let j of Object.keys(identity.player)) {
      player[j] = identity.player[j];
    }

    // Flatten "participants"
    for (let j of Object.keys(playerData)) {
      if (
        j !== "stats" &&
        j !== "timeline" &&
        j !== "highestAchievedSeasonTier"
      ) {
        player[j] = playerData[j];
      } else if (j === "stats") {
        for (let k of Object.keys(playerData.stats)) {
          if (k !== "participantId" && !special.includes(k)) {
            player[k] = playerData.stats[k];
          }
        }
        for (let k of special) {
          if (playerData.stats[k] === undefined) {
            player[k] = "NA";
          } else {
            player[k] = playerData.stats[k];
          }
        }
      } else if (j === "timeline") {
        for (var m of timelineValues) {
          if (playerData.timeline[m] !== undefined) {
            if (playerData.timeline[m]["0-10"] === undefined) {
              player[`${m}-0-10`] = "NA";
            } else {
              player[`${m}-0-10`] = playerData.timeline[m]["0-10"];
            }
            if (playerData.timeline[m]["10-20"] === undefined) {
              player[`${m}-10-20`] = "NA";
            } else {
              player[`${m}-10-20`] = playerData.timeline[m]["10-20"];
            }
          } else {
            player[`${m}-0-10`] = "NA";
            player[`${m}-10-20`] = "NA";
          }
        }
        player.role = playerData.timeline["role"];
        player.lane = playerData.timeline["lane"];
        player.championName = championNames[player.championId];
        player.championRole = championRoles[player.championId];
      }
    }
    player.gameId = match.gameId;
    player.gameDuration = match.gameDuration;
    writePlayerCSV(player);
  }
  writeMatchCSV(match);
};

const getMatchesHeader = match => {
  delete match["teams"];
  delete match["participants"];
  delete match["participantIdentities"];
  fs.appendFile("matches.csv", Object.keys(match).join(",") + "\n", err => {
    if (err !== null) {
      console.log("Error" + err);
    }
  });
};

const writeMatchCSV = match => {
  delete match["teams"];
  delete match["participants"];
  delete match["participantIdentities"];
  fs.appendFile("matches.csv", Object.values(match).join(",") + "\n", err => {
    if (err !== null) {
      console.log("Error" + err);
    }
  });
};

const writePlayerCSV = player => {
  fs.appendFile("players.csv", Object.values(player).join(",") + "\n", err => {
    if (err !== null) {
      console.log("Error" + err);
    }
  });
};

const main = () => {
  console.log(directory);
  getFilePathsFromDir(directory, async paths => {
    for (let path of paths) {
      await readJSONFromPath(path);
      console.log(path);
    }
  });
};

main();
