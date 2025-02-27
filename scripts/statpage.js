
function reqAPI(uuid, name) {

    fetch("https://api.hglabor.de/stats/ffa/"+uuid)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {

        setStats(data.xp, data.bounty, data.kills, data.deaths, data.currentKillStreak, data.highestKillStreak, data.playerId, name);
        setHeroStats(data.heroes);

    })
    .catch(error => {
      console.error("API Error");
    });
}

async function getUpgradeLevel(hero, skill, upgrade) {
    if (!sessionStorage.getItem("herodata-" + hero)) {
        try {
            const response = await fetch("https://api.hglabor.de/ffa/hero/" + hero);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            sessionStorage.setItem("herodata-" + hero, JSON.stringify(data.properties));
        } catch (error) {
            console.error("API Error", error);
        }
    }

    const skillData = JSON.parse(sessionStorage.getItem("herodata-"+hero))[skill];

    for (const upgradeData in skillData) {
        if (skillData[upgradeData].name.toLowerCase() == upgrade.toLowerCase()) {
            return { "levelScale": skillData[upgradeData].levelScale, "maxLevel": skillData[upgradeData].maxLevel };
        }
    }
}

function setHeroStats(heroes) {

    const heroAccordion = document.getElementById("accordionHero");

    let first = true;
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
        accordionButton.classList.add("text-capitalize");
        accordionButton.type = "button";
        accordionButton.setAttribute("data-bs-toggle", "collapse");
        accordionButton.setAttribute("data-bs-target", "#"+collapseId);
        if (first) {
            accordionButton.setAttribute("aria-expanded", "true");
        } else {
            accordionButton.setAttribute("aria-expanded", "false");
            accordionButton.classList.add("collapsed");
        }
        accordionButton.setAttribute("aria-controls", collapseId);
        accordionButton.innerText = removeUnderscore(hero);
        accordionHeader.appendChild(accordionButton);

        const accordionCollapse = document.createElement("div");
        accordionCollapse.id = collapseId;
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        if (first) {
            accordionCollapse.classList.add("show");
            first = false;
        }
        accordionCollapse.setAttribute("data-bs-parent", "#accordionHero");
        accordionEntry.appendChild(accordionCollapse);

        const accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionCollapse.appendChild(accordionBody);

        for (const ability in heroes[hero]) {

            const abilityHeader = document.createElement("h5");
            abilityHeader.classList.add("primary");
            abilityHeader.classList.add("text-capitalize");
            abilityHeader.innerText = removeUnderscore(ability);
            accordionBody.appendChild(abilityHeader);

            const upgradeList = document.createElement("ul");
            accordionBody.appendChild(upgradeList);

            for (const upgrade in heroes[hero][ability]) {
    
                const listEntry = document.createElement("li");

                const upgradeName = document.createElement("span");
                upgradeName.classList.add("text-capitalize");
                upgradeName.innerText = removeUnderscore(upgrade) + ": ";
                listEntry.appendChild(upgradeName);

                const upgradeLevel = document.createElement("span");
                upgradeLevel.classList.add("primary");

                getUpgradeLevel(hero, ability, removeUnderscore(upgrade))
                .then(levelData => {
                    const pLevel = parseInt(Math.cbrt(heroes[hero][ability][upgrade].experiencePoints / levelData.levelScale));
                    upgradeLevel.innerText =  + pLevel + "/" + (levelData.maxLevel < pLevel ? pLevel : levelData.maxLevel);
                });
                //upgradeLevel.innerText = heroes[hero][ability][upgrade].experiencePoints;
                listEntry.appendChild(upgradeLevel);

                upgradeList.appendChild(listEntry);

            }

        }
    }
}

function removeUnderscore(text) {
    let name = text.replaceAll("_", " ");
    return name;
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

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("player");
document.getElementById("compareButton").setAttribute("href", "compare.html?player1="+username);
getUUID(username).then(uuid => reqAPI(uuid, username));
