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
}