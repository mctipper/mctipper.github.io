import { loadGameModels } from './loaders/loadGameModels.js';
import { buildStatsBox } from './charts/statsBox.js'
import { buildPiePlayerDeath } from './charts/piePlayerDeath.js'
import { buildPieCharacterDeath } from './charts/pieCharacterDeath.js'
import { buildPlayerCharacterDeathBarChart } from './charts/barPlayerCharacterDeath.js'
import { buildStreakPlot } from './charts/linePlayerDeathStreak.js'
import { buildProgressBar } from './charts/barProgress.js'


(async function main() {
    try {
        // load up the games 
        const { gameModels, levelsData } = await loadGameModels();

        // console log for debug ahoy 10x engineer sighted
        // gameModels.slice(-5).forEach(game => console.log(game.format()));

        // stats box
        buildStatsBox(gameModels)

        // death charts
        buildPiePlayerDeath(gameModels)
        buildPieCharacterDeath(gameModels)
        buildPlayerCharacterDeathBarChart(gameModels)

        // death streak
        buildStreakPlot(gameModels)

        // game progress
        buildProgressBar(gameModels, levelsData)

    } catch (error) {
        console.error("Error in main script:", error);
    }
})();