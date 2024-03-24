const newTracks = ["65ac62b6bfde41e9d30919dc", "65ac5563bfde41e9d3090753", "65e381918fb6a718f9a9410a", "65f7a5d07bb0068befad371d", "65f7aed67bb0068befad413b", "65f7d7557bb0068befad8562", "65fe36fbd624bd26b4d39528", "65f860427bb0068befaf06f7", "65f869ed7bb0068befaf252e", "65f88ec47bb0068befaf95cc", "65ff075dd624bd26b4d59937", "65f7b8047bb0068befad4f9c", "65f8a1857bb0068befafcabd", "65f905f77bb0068befb0a4ca", "65f9fb137bb0068befb39a83", "65fa1fcc7bb0068befb3e8fd", "65fa23e37bb0068befb3f093", "65fcf765d624bd26b4ce7381", "65fcf5bed624bd26b4ce7165", "65fdc9f1d624bd26b4d24e1b"];

const oldTracks = ["6514cb7dfc3aa9caa098f4b4", "651b950efc3aa9caa0a668e6", "651cb43efc3aa9caa0a93583", "633b363ce55fecb5f27c85c9", "633c78e8e55fecb5f280bf1d", "633dba89e55fecb5f284ff41", "6535a9b1fc3aa9caa0da4798", "6536f90bfc3aa9caa0dcfa80", "6537c8bcfc3aa9caa0de6c78", "652c9682fc3aa9caa0c89e50"];

const headers = {"Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWZmZDMyNWQ2MjRiZDI2YjRkODRjZmEiLCJpbnRlbnQiOiJvQXV0aCIsImlhdCI6MTcxMTI2NDU0OX0.p311xWHbZDy7P37h6kh-k5AgN-S81-d5SM0LZtw5L5Q"};

const removedAccounts = [];

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
  IDtoPlayers();
}

function IDtoPlayers() {
  console.log("Counting " + (newTracks.length + oldTracks.length) + " total tracks.")
  var fetches = [];
  for (let ID = 0; ID < newTracks.length; ID++) {
    fetches.push(fetch("https://api.dashcraft.io/trackv2/" + newTracks[ID], {headers:headers})
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        var lbList = [];
        for (let v = 0; v < json.leaderboard.length; v++) {
          var username = json.leaderboard[v].user.username;
          var time = json.leaderboard[v].time;
          if (removedAccounts.includes(username)) {
            continue;
          }
          lbList.push(username);
        }
        return lbList;
      }))
  }

  for (let ID = 0; ID < oldTracks.length; ID++) {
    fetches.push(fetch("https://api.dashcraft.io/track/" + oldTracks[ID] + "?supportsLaps1=true", {headers:headers})
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        var lbList = [];
        for (let v = 0; v < json.leaderboard.length; v++) {
          var username = json.leaderboard[v].userId.username;
          var time = json.leaderboard[v].time;
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