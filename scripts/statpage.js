
function reqAPI(uuid) {

    fetch("https://api.hglabor.de/stats/ffa/"+uuid)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {

        setStats(data.xp, data.bounty, data.kills, data.deaths, data.currentKillStreak, data.highestKillStreak, data.playerId, "PlaceholderName");
        setHeroStats(data.heroes);

    })
    .catch(error => {
      console.error("API Error");
    });
}

function setHeroStats(heroes) {

    const heroAccordion = document.getElementById("accordionHero");

    for (const hero in heroes) {
        
        const collapseId = "collapse_" + hero;

        const accordionEntry = document.createElement("div");
        accordionEntry.classList.add("accordion-item");
        heroAccordion.appendChild(accordionEntry);

        const accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionEntry.appendChild(accordionHeader);

        const accordionButton = document.createElement("button");
        accordionButton.classList.add("accordion-button");
        accordionButton.type = "button";
        accordionButton.setAttribute("data-bs-toggle", "collapse");
        accordionButton.setAttribute("data-bs-target", "#"+collapseId);
        accordionButton.setAttribute("aria-expanded", "true");
        accordionButton.setAttribute("aria-controls", collapseId);
        accordionButton.innerText = hero;
        accordionHeader.appendChild(accordionButton);

        const accordionCollapse = document.createElement("div");
        accordionCollapse.id = collapseId;
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        accordionCollapse.setAttribute("data-bs-parent", "#accordionHero");
        accordionEntry.appendChild(accordionCollapse);

        const accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionBody.innerText = "Placeholder Text";
        accordionCollapse.appendChild(accordionBody);

    }
}

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