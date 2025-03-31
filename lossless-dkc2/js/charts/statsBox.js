export function buildStatsBox(gameModels) {
    // data wrangling for lhs
    const totalAttempts = gameModels.length;
    const totalSuccesses = gameModels.filter(entry => entry.success).length;

    // player deaths dynamic build
    const playerDeaths = gameModels.reduce((acc, entry) => {
        const playerName = entry.deathPlayer || "Unknown";
        acc[playerName] = (acc[playerName] || 0) + 1;
        return acc;
    }, {});

    // ordered by most-death descending
    const sortedPlayerDeaths = Object.entries(playerDeaths)
    .sort(([, countA], [, countB]) => countB - countA);

    const orderedPlayerDeaths = Object.fromEntries(sortedPlayerDeaths);

    // data wrangling for rhs
    const furthestRun = gameModels.reduce((max, entry) => {
        const current = parseInt(entry.world) * 100 + parseInt(entry.level);
        return current > max.value ? { ...entry, value: current } : max;
    }, { value: 0 });
    const furthestRunLevelName = furthestRun.level_name || "Unknown Level";
    const timesReached = gameModels.filter(
        entry => entry.world === furthestRun.world && entry.level === furthestRun.level
    ).length;


    // update the render

    // lhs
    document.getElementById("totalAttempts").textContent = totalAttempts;
    document.getElementById("totalSuccesses").textContent = totalSuccesses;
    const playersContainer = document.getElementById("playerDeathCounts");
    playersContainer.innerHTML = ""; // wipe it as a safety before populating

    Object.entries(orderedPlayerDeaths).forEach(([player, deaths]) => {
        const playerElement = document.createElement("p");
        playerElement.className = "card-text";
        
        playerElement.textContent = `${player}: `;
        const deathsSpan = document.createElement("span");
        deathsSpan.textContent = `${deaths} deaths`;
        playerElement.appendChild(deathsSpan);
        playersContainer.appendChild(playerElement);
    });
    
    // rhs
    document.getElementById("furthestWorld").textContent = furthestRun.world || 0;
    document.getElementById("furthestLevel").textContent = furthestRun.level || 0;
    document.getElementById("furthestRunLevelName").textContent = furthestRunLevelName;
    document.getElementById("deathPlayer").textContent = furthestRun.deathPlayer || "Unknown";
    document.getElementById("deathCharacter").textContent = furthestRun.deathCharacter || "Unknown";
    document.getElementById("timesReached").textContent = timesReached;
}