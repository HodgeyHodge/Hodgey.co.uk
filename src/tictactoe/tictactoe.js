
 const ImagePath = "./img/"
 const GameDataPath = "./"

const Glyphs = {
    1: "O",
    2: "X"
}

const Moods = {
    Asking: "asking",
    Waiting: "waiting",
    Thinking: "thinking",
    Won: "won",
    Drew: "drew",
    Lost: "lost",
    Observing: "observing"
}

const opponents = {
    0: {
        name: "Dani",
        description: "just plays randomly",
        pic: "Dani.png",
        move: function () {
            const allMoves = Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["w"])
                .concat(Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["d"]))
                .concat(Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["l"]));
            let move = allMoves[Math.floor(Math.random() * Object.keys(allMoves).length)];
            return interpretMove(move, positionId(Game.grid)[0]);
        },
        quotes: {
            "asking": "Would you like to go first?",
            "waiting": "Now it's your turn :)",
            "thinking": "Hmm...",
            "won": "Well done for trying!",
            "drew": "It's a draw!",
            "lost": "You won, well done!",
            "observing": "Okay, I'm here if you need me."
        }
    },
    1: {
        name: "Barney",
        description: "plays competitively",
        pic: "Barney.png",
        move: function () {
            w = Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["w"]);
            d = Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["d"]);
            l = Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["l"]);

            if (w.length > 0) {
                let move = w[Math.floor(Math.random() * w.length)];
                return interpretMove(move, positionId(Game.grid)[0]);
            }
            else if (d.length > 0) {
                let move = d[Math.floor(Math.random() * d.length)];
                return interpretMove(move, positionId(Game.grid)[0]);
            }
            else if (l.length > 0) {
                let move = l[Math.floor(Math.random() * l.length)];
                return interpretMove(move, positionId(Game.grid)[0]);
            }
        },
        quotes: {
            "asking": "Meow?",
            "waiting": "...",
            "thinking": "purr... purr...",
            "won": "Meow!",
            "drew": "Meow.",
            "lost": "Meow!",
            "observing": "..."
        }
    },
    2: {
        name: "Daddy",
        description: "does his best to let you win",
        pic: "Me.png",
        move: function () {
            w = Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["w"]);
            d = Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["d"]);
            l = Object.keys(Game.data[Game.ply()][positionId(Game.grid)[1]]["l"]);

            if (l.length > 0) {
                let move = l[Math.floor(Math.random() * l.length)];
                return interpretMove(move, positionId(Game.grid)[0]);
            }
            else if (d.length > 0) {
                let move = d[Math.floor(Math.random() * d.length)];
                return interpretMove(move, positionId(Game.grid)[0]);
            }
            else if (w.length > 0) {
                let move = w[Math.floor(Math.random() * w.length)];
                return interpretMove(move, positionId(Game.grid)[0]);
            }
        },
        quotes: {
            "asking": "Who should go first?",
            "waiting": "Now you go...",
            "thinking": "Hmm...",
            "won": "Nice try :)",
            "drew": "It's a draw!",
            "lost": "You defeated me?!",
            "observing": "Okay, I'll just watch."
        }
    }
}

