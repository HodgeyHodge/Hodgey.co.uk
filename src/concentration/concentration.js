
const ImagePath = "./img/"

const Cards = {
    0: "cloud",
    1: "flower",
    2: "heart",
    3: "house",
    4: "moon",
    5: "shoe",
    6: "star",
    7: "triangle"
}

let Game = {
    shuffle: function () {
        //Fisher Yates Shuffle, four of each from 0 to 9
        let array = Array.from({length: 32}, (_, x) => Math.floor(x/4));
        let i = 32;
        while (--i > 0) {
           let temp = Math.floor(Math.random() * (i + 1));
           [array[temp], array[i]] = [array[i], array[temp]];
        }
        this.grid = array;
    },
    
    cardClick: function (card) {
        if (!this.hot) { console.log("no clicky!"); return; }
        if (!document.querySelector(`.game-card[data-id="${card}"]`).classList.contains("face-down")) { return; }
        let first = (this.firstPick === undefined);
        if (!first) {this.hot = false;}
        console.log(`Ya clicked ${card}: ${Cards[this.grid[card]]}`);

        if (first) {
            this.firstPick = card;
            this.upturnCard(card, () => {});
        } else {
            this.upturnCard(card, () => {
                if (this.grid[this.firstPick] === this.grid[card]) {
                    console.log(`they match! ${this.firstPick} ${card}`);
                    this.collectPicks(this.firstPick, card, () => { this.hot = true; });
                } else {
                    console.log(`they don't match! ${this.firstPick} ${card}`);
                    this.downturnPicks(this.firstPick, card, () => { this.hot = true; });
                }
                this.firstPick = undefined;
            });
        }
    },

    upturnCard: function (card, callback) {
        var element = document.querySelector(`.game-card[data-id="${card}"]`);
        element.classList.remove("face-down");
        element.style.transform = "rotateY(90deg)";
        setTimeout(function() {
            element.style.backgroundImage = `url('./img/${Cards[Game.grid[card]]}.png')`;
            element.style.transform = "rotateY(0deg)";
            setTimeout(function() {
                callback();
            }, 400);
        }, 400);
    },

    downturnPicks: function (c1, c2, callback) {
        [
            document.querySelector(`.game-card[data-id="${c1}"]`),
            document.querySelector(`.game-card[data-id="${c2}"]`)
        ].forEach((element) => {
            element.classList.add("face-down");
            element.style.backgroundImage = `url('./img/reverse.png')`;
            element.style.transform = "rotateY(90deg)";
            setTimeout(function() {
                element.style.transform = "rotateY(0deg)";
                setTimeout(function() {
                    callback();
                }, 400);
            }, 400);
        })
    },

    collectPicks: function (c1, c2, callback) {
        [
            document.querySelector(`.game-card[data-id="${c1}"]`),
            document.querySelector(`.game-card[data-id="${c2}"]`)
        ].forEach((element) => {
            //here zip them off the screen?
            setTimeout(function() {
                callback();
            }, 300);
        })
    },
    
    reset: function () {
        this.shuffle();
        this.firstPick = undefined;
        this.hot = true;
        console.log("Reset!");
    }
}

// UI controls binding functions

function cardClick (card) {
    Game.cardClick(card);
}

// initial setup on load

window.onload = function () {
    //insert html for cards
    for (let card = 0; card < 32; card++) {
        let div = document.createElement("div");
        div.classList = "game-card face-down";
        div.dataset.id = card;
        div.onclick = function () {
            cardClick(card);
        };
        document.getElementById('game-board').appendChild(div);
    }

    //switch board flow on resize
    function sizeScreen () {
        let board = document.getElementById('game-board');
        if (board.offsetWidth > board.offsetHeight) {
            board.className = 'landscape';
        } else {
            board.className = 'portrait';
        }
    }
    sizeScreen();
    window.addEventListener('resize', () => sizeScreen());

    Game.reset();
}

