import { playerColours, successColour } from './colours.js';

export function buildStackedProgress(gameModels, levelsData) {
    const levelAttemptCounts = {};
    const successCounts = {};

    // init at zero
    for (const [world, levels] of Object.entries(levelsData)) {
        const worldInt = parseInt(world, 10);
        for (let level in levels) {
            const levelKey = `${worldInt}-${level}`;
            if (!levelAttemptCounts[levelKey]) {
                levelAttemptCounts[levelKey] = {};
            }
            successCounts[levelKey] = 0;
        }
    }

    // aggregate and propagate for all 'previous' levels
    gameModels.forEach((attempt) => {
        const worldInt = parseInt(attempt.world, 10);
        const levelInt = parseInt(attempt.level, 10);

        for (let w = 1; w <= worldInt; w++) {
            const numLevels = Object.keys(levelsData[w] || {}).length;
            const maxLevel = w === worldInt ? levelInt : numLevels;

            for (let l = 1; l <= maxLevel; l++) {
                const levelKey = `${w}-${l}`;
                if (attempt.success) {
                    successCounts[levelKey]++;
                }
                const player = attempt.deathPlayer || attempt.player;

                if (!levelAttemptCounts[levelKey][player]) {
                    levelAttemptCounts[levelKey][player] = 0;
                }
                levelAttemptCounts[levelKey][player]++;
            }
        }
    });

    
    // generate labels for x-axis
    const levelLabels = [];
    for (const [world, levels] of Object.entries(levelsData)) {
        const worldInt = parseInt(world, 10);
        for (let level in levels) {
            levelLabels.push(`${worldInt}-${level}`);
        }
    }
    
    // datasets for the chart
    const datasets = [];
    const players = new Set();
    Object.values(levelAttemptCounts).forEach((counts) => {
        Object.keys(counts).forEach((player) => {
            players.add(player);
        });
    });
    
    // players dataset
    players.forEach((player) => {
        const playerData = levelLabels.map((level) => {
            return levelAttemptCounts[level]?.[player] || 0;
        });

        datasets.push({
            label: `${player}`,
            data: playerData,
            backgroundColor: playerColours[player] || 'gray',
            borderWidth: 1, 
            stack: 'attempts', // common stack group because of successData group
        });
    });

    // success dataset
    const successData = levelLabels.map((level) => successCounts[level] || 0);
    datasets.push({
        label: 'Success',
        data: successData,
        backgroundColor: successColour, 
        borderWidth: 1,
        stack: 'attempts', 
    });

    return { labels: levelLabels, datasets };
}

export function buildProgressBar(gameModels, levelsData) {
    const { labels, datasets } = buildStackedProgress(gameModels, levelsData);

    const ctx = document.getElementById('progressBar').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels, // categorical x-axis
            datasets // stacked
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // fixed height
            indexAxis: 'x', // horizontal
            scales: {
                x: {
                    type: 'category', // categorical x-axis
                    title: {
                        display: true,
                        text: 'Progress (World-Level)'
                    },
                    ticks: {
                        autoSkip: false, 
                        // only show the labels for the -1 levels, for neatness
                        callback: (value, index, labelsArray) => {
                            const label = labels[index]; 
                            if (label && label.endsWith('-1')) { 
                                return label; 
                            }
                            return ''; // if not -1 level, hide it
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Attempts #'
                    },
                    grid: {
                        display: false
                    },
                    stacked: true, 
                    beginAtZero: true // start y-axis at 0 to ensure single attempts remain visible
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label; 
                            const datasets = context.chart.data.datasets; 
                            const attemptsAtLevel = datasets.map((dataset) => {
                                const playerName = dataset.label; 
                                const attemptCount = dataset.data[context.dataIndex] || 0; 
                                return `${playerName}: ${attemptCount}`; 
                            });

                            return [`World-Level: ${label}`, ...attemptsAtLevel];
                        },
                        title: () => null, 
                        body: (items) => items.map(() => null), 
                    },
                    displayColors: false, 
                },
                gridLines: {
                    drawOnChartArea: false, 
                }
            },
            elements: {
                bar: {
                    barPercentage: 1.0, // full-stack bars
                    categoryPercentage: 0.8 // separation for neatness
                }
            }
        }
    });

    // update the grid to be for each world only
    chart.options.scales.x.grid = {
        drawBorder: true,
        drawTicks: true,
        color: (context) => {
            const label = String(labels[context.index]); 
            if (label && label.endsWith('-1')) {
                return '#ddd'; // display grid line for world changes (i.e. -1 levels)
            }
            return 'transparent'; // hide others
        },
    };

    chart.update();
}