export class GameModel {
    // where and who cause this death
    // TODO how to model a successful run???
    constructor(date, world, level, player, character, levelsData) {
        this.date = date;
        this.world = world;
        this.level = level;
        this.player = player;
        this.character = character;
        this.level_name = levelsData[this.world]?.[this.level] || "Unknown Level"
    }

    format() {
        return `${this.player} died as ${this.character} on ${this.level_name} (World ${this.world}, Level ${this.level}) on ${this.date}`;
    }
}