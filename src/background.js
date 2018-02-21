chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'import') {
        console.log("importing data");
        let data = request.data;
        if (data.error) {
            console.log(data.error);
        } else {
            chrome.storage.sync.get('ahgl', function (storedData) {
                console.log("Found data:" + JSON.stringify(storedData));
                let oldData = storedData.ahgl ? storedData.ahgl : {
                    players: [/*{ name: 'NolanaKane#1487', role: 'Zerg'}*/],
                    matchID: '',
                    teamName: '',
                };
                let mergedData = mergeData(oldData, data);
                saveData(mergedData);
                chrome.tabs.create({url:"src/page_action/page_action.html"});
            });
        }
    }
  });

function mergeData(oldData, newData) {
    let tm = oldData.teamName;
    oldData.teamName = newData.teamName;
    oldData.matchID = newData.matchID;
    if (tm !== newData.teamName) { // different team, re-import players
        oldData.players = newData.players.map(p => { return {name: p.name, role: ''}});
    }
    return oldData;
}

function saveData(data) {
    chrome.storage.sync.set({ahgl: data }, () => {
        if (chrome.runtime.lastError) {
            console.log("Unable to store data");
        } else {
            console.log("Data saved");
        }
    });
}