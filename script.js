// script.js
const words = ["HAPPY", "BIRTH", "SWEET", "HEART", "ADORE", "YOURS", "SMILE", "BLISS", "SHINE"]
const hints = [
    "H_PP_", // For HAPPY
    "_IR__", // For BIRTH
    "S_EE_", // For SWEET
    "HEA__", // For HEART
    "_DO__", // For ADORE
    "Y__R_", // For YOURS
    "S_IL_", // For SMILE
    "BLI__", // For BLISS
    "__INE", // For MINES
];

function playMusic() {
    var audio = document.getElementById('backgroundMusic');
    if (audio.muted) {
        audio.muted = false;
        audio.play(); // Attempt to play the audio if it was muted
    }
}

document.addEventListener('click', playMusic)

let currentRow = 0;
function createGrid() {
    const grid = document.getElementById('wordleGrid');

    words.forEach((word, rowIndex) => {
        const row = document.createElement('div');
        row.className = `grid grid-cols-${word.length} gap-2 mb-2`;
        row.id = `row-${rowIndex}`;

        hints[rowIndex].split('').forEach((hintLetter, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'cell rounded flex justify-center items-center';
            const random_chance = hintLetter == "_"

            if (random_chance) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'w-full h-full text-center bg-transparent border-none outline-none';
                input.style.textTransform = 'uppercase';
                input.dataset.correct = word[colIndex]; // Store the correct letter in a data attribute
                input.oninput = () => handleInput(input, rowIndex);
                cell.appendChild(input);
            } else { // If the hint is a letter, display it
                cell.textContent = hintLetter;
                cell.className += ' filled'; // Apply a different style if needed
            }

            row.appendChild(cell);
        });

        grid.appendChild(row);
    });
}

function handleInput(input, rowIndex) {
    const value = input.value.toUpperCase();
    const correctLetter = input.dataset.correct;

    if (value === correctLetter) {
        input.disabled = true; // Correct letter, disable input
        input.classList.add('correct');
    } else {
        input.value = ''; // Clear input
    }

    // Move focus to the next input field
    const nextInput = document.querySelector(`#row-${rowIndex} input:not(:disabled):not(.correct)`);
    if (nextInput) {
        nextInput.focus();
    }

    checkCompletion(rowIndex);
    playMusic()
}

function checkCompletion(rowIndex) {
    const row = document.getElementById(`row-${rowIndex}`);
    const inputs = row.querySelectorAll('input');
    const isCompleted = Array.from(inputs).every(input => input.disabled || input.classList.contains('correct'));

    if (isCompleted) {
        row.classList.add('completed-row'); // Mark the row as completed
        const rows = Array.from(document.querySelectorAll('.grid')).map(row => row.classList.contains('completed-row') ? 1 : 0)
        const total = rows.reduce((a, b) => a + b);
        const allRowsCompleted = total == words.length;
        if (allRowsCompleted) {
            celebrate();
        }
    }
}


function celebrate() {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = 'Happy Birthday Sweetheart! 🎂🎂🎂';
    snackbar.className = 'show';
    setTimeout(() => { snackbar.className = snackbar.className.replace('show', ''); }, 3000);

    // Canvas confetti effect
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

createGrid();
