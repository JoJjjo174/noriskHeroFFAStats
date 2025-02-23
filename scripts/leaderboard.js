
let page = 1;

function loadPage() {

    const params = new URLSearchParams({
        sort: "kills",
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
            nameEntry.innerText = item.playerId;
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

loadPage();