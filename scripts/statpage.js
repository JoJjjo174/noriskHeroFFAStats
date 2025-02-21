
function setStats(xp, bounty, kills, deaths, streak, maxstreak, uuid, name) {
    const kd = Math.round((kills / deaths) * 100) / 100

    document.getElementById("xp_entry").innerText = xp + " XP";
    document.getElementById("bounty_entry").innerText = bounty + " XP";

    document.getElementById("kd_entry").innerText = kd;
    document.getElementById("kills_entry").innerText = kills;
    document.getElementById("deaths_entry").innerText = deaths;

    document.getElementById("killstreak_entry").innerText = streak;
    document.getElementById("max_killstreak_entry").innerText = maxstreak;

    document.getElementById("player_skin").src = "https://mc-heads.net/body/" + uuid;
    document.getElementById("player_name").innerText = name;
}