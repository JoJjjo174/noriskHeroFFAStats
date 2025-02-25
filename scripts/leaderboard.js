let page = 1;

document.getElementById("sortSelect").addEventListener("change", function(event) {
    document.getElementById("leaderboardTable").innerHTML = "";
    page = 1;
    loadPage();
});

function loadPage() {

    const sortBy = document.getElementById("sortSelect").value;
    const params = new URLSearchParams({
        sort: sortBy,
        page: page
    });

    fetch("https://api.hglabor.de/stats/ffa/top?"+params.toString())
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {

        const leadTable = document.getElementById("leaderboardTable");

        data.forEach((item, index) => {

            const tableRow = document.createElement("tr");
            leadTable.appendChild(tableRow);

            const positionEntry = document.createElement("td");
            positionEntry.innerText = index+1 + 100*(page-1);
            tableRow.appendChild(positionEntry);

            const nameEntry = document.createElement("td");
            nameEntry.classList.add("nameEntry");
            nameEntry.setAttribute("data-uuid", item.playerId);
            tableRow.appendChild(nameEntry);

            const xpEntry = document.createElement("td");
            xpEntry.innerText = item.xp;
            tableRow.appendChild(xpEntry);

            const bountyEntry = document.createElement("td");
            bountyEntry.innerText = item.bounty;
            tableRow.appendChild(bountyEntry);

            const killsEntry = document.createElement("td");
            killsEntry.innerText = item.kills;
            tableRow.appendChild(killsEntry);

            const deathsEntry = document.createElement("td");
            deathsEntry.innerText = item.deaths;
            tableRow.appendChild(deathsEntry);

            const killstreakEntry = document.createElement("td");
            killstreakEntry.innerText = item.currentKillStreak;
            tableRow.appendChild(killstreakEntry);

            const highestkillstreakEntry = document.createElement("td");
            highestkillstreakEntry.innerText = item.highestKillStreak;
            tableRow.appendChild(highestkillstreakEntry);
        });

        page++;
    })
    .catch(error => {
      console.error("API Error");
    });

}

function getUsername(uuid) {
    return fetch("https://playerdb.co/api/player/minecraft/"+uuid)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => data.data.player.username)
    .catch(error => console.error("API Error"));
}


// ------------------------------- ChatGPT :OO -------------------------------

// IntersectionObserver, der nur einmal triggert, wenn das Element sichtbar wird
const intersectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            
            entry.target.innerText = "loading...";
            const uuid = entry.target.getAttribute("data-uuid");
            getUsername(uuid).then(username => {

                entry.target.innerHTML = "";

                const avatar = document.createElement("img");
                avatar.classList.add("me-2");
                avatar.src = "https://mc-heads.net/avatar/" + uuid +"/24";
                avatar.alt = username + " avatar";
                entry.target.appendChild(avatar);

                const nameLink = document.createElement("a");
                nameLink.href = "player.html?player=" + username;
                nameLink.innerText = username;
                entry.target.appendChild(nameLink);

            });

            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); // 50% des Elements muss sichtbar sein

// MutationObserver, der auf Änderungen im DOM reagiert (Hinzufügung oder Entfernung von Elementen)
const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains("nameEntry")) {
                // Neues Element wird hinzugefügt - es muss beobachtet werden
                intersectionObserver.observe(node);
            }
        });

        mutation.removedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains("nameEntry")) {
                // Entferntes Element - die Beobachtung stoppen
                intersectionObserver.unobserve(node);
            }
        });
    });
});

// MutationObserver auf den gesamten DOM anwenden (Subtree überwachen für tiefere Änderungen)
mutationObserver.observe(document.body, { childList: true, subtree: true });

// Alle bestehenden Elemente der Klasse beobachten
const existingElements = document.querySelectorAll(".nameEntry");
existingElements.forEach(element => {
    intersectionObserver.observe(element);
});

// ------------------------------- ChatGPT Ende ------------------------------


loadPage();