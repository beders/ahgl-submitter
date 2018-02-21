chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'prepare') {
        let players = $('.bfy-table .player-in-game-name:visible').map(function() { return { name: this.innerText }}).get();
        let matchID = window.location.pathname.substring(window.location.pathname.indexOf('match/') + 6);
        let teamName = $('.team-details-title:visible > h4 > span')[0].innerText;
        console.log(`Found ${JSON.stringify(players)}, ${matchID}, ${teamName}`);
        if (!matchID || !teamName) {
            sendResponse({error: "Unable to find team name or match ID"});
        } else {
            sendResponse({matchID, players, teamName});
        }
    }
  });

ready('#stage-bracket-container bf-match .team-details-title', function(element) {
    console.log("Team roster ready");
    $('<button>').click(function() { sendDataToBackground() }).addClass("add-match btn btn-sm").text('Import to AHGL Tool').insertAfter($('h4', element));

});

function sendDataToBackground() {
    console.log("Sending data");
    chrome.runtime.sendMessage({action: "import", data: getData()}, function(response) {
        console.log(response);
    });
}

function getData() {
    let players = $('.bfy-table .player-in-game-name:visible').map(function() { return { name: this.innerText }}).get();
    let matchID = window.location.pathname.substring(window.location.pathname.indexOf('match/') + 6);
    let teamName = $('.team-details-title:visible > h4 > span')[0].innerText;
    console.log(`Found ${JSON.stringify(players)}, ${matchID}, ${teamName}`);
    if (!matchID || !teamName) {
        return {error: "Unable to find team name or match ID"};
    } else {
        return {matchID, players, teamName};
    }
}