import { playerColours } from "./colours.js";

export function buildPiePlayer(gameModels) {
    // build a pie chart based on number of deaths by player
    const playerCounts = {};
    gameModels.forEach(game => {
        playerCounts[game.player] = (playerCounts[game.player] || 0) + 1;
    });

    const labels = Object.keys(playerCounts); // player names
    const data = Object.values(playerCounts); // count of deaths

    const pieCtx = document.getElementById('playerPieChart').getContext('2d');
    const chart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });

    // custom formatting
    chart.data.datasets[0].backgroundColor = labels.map(character => playerColours[character] || 'gray'); // Default to gray if no match
    chart.data.datasets[0].borderColor = labels.map(() => '#FFFFFF');
    chart.data.datasets[0].borderWidth = 1;

    chart.update();
}