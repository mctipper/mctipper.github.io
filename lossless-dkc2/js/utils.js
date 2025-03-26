import { GameModel } from './models/game.js';

export async function loadGameModels() {
    try {
        const gamesPath = 'data/games.json'
        const levelsPath = 'data/levels.json'

        const [gamesResponse, levelsResponse] = await Promise.all([
            fetch(gamesPath),
            fetch(levelsPath)
        ]);

        const gamesData = await gamesResponse.json();
        const levelsData = await levelsResponse.json();

        // flatten to list and map to our GameModel objects because neatness
        const flattenedGamesData = Object.values(gamesData[0]);
        const gameModels = flattenedGamesData.map(entry => {
            return new GameModel(
                entry.date,
                entry.world,
                entry.level,
                entry.player,
                entry.character,
                levelsData // levels data used to compute the level name
            );
        });

        return gameModels;
    } catch (error) {
        console.error("Error loading game or level data:", error);
    }
}