let Game = {
    userIs: undefined, //1: human plays O, 2: human plays X, 3: human plays both
    opponent: 0,
    grid: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    state: 0, //0: nothing, 1: in progress, 2: O wins, 3: draw, 4: X wins
    mood: Moods.Asking,
    winLine: 0,
    computerThinking: undefined,

    opponents: opponents,
    
    reset: function () {
        this.grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.state = 0;
        this.mood = Moods.Asking;
        this.winLine = 0;

        if (this.computerThinking) {
            clearTimeout(this.computerThinking);
        }
        this.computerThinking = undefined;

        this.redraw();
    },

    redraw: function () {
        document.getElementById(`tictactoe-opponents-statement`).dataset.opponent = this.opponent;
        document.getElementById(`tictactoe-opponents-statement`).innerText = this.opponents[this.opponent].quotes[this.mood];

        if (this.winLine) {
            document.getElementById(`tictactoe-board`).style.background = `url(${ImagePath}/W${this.winLine}.png) no-repeat 0 0`;
            document.getElementById(`tictactoe-board`).style.backgroundSize = "100%";
        } else {
            document.getElementById(`tictactoe-board`).style.background = "";
        }

        document.getElementById(`tictactoe-side-panel`).style.background = `url(${ImagePath}/${this.opponents[this.opponent].pic}) no-repeat 0 0`;
        document.getElementById(`tictactoe-side-panel`).style.backgroundSize = "100%";
        for (let cell = 0; cell < 9; cell++) {
            if (this.grid[cell]) {
                document.querySelector(`.tictactoe-cell[data-id="${cell}"]`).style.background = `url(${ImagePath}/${Glyphs[this.grid[cell]]}.png) no-repeat 0 0`;
                document.querySelector(`.tictactoe-cell[data-id="${cell}"]`).style.backgroundSize = "100%";
            } else {
                document.querySelector(`.tictactoe-cell[data-id="${cell}"]`).style.background = "";
            }
        }
    },

    ply: function () {
        return 9 - this.grid.filter(e => e === 0).length;
    },

    whoseMove: function () {
        return 1 + this.ply()%2
    },

    checkWin: function (player) {
        if (this.grid[0] == player && this.grid[1] == player && this.grid[2] == player) return 1;
        if (this.grid[3] == player && this.grid[4] == player && this.grid[5] == player) return 2;
        if (this.grid[6] == player && this.grid[7] == player && this.grid[8] == player) return 3;
        if (this.grid[0] == player && this.grid[3] == player && this.grid[6] == player) return 4;
        if (this.grid[1] == player && this.grid[4] == player && this.grid[7] == player) return 5;
        if (this.grid[2] == player && this.grid[5] == player && this.grid[8] == player) return 6;
        if (this.grid[0] == player && this.grid[4] == player && this.grid[8] == player) return 7;
        if (this.grid[2] == player && this.grid[4] == player && this.grid[6] == player) return 8;
        return 0;
    },

    initialiseData: function () {
        fetch(`${GameDataPath}/tictactoedata.json`)
            .then((r) => r.json())
            .then((json) => {this.data = json});
    },

    startGame: function (mode) {
        this.reset();
        this.userIs = mode;
        this.state = 1;
        
        if (this.userIs + this.whoseMove() == 3) {
            this.computersTurn();
        } else if (this.userIs === 3) {
            this.mood = Moods.Observing;
            this.redraw();
        } else {
            this.mood = Moods.Waiting;
            this.redraw();
        }
    },

    cellClick: function (cell) {
        if (this.state === 0) {
            console.log("No game in progress. Starting one, and letting you go first...");
            this.startGame(1);
            this.makeMove(cell);
        } else if (this.state === 2 || this.state === 3 || this.state === 4) {
            console.log("The game is over. Resetting...");
            this.reset();
        } else if (this.userIs !== this.whoseMove() && this.userIs !== 3) {
            console.log("It's not your move!");
        } else if (this.grid[cell] !== 0) {
            console.log("That move is not allowed by the rules!");
        } else {
            this.makeMove(cell);
        }
    },

    cycleOpponent: function (direction) {
        this.opponent = (this.opponent + 3 + direction) % 3;
        this.reset();
    },

    computersTurn: function () {
        this.mood = Moods.Thinking;
        const chosenMove = this.opponents[this.opponent].move();
        this.redraw();
        this.computerThinking = setTimeout(() => {
            this.makeMove(chosenMove);
        }, 500);
    },

    makeMove: function (cell) {
        this.grid[cell] = this.whoseMove();
        
        if (this.checkWin(1) > 0) {
            this.state = 2;
            Game.winLine = this.checkWin(1);
            if (this.userIs === 3) {
                this.mood = Moods.Observing;
            } else if (this.userIs === 1) {
                this.mood = Moods.Lost;
            } else if (this.userIs === 2) {
                this.mood = Moods.Won;
            }
            this.redraw();
        } else if (this.checkWin(2) > 0) {
            this.state = 4;
            Game.winLine = this.checkWin(2);
            if (this.userIs === 3) {
                this.mood = Moods.Observing;
            } else if (this.userIs === 1) {
                this.mood = Moods.Won;
            } else if (this.userIs === 2) {
                this.mood = Moods.Lost;
            }
            this.redraw();
        } else if (this.ply() >= 9) {
            this.state = 3;
            if (this.userIs === 1 || this.userIs === 2) {
                this.mood = Moods.Drew;
            }
            this.redraw();
        } else if (this.userIs + this.whoseMove() == 3) {
            this.computersTurn();
        } else {
            if (this.userIs === 3) {
                this.mood = Moods.Observing;
            } else {
                this.mood = Moods.Waiting;
            }
            this.redraw();
        }
    }
}

