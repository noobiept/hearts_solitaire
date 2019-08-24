import { setData } from "./app_storage.js";

export interface StatsData {
    games_played: number;
    games_won: number;
    win_rate: number;
}

var STATS: StatsData = {
    games_played: 0,
    games_won: 0,
    win_rate: 0,
};

export function load(stats?: StatsData) {
    if (stats) {
        STATS.games_played = stats.games_played;
        STATS.games_won = stats.games_won;
        STATS.win_rate = stats.win_rate;
    }
}

function save() {
    setData({ hearts_statistics: STATS });
}

export function getGamesPlayed() {
    return STATS.games_played;
}

export function getGamesWon() {
    return STATS.games_won;
}

export function getWinRate() {
    return STATS.win_rate;
}

export function oneMoreGame(victory: boolean) {
    STATS.games_played++;

    if (victory === true) {
        STATS.games_won++;
    }

    STATS.win_rate = Math.round((STATS.games_won / STATS.games_played) * 100);

    save();
}
