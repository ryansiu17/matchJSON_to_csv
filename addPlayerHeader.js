const fs = require("fs");
const playersCSVHeader =
  "platformId,accountId,summonerName,summonerId,currentPlatformId,currentAccountId,matchHistoryUri,profileIcon,participantId,teamId,championId,spell1Id,spell2Id,win,item0,item1,item2,item3,item4,item5,item6,kills,deaths,assists,largestKillingSpree,largestMultiKill,killingSprees,longestTimeSpentLiving,doubleKills,tripleKills,quadraKills,pentaKills,unrealKills,totalDamageDealt,magicDamageDealt,physicalDamageDealt,trueDamageDealt,largestCriticalStrike,totalDamageDealtToChampions,magicDamageDealtToChampions,physicalDamageDealtToChampions,trueDamageDealtToChampions,totalHeal,totalUnitsHealed,damageSelfMitigated,damageDealtToObjectives,damageDealtToTurrets,visionScore,timeCCingOthers,totalDamageTaken,magicalDamageTaken,physicalDamageTaken,trueDamageTaken,goldEarned,goldSpent,turretKills,inhibitorKills,totalMinionsKilled,neutralMinionsKilled,neutralMinionsKilledTeamJungle,neutralMinionsKilledEnemyJungle,totalTimeCrowdControlDealt,champLevel,visionWardsBoughtInGame,sightWardsBoughtInGame,wardsPlaced,wardsKilled,combatPlayerScore,objectivePlayerScore,totalPlayerScore,totalScoreRank,playerScore0,playerScore1,playerScore2,playerScore3,playerScore4,playerScore5,playerScore6,playerScore7,playerScore8,playerScore9,perk0,perk0Var1,perk0Var2,perk0Var3,perk1,perk1Var1,perk1Var2,perk1Var3,perk2,perk2Var1,perk2Var2,perk2Var3,perk3,perk3Var1,perk3Var2,perk3Var3,perk4,perk4Var1,perk4Var2,perk4Var3,perk5,perk5Var1,perk5Var2,perk5Var3,perkPrimaryStyle,perkSubStyle,statPerk0,statPerk1,statPerk2,firstBloodKill,firstBloodAssist,firstTowerKill,firstTowerAssist,firstInhibitorKill,firstInhibitorAssist,creepsPerMinDeltas-0-10,creepsPerMinDeltas-10-20,xpPerMinDeltas-0-10,xpPerMinDeltas-10-20,goldPerMinDeltas-0-10,goldPerMinDeltas-10-20,csDiffPerMinDeltas-0-10,csDiffPerMinDeltas-10-20,xpDiffPerMinDeltas-0-10,xpDiffPerMinDeltas-10-20,damageTakenPerMinDeltas-0-10,damageTakenPerMinDeltas-10-20,damageTakenDiffPerMinDeltas-0-10,damageTakenDiffPerMinDeltas-10-20,role,lane,gameId";

const addPlayersHeader = () => {
  fs.appendFile("players.csv", Object.keys(player).join(",") + "\n", err => {
    if (err !== null) {
      console.log("Error" + err);
    }
  });
};

addPlayersHeader();

// TODO: NOT DONE
