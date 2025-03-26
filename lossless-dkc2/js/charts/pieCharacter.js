import { characterColours } from "./colours.js";

export function buildPieCharacter(gameModels) {
    // build a pie chart based on number of deaths by character
    const characterCounts = {}; 
    gameModels.forEach(game => {
        characterCounts[game.character] = (characterCounts[game.character] || 0) + 1;
    });

    const labels = Object.keys(characterCounts); // character names
    const data = Object.values(characterCounts); // count of deaths

    const pieCtx = document.getElementById('characterPieChart').getContext('2d');
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
    chart.data.datasets[0].backgroundColor = labels.map(character => characterColours[character] || 'gray'); // Default to gray if no match
    chart.data.datasets[0].borderColor = labels.map(() => '#FFFFFF');
    chart.data.datasets[0].borderWidth = 1;

    chart.update();
}