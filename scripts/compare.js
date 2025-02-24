let params = new URLSearchParams(window.location.search); 
let forms = document.querySelectorAll("form.compareSearch");

forms.forEach(form => {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let formData = new FormData(form);
                
        let finalParams = new URLSearchParams(params);

        formData.forEach((value, key) => {
            finalParams.set(key, value);
        });

        window.location.href = window.location.pathname + "?" + finalParams.toString();
    });
});

function setPlayer(number, name, uuid, xp, bounty, kills, deaths, killstreak, maxKillstreak) {
    const kd = Math.round((kills / deaths) * 100) / 100

    document.getElementById("compareName"+number).innerText = name;
    document.getElementById("compareXp"+number).innerText = xp;
    document.getElementById("compareBounty"+number).innerText = bounty;
    document.getElementById("compareKd"+number).innerText = kd;
    document.getElementById("compareKills"+number).innerText = kills;
    document.getElementById("compareDeaths"+number).innerText = deaths;
    document.getElementById("compareKillstreak"+number).innerText = killstreak;
    document.getElementById("compareMaxKillstreak"+number).innerText = maxKillstreak;
    document.getElementById("compareModel"+number).src = "https://mc-heads.net/body/" + uuid;
}

function getUUID(username) {
    return fetch("https://playerdb.co/api/player/minecraft/"+username)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => data.data.player.id)
    .catch(error => console.error("API Error"));
}

function reqAPI(uuid, username, number) {
    fetch("https://api.hglabor.de/stats/ffa/"+uuid)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {

        setPlayer(number, username, data.playerId, data.xp, data.bounty, data.kills, data.deaths, data.currentKillStreak, data.highestKillStreak)

    })
    .catch(error => {
      console.error("API Error");
    });
}

const urlParams = new URLSearchParams(window.location.search);
const player1 = urlParams.get("player1");
const player2 = urlParams.get("player2");

if (player1) {
    getUUID(player1).then(uuid => {
        reqAPI(uuid, player1, 1)
    });
}
if (player2) {
    getUUID(player2).then(uuid => {
        reqAPI(uuid, player2, 2)
    });
}