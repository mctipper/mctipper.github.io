import { playerColours, characterColours } from './colours.js'

export function buildPlayerCharacterBarChart(gameModels) {
    // build a bar chart based on player and character combined deaths
    const categories = {}; // result storage because multiple layers of categories

    gameModels.forEach(game => {
        const key = `${game.player}-${game.character}`;
        categories[key] = (categories[key] || 0) + 1;
    });

    let labels = Object.keys(categories);
    let data = Object.values(categories);

    // sort these alphabetically
    const sortedIndices = labels
        .map((label, index) => ({ label, index }))
        .sort((a, b) => a.label.localeCompare(b.label));

    labels = sortedIndices.map(item => item.label);
    data = sortedIndices.map(item => data[item.index]);

    const barCtx = document.getElementById('playerCharacterBarChart').getContext('2d');
    const chart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y', // horizontal bar chart
            scales: {
                x: {
                    beginAtZero: true 
                }
            }
        }
    });

    // custom formatting

    // fill and border based on player-character combination
    // player border
    chart.data.datasets[0].borderColor = labels.map(label => {
        const [player] = label.split('-');
        return playerColours[player] || 'gray';
    });
    chart.data.datasets[0].borderWidth = 4;

    // character fill
    chart.data.datasets[0].backgroundColor = labels.map(label => {
        const [_, character] = label.split('-');
        return characterColours[character] || 'gray'; 
    });

    // integer x-axis
    chart.options.scales.x.ticks.stepSize = 1;
    chart.options.scales.x.ticks.callback = value => (Number.isInteger(value) ? value : '');

    // no legend pls
    chart.options.plugins.legend.display = false;

    chart.update();
}