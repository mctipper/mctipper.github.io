export function buildStatsBox(gameModels) {
    // data wrangling for lhs
    const totalAttempts = gameModels.length;
    const totalSuccesses = gameModels.filter(entry => entry.success).length;
    const mogDeaths = gameModels.filter(entry => entry.deathPlayer === "Mog").length;
    const shagDeaths = gameModels.filter(entry => entry.deathPlayer === "Shag").length;

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
    document.getElementById("totalAttempts").textContent = totalAttempts;
    document.getElementById("totalSuccesses").textContent = totalSuccesses;
    document.getElementById("mogDeaths").textContent = mogDeaths;
    document.getElementById("shagDeaths").textContent = shagDeaths;
    document.getElementById("furthestWorld").textContent = furthestRun.world || 0;
    document.getElementById("furthestLevel").textContent = furthestRun.level || 0;
    document.getElementById("furthestRunLevelName").textContent = furthestRunLevelName;
    document.getElementById("deathPlayer").textContent = furthestRun.deathPlayer || "Unknown";
    document.getElementById("deathCharacter").textContent = furthestRun.deathCharacter || "Unknown";
    document.getElementById("timesReached").textContent = timesReached;
}