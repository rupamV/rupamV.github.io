const container = document.querySelector('#sudoku');

const sudoku = [];

function createGrid() {
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        container.appendChild(row);
        const rowVal = [];
        for (let j = 0; j < 9; j++) {
            const box = document.createElement('div');
            box.classList.add('box');
            row.appendChild(box);
            rowVal.push('.');
        }
        sudoku.push(rowVal);
    }
}

function initializePuzzle() {
    createGrid();
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
        const randNo = Math.floor(Math.random() * numbers.length);
        sudoku[0][i] = numbers[randNo];
        numbers.splice(randNo, 1);
    }

    sudokuSolver();
    const boxesAll = document.querySelectorAll('.box');

    boxesAll.forEach((box, index) => {
        const i = Math.floor(index / 9);
        const j = index % 9;
        if (sudoku[i][j] != '.') {
            box.innerHTML = sudoku[i][j];
        }
    })

}

function sudokuSolver() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudoku[i][j] == '.') {
                for (let k = 1; k <= 9; k++) {
                    if (isValid(i, j, k)) {
                        sudoku[i][j] = k;
                        if (sudokuSolver()) {
                            return true;
                        } else {
                            sudoku[i][j] = '.';
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(row, col, num, arrName = sudoku) {
    for (let i = 0; i < 9; i++) {
        if (arrName[row][i] == num && i != col) {
            return false;
        }
        if (arrName[i][col] == num && i != row) {
            return false;
        }
    }


    const rowStart = row - row % 3;
    const colStart = col - col % 3;

    for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
            if ((i != row || j != col) && sudoku[i][j] == num) {
                return false;
            }
        }
    }

    return true;
}

initializePuzzle();

const buttons = document.querySelectorAll('.difficulty button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        button.parentNode.style.transform = `scale(0)`;
        document.querySelector('#difficulty-chosen').innerHTML = button.innerHTML;
        document.querySelector('#difficulty-chosen').classList.add(button.innerHTML);
        setTimeout(() => {
            button.parentNode.style.display = "none"
            document.querySelector('.timer').style.display = "block"
            stopWatch(0, 0, 0);
            document.querySelector('#sudoku').classList.add('active');

        }, 500)

        changeDifficulty(button);
    })
})

function changeDifficulty(button) {
    if (button.innerHTML == "Easy") {
        removeNumbers(40);
    } else if (button.innerHTML == "Medium") {
        removeNumbers(50);
    } else {
        removeNumbers(60);
    }

    document.querySelectorAll('.box.new').forEach(box => {
        const span = document.createElement('span');
        box.appendChild(span);
    })

    const pencils = document.querySelectorAll('.box span');


    pencils.forEach(pencil => {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-pencil");
        pencil.appendChild(icon);
        pencil.addEventListener('click', () => {

            pencil.parentNode.classList.toggle('pencil');
            checkCompletion();
            if (pencil.parentNode.textContent.length > 1) {
                const parent = pencil.parentNode;
                pencil.parentNode.textContent = pencil.parentNode.textContent[0];
                parent.appendChild(pencil);
            }
        })
    })

}

function removeNumbers(count) {
    const boxesAll = document.querySelectorAll('.box');
    for (let i = 0; i < 81; i++) {
        if (boxesAll[i].innerText != "") {
            const value = Math.random() > 0.5 ? 0 : 1;
            if (value) {
                boxesAll[i].innerText = "";
                boxesAll[i].classList.add("new");
                count--;
            }
            if (count == 0) {
                break;
            }
        }

    }

    if (count > 0) {
        removeNumbers(count);
    }



}

const boxesAll = document.querySelectorAll('.box');

boxesAll.forEach(box => {
    box.addEventListener('click', () => {
        if (box.innerHTML == "" || box.classList.contains("new")) {
            boxesAll.forEach(box => {
                box.classList.remove('selected');

            })
            box.classList.add('selected');
        }
    }
    )
})

function enterValue() {
    window.addEventListener('keydown', (e) => {
        const selected = document.querySelector('.selected');
        const pencil = document.querySelector('.selected.pencil');
        const span = selected.lastElementChild;
        if (!pencil) {
            if (e.key >= 1 && e.key <= 9) {
                selected.innerHTML = e.key;
                selected.appendChild(span);
                checkCompletion();

            } else if (e.key == "Backspace") {
                selected.innerHTML = "";
                document.querySelector('#sudoku').classList.remove('error');
                selected.appendChild(span);
            }
        } else {
            if (e.key >= 1 && e.key <= 9) {
                selected.innerHTML = selected.textContent.includes(e.key) ? selected.textContent.replace(e.key, "") : selected.textContent + e.key;
                pencil.appendChild(span);
                checkCompletion();

            } else if (e.key == "Backspace") {
                selected.innerHTML = "";
                pencil.appendChild(span);
            }
        }

    })
}

enterValue();
function checkCompletion() {
    setTimeout(() => {
        for (let i = 0; i < 81; i++) {
            if (boxesAll[i].textContent == "" || boxesAll[i].classList.contains("pencil")) {
                return;
            }
        }

        const newArr = [];
        boxesAll.forEach((box, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            if (!newArr[row]) {
                newArr[row] = [];
            }
            newArr[row][col] = box.textContent;
        })

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!isValid(i, j, boxesAll[i * 9 + j].textContent, newArr)) {
                    document.querySelector('#sudoku').classList.add("error");
                    return;
                }
            }

        }
        console.log("you won")
        showResult();
    }, 300);

}

function stopWatch(h, m, s) {
    if (s == 60) {
        s = 0;
        m += 1;
    }

    if (m == 60) {
        m = 0;
        h += 1;
    }
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    document.querySelector('#time').innerHTML = h + ":" + m + ":" + s;
    setTimeout(() => {
        stopWatch(Number(h), Number(m), Number(s) + 1);
    }, 1000)
}

function showResult() {
    const time = document.querySelector('.timer #time').innerHTML;
    const displayTime = document.querySelector('#time-taken');

    document.querySelector('.timer').style.display = "none";
    document.querySelector('#sudoku').classList.remove('active');
    document.querySelector('.result').classList.add('active');
    displayTime.innerHTML = time;
}















