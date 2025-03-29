export class GameModel {
    // where and who cause this death
    constructor(date, success, world, level, deathPlayer, deathCharacter, levelsData) {
        this.date = date;
        this.success = success;

        // hacky data validation, force fields to behave when successful run
        if (success) {
            this.world = "7";
            this.level = "2";
            this.deathPlayer = "";
            this.deathCharacter = "";
        } else {
            this.world = world;
            this.level = level;
            this.deathPlayer = deathPlayer;
            this.deathCharacter = deathCharacter;
        }

        this.level_name = levelsData[this.world]?.[this.level] || "Unknown Level";
    }

    format() {
        if (this.success) {
            return `Successful run!`
        } else {
            return `${this.deathPlayer} died as ${this.deathCharacter} on ${this.level_name} (World ${this.world}, Level ${this.level}) on ${this.date}`;
        }
    }
}