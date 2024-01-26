const fs = require('fs');

function parseWorkoutData(filePath, mainMove, dayPrefix) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    let exercises = [];

    lines.forEach((line, index) => {
        if (line.trim() !== '') {
            const parts = line.split('×').map(part => part.trim());
            const reps = parseInt(parts[0]);
            const weightBracketParts = parts[1].split('[');
            const weight = parseInt(weightBracketParts[0]);
            const bracket = `[${weightBracketParts[1]}`;

            exercises.push({
                "id": `${mainMove.toLowerCase()}-${dayPrefix}-${index}`,
                "name": `${mainMove} ${bracket}`,
                "isReps": true,
                "isDuration": false,
                "repsDefault": reps,
                "durationDefault": 30,
                "isBodyweight": false,
                "weightDefault": weight,
                "isFree": true,
                "sets": 0,
                "successes": []
            });
        }
    });

    return exercises;
}

function generateWorkoutProgram(mainMove, day1FilePath, day2FilePath, day3FilePath) {
    const day1Exercises = parseWorkoutData(day1FilePath, mainMove, 'day1');
    const day2MiddleSet = parseWorkoutData(day2FilePath, mainMove, 'day2');
    const day3MiddleSet = parseWorkoutData(day3FilePath, mainMove, 'day3');

    const beginSet = {
        "name": `${mainMove} Begin (5/3/1 ${mainMove} 1)`,
        "repeats": 1,
        "exercises": [],
        "userAssignedName": `${mainMove} Begin`,
        "isBorrowable": false,
        "isBorrowed": true
    };
    const bbbSet = {
        "name": `${mainMove} BBB (5/3/1 ${mainMove} 1)`,
        "repeats": 5,
        "exercises": [],
        "userAssignedName": `${mainMove} BBB`,
        "isBorrowable": false,
        "isBorrowed": true
    };
    const middleSetDay1 = {
        "name": `${mainMove} Middle`,
        "repeats": 1,
        "exercises": day1Exercises.slice(3, 6),
        "userAssignedName": "",
        "isBorrowable": false,
        "isBorrowed": false
    };

    const workoutTemplate = {
        "workouts": [
            {
                "name": `5/3/1 ${mainMove} 1`,
                "sets": [
                    {
                        ...beginSet,
                        "exercises": day1Exercises.slice(0, 3),
                        "isBorrowable": true,
                        "isBorrowed": false
                    },
                    middleSetDay1,
                    {
                        ...bbbSet,
                        "exercises": day1Exercises.slice(6),
                        "isBorrowable": true,
                        "isBorrowed": false
                    }
                ],
                "archive": []
            },
            {
                "name": `5/3/1 ${mainMove} 2`,
                "sets": [
                    beginSet,
                    {
                        "name": "Day 2 Middle Set",
                        "repeats": 1,
                        "exercises": day2MiddleSet,
                        "userAssignedName": "Day 2 Middle Set",
                        "isBorrowable": false,
                        "isBorrowed": false
                    },
                    bbbSet
                ],
                "archive": []
            },
            {
                "name": `5/3/1 ${mainMove} 3`,
                "sets": [
                    beginSet,
                    {
                        "name": "Day 3 Middle Set",
                        "repeats": 1,
                        "exercises": day3MiddleSet,
                        "userAssignedName": "Day 3 Middle Set",
                        "isBorrowable": false,
                        "isBorrowed": false
                    },
                    bbbSet
                ],
                "archive": []
            },
            {
                "name": `5/3/1 ${mainMove} 4`,
                "sets": [beginSet],
                "archive": []
            }
        ]
    };

    return workoutTemplate;
}

// Example usage
const mainMove = "Press";
const day1FilePath = './day1.txt'; // File path for day 1 data
const day2FilePath = './day2.txt'; // File path for day 2 data
const day3FilePath = './day3.txt'; // File path for day 3 data

const workoutProgram = generateWorkoutProgram(mainMove, day1FilePath, day2FilePath, day3FilePath);
console.log(JSON.stringify(workoutProgram, null, 2));