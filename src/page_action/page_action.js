let data = {
    players: [],
    matchID: '',
    teamName: '',
    game: 'SC2',
    roles: {'SC2': ['Terran', 'Zerg', 'Protoss', 'Random']},
    error: '',
    message: ''
};

document.addEventListener("DOMContentLoaded", function () {
    // document.getElementById("prepare-action").onclick = e => prepare();
    console.log("initializing vue");
    Vue.component('players-list', {
        template: '#players-list-template',
        data() {
            return data;
        },
        methods: {
            moveUp: function (index) {
                console.log("moving up" + index);
                this.players.splice(index - 1, 2, this.players[index], this.players[index - 1]);
            },
            moveDown: function (index) {
                console.log("moving down" + index);
                this.players.splice(index, 2, this.players[index + 1], this.players[index]);
            },
            copyToClipboard: function () {
                document.querySelector('.lineup').select();
                document.execCommand('copy')
            }
        },
        computed: {
            lineup() {
                return this.players.slice(0, 4);
            },
            lineupString() {
                return `!lineup ${this.matchID} ${this.teamName} /players ${this.lineup.map(p => p.name).join(',')} /types ${this.lineup.map(p => p.role).join(',')}`
            }
        }
    });

    chrome.storage.sync.get('ahgl', function (storedData) {
        console.log(JSON.stringify(storedData));

        if (storedData.ahgl) {
            data.players = storedData.ahgl.players;
            data.teamName = storedData.ahgl.teamName;
            data.matchID = storedData.ahgl.matchID;
        }
        let app = new Vue({
            el: '#app',
            data,
            methods: {
                saveAndClose(e) {
                    saveData();
                    window.close();
                },
                dismiss(e) {
                    this.message = null;
                }
            }
        })
    });
});

function saveData() {
    chrome.storage.sync.set({ahgl: {players: data.players, teamName: data.teamName, matchID: data.matchID}}, () => {
        if (chrome.runtime.lastError) {
            console.log("Unable to store data");
        } else {
            console.log("Data saved");
        }
    });
}