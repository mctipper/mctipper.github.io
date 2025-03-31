import { playerColours, characterColours, successColour } from './colours.js';

function buildLevelProgressAxis(levelsData) {
    const levelMap = [];

    for (const [world, levels] of Object.entries(levelsData)) {
        const worldInt = parseInt(world, 10);
        const numLevels = Object.keys(levels).length;
        const step = 1 / (numLevels + 1); // Calculate the equidistant step for levels

        // Add a "world-0" entry
        levelMap.push({
            world: worldInt.toString(),
            level: '0',
            name: '',
            x: parseFloat(`${worldInt}.0`) // Ensure x-axis includes 1.0, 2.0, etc.
        });

        // Add all levels for this world, scaled equidistantly
        for (let i = 1; i <= numLevels; i++) {
            levelMap.push({
                world: worldInt.toString(),
                level: i.toString(),
                name: levelsData[worldInt][i],
                x: parseFloat((worldInt + i * step).toFixed(3)) // Calculate equidistant decimal and round to 3 decimals
            });
        }
    }
    return levelMap;
}

export function buildProgressBar(gameModels, levelsData) {
    const levelMap = buildLevelProgressAxis(levelsData);

    gameModels.reverse(); // reverse the order so the most recent attempt is at the top

    // data prep, massage it so can be made use of for both bar and point components of the chart
    const datasets = gameModels.map((attempt, index) => {
        const progressLevel = levelMap.find(l => l.world === attempt.world && l.level === attempt.level);
        const maxX = Math.max(...levelMap.map(level => level.x)); // for 'success = true', ensure bar / point can go full length
        const progressX = progressLevel ? progressLevel.x : maxX; // if null, make it full length as success wont have progress indicator

        const isSuccess = attempt.success;

        return {
            label: `Attempt ${gameModels.length - index}`,
            data: [
                {
                    x: progressX,
                    y: gameModels.length - index - 1,
                    attempt: gameModels.length - index,
                    success: attempt.success,
                    deathPlayer: attempt.deathPlayer,
                    deathCharacter: attempt.deathCharacter,
                    deathWorldLevel: `${attempt.world}-${attempt.level}`,
                    deathLevelName: attempt.level_name
                }
            ],
            backgroundColor: isSuccess ? successColour : playerColours[attempt.deathPlayer] || 'gray',
            borderColor: isSuccess ? successColour : playerColours[attempt.deathPlayer] || 'gray',
            borderWidth: 20,
        };
    });

    // chart rendering
    const ctx = document.getElementById('progressBar').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // dynamic vertical growth
            indexAxis: 'y', // horizontal
            scales: {
                x: {
                    type: 'linear',
                    min: 1,
                    max: levelMap[levelMap.length - 1]?.x || 10, // extend to last x value as fixed
                    title: {
                        display: true,
                        text: 'Game Progress (World-Level)'
                    },
                    ticks: {
                        stepSize: 1,
                        callback: (value) => {
                            // prevent max value from displaying
                            const maxValue = levelMap[levelMap.length - 1]?.x || 10;
                            return value === maxValue ? '' : value;
                        }
                    }
                },
                y: {
                    type: 'category',
                    title: { display: true, text: 'Attempts' },
                    ticks: { font: { size: 12 } },
                    grid: { display: false },
                    barPercentage: 0.5,
                    categoryPercentage: 0.5,
                    offset: true,
                },

            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const attempt = context.raw;

                            if (attempt.success) {
                                return [
                                    `Attempt: ${attempt.attempt}`
                                ]
                            } else {
                                return [
                                    `Attempt: ${attempt.attempt}`,
                                    `Player: ${attempt.deathPlayer}`,
                                    `Character: ${attempt.deathCharacter}`,
                                    `Level: ${attempt.deathLevelName}`,
                                    `World-Level: ${attempt.deathWorldLevel}`,
                                ];
                            }
                        },
                        // remove excess detail from tooltip
                        title: () => null,
                        body: (items) => items.map(() => null),
                    },
                    displayColors: false,
                }
            }
        },
        plugins: [
            {
                // the dots / points at the end of each progress bar
                id: 'dotsPlugin',
                afterDatasetsDraw: (chart) => {
                    const ctx = chart.ctx;

                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const attempt = dataset.data[index];

                            // this needs to be directly lifted from the bar rather than the raw data because javascript
                            const { x, y } = bar.getProps(['x', 'y']);
                            const isSuccess = attempt.success;

                            // Draw the dot
                            ctx.beginPath();
                            ctx.arc(
                                x, y, // dot centre
                                15, // dot size
                                0, Math.PI * 2
                            );
                            ctx.fillStyle = isSuccess
                                ? successColour
                                : characterColours[attempt.deathCharacter] || 'gray';
                            ctx.fill();
                            ctx.lineWidth = 5;
                            ctx.strokeStyle = isSuccess
                                ? successColour
                                : playerColours[attempt.deathPlayer] || 'gray';
                            ctx.stroke();
                        });
                    });
                },
            }
        ]
    })

    // custom formatting to ensure bars are nicely sized and dynamically displayed
    const barHeight = 40;
    const totalBars = gameModels.length;
    const basePadding = 100;
    const dynamicHeight = totalBars * barHeight + basePadding;

    const canvas = document.getElementById('progressBar');
    canvas.style.height = `${dynamicHeight}px`;
    canvas.style.width = "100%"; // as we modify the height, reset the width


    chart.update();
}