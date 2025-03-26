import { loadGameModels } from './utils.js';
import { buildPiePlayer } from './charts/piePlayer.js'
import { buildPieCharacter } from './charts/pieCharacter.js'
import { buildPlayerCharacterBarChart } from './charts/barPlayerCharacter.js'


(async function main() {
    try {
        // load up the games 
        const gameModels = await loadGameModels();

        // console log for debug ahoy 10x engineer
        gameModels.slice(-5).forEach(game => console.log(game.format()));

        // build em
        buildPiePlayer(gameModels)
        buildPieCharacter(gameModels)
        buildPlayerCharacterBarChart(gameModels)

    } catch (error) {
        console.error("Error in main script:", error);
    }
})();