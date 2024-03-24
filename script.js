const tracks = ["6312aa5be55fecb5f203aca4", "64dc4517fc3aa9caa02cb0a5", "64dc34bdfc3aa9caa02c9ccd", "64dc4438fc3aa9caa02caf97", "64dc541ffc3aa9caa02cc3b7", "64dc71fefc3aa9caa02cf1a2", "6393db78768e3ae5652f9754", "64dd8063fc3aa9caa02efc4e", "64dd78dafc3aa9caa02ef208", "64dd86f8fc3aa9caa02f066a", "64e11707fc3aa9caa0356bdc", "64dd8811fc3aa9caa02f0831", "64e49491fc3aa9caa03b6745", "64e49ee4fc3aa9caa03b877d", "64e52a94fc3aa9caa03cc79d", "64e4c5c5fc3aa9caa03be11a", "64e4e4e0fc3aa9caa03c2c03", "63c60cf6768e3ae565da6991", "64e565a3fc3aa9caa03d2b4f", "63e650f0768e3ae56549211d", "62a8b0a3e55fecb5f2c3ac13", "637128b632d52da7d53e44df", "6314fb8ae55fecb5f209cf6c", "63e59dc8768e3ae56546f4d6", "6287d2d0577e38fdd5dc9fb9", "6314f739e55fecb5f209c599", "6354cce571fbbbcef8279f1c", "628a540e577e38fdd5e484d5", "635710b371fbbbcef82e2f57"]

const removedAccounts = ["Nothing2ALT", "not_a_smurf"];

function condense(arr) {
  const counts = {};
  
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  
  return counts;
}

function valueSort(dict) {
  var items = Object.keys(dict).map(
  (key) => { return [key, dict[key]] });

  items.sort(
    (first, second) => { return second[1] - first[1] }
  );
  
  var keys = items.map(
    (e) => { return e[0] });

  return keys;
}

function wrCount() {
  document.getElementById("loading").innerHTML = "Loading...";
  IDtoPlayers(tracks);
}

function IDtoPlayers(IDs) {
  var fetches = [];
  for (let ID = 0; ID < IDs.length; ID++) {
    fetches.push(fetch("https://api.dashcraft.io/track/" + IDs[ID] + "?supportsLaps1=true")
     .then((response) => response.json())
     .then((json) => {
        console.log(json);
        var lbList = [];
        for (let v=0; v<json.leaderboard.length; v++) {
          var username = json.leaderboard[v].userId.username;
          var time = json.leaderboard[v].time;
          if (IDs[ID] == "64dc71fefc3aa9caa02cf1a2" && time >= 10) {
            continue;
          }
          if (removedAccounts.includes(username)) {
            continue;
          }
          lbList.push(username);
        }
       return lbList;
      }))
    }
  Promise.all(fetches)
    .then((users) => {
      recorddict = condense(users.flat());
      indexlist = valueSort(recorddict);
      publishstring = "";
      for (let i = 0; i < indexlist.length; i++) {
        publishstring += "<u>" + indexlist[i] + ":</u> " + recorddict[indexlist[i]] + "<br>";
      }
      document.getElementById("wr").innerHTML = publishstring;
      document.getElementById("loading").innerHTML = "";
      
    });
}