// board position manipulation functions

function positionId (grid) {
    let transformations = {
        0: idify(grid),
        1: idify([grid[2], grid[5], grid[8], grid[1], grid[4], grid[7], grid[0], grid[3], grid[6]]), //L
        2: idify([grid[8], grid[7], grid[6], grid[5], grid[4], grid[3], grid[2], grid[1], grid[0]]), //LL
        3: idify([grid[6], grid[3], grid[0], grid[7], grid[4], grid[1], grid[8], grid[5], grid[2]]), //LLL
        4: idify([grid[0], grid[3], grid[6], grid[1], grid[4], grid[7], grid[2], grid[5], grid[8]]), //D
        5: idify([grid[6], grid[7], grid[8], grid[3], grid[4], grid[5], grid[0], grid[1], grid[2]]), //DL
        6: idify([grid[8], grid[5], grid[2], grid[7], grid[4], grid[1], grid[6], grid[3], grid[0]]), //DLL
        7: idify([grid[2], grid[1], grid[0], grid[5], grid[4], grid[3], grid[8], grid[7], grid[6]]) //DLLL
    };
    
    let best = 0;
    for (let i = 1; i < 8; i++) {
        if (transformations[i] < transformations[best]) {
            best = i;
        }
    }
    
    return [best, transformations[best]];
}

function interpretMove (position, transformation) {
    if (transformation == 0) { return position; }
    if (transformation == 1) { return [2, 5, 8, 1, 4, 7, 0, 3, 6][position]; }
    if (transformation == 2) { return [8, 7, 6, 5, 4, 3, 2, 1, 0][position]; }
    if (transformation == 3) { return [6, 3, 0, 7, 4, 1, 8, 5, 2][position]; }
    if (transformation == 4) { return [0, 3, 6, 1, 4, 7, 2, 5, 8][position]; }
    if (transformation == 5) { return [6, 7, 8, 3, 4, 5, 0, 1, 2][position]; }
    if (transformation == 6) { return [8, 5, 2, 7, 4, 1, 6, 3, 0][position]; }
    if (transformation == 7) { return [2, 1, 0, 5, 4, 3, 8, 7, 6][position]; }
}

function idify (grid) {
    return grid.reduce((t, c, i) => t + c*(3**i), 0);
}

// UI controls binding functions

function startGame (mode) {
    Game.startGame(mode);
}

function cellClick (cell) {
    Game.cellClick(cell);
}

function cycleOpponent (direction) {
    Game.cycleOpponent(direction);
}

// onload

window.onload = function () {
    for (let cell = 0; cell < 9; cell++) {
        document.querySelector(`.tictactoe-cell[data-id="${cell}"]`).onclick = function () {
            cellClick(cell);
        };
    }
    Game.initialiseData();
    Game.redraw();
}
