// (function () {
console.log($);
// Buttons
const $submitPlayers = $("#player-config-submit");
const $resetBoard = $("#board-config-reset");
const $startGame = $("#lets-play");
const $newGame = $("#newGame");

//Inuts values
const $rows_input = $("#row-config");
const $cols_input = $("#col-config");
const $piecesConnect_input = $("#connect-config");
const $boardColor_input = $("#board-config-color");

const $playerColor1_input = $("#player1-color");
const $playerColor2_input = $("#player2-color");

const $playerName1_input = $("#player1-name");
const $playerName2_input = $("#player2-name");

const $currentPlayerName = $("#current-name");
const $playerStatus = $("#player-status");

console.log("$currentPlayerName", $currentPlayerName);

//Our Board div.
const $board = $("#board");
const $currentPlayerDisplay = $("#color-turn");

const $gameSection = $("#game-section");

//CSS Variables
const $cssVariables = $(":root");

//For keyboard nos more game.
let gameOn = false;

$newGame.hide();
$gameSection.hide();

//Creat and initialize with the default values.
let amountOfRows = parseInt($rows_input.prop("defaultValue"));
let amountOfColumns = parseInt($cols_input.prop("defaultValue"));
let numConnectedWinn = parseInt($piecesConnect_input.prop("defaultValue"));
let boardColor = $boardColor_input.prop("defaultValue");

let playerColor_1 = $playerColor1_input.prop("defaultValue");
let playerColor_2 = $playerColor2_input.prop("defaultValue");

let playerName_1 = $playerName1_input.prop("defaultValue");
let playerName_2 = $playerName2_input.prop("defaultValue");

hexAToHSLA(playerColor_1);
hexAToHSLA(playerColor_2);

console.log(
    "typeof amountOfRows",
    typeof amountOfRows,
    "\ntypeof amountOfColumns",
    typeof amountOfColumns,
    "\ntypeof numConnectedWinn",
    typeof numConnectedWinn
);

console.log(
    "Default value\n",
    "amountOfRows",
    amountOfRows,
    "amountOfColumns",
    amountOfColumns,
    "numConnectedWinn",
    numConnectedWinn,
    "boardColor",
    boardColor
);

/* Creat an array with the "limits" in the columns. */
let columnsLimits = [];
let amountSlotUsed = 0;
let winnerSlotsArray = [];
let amountSlot = amountOfRows * amountOfColumns;

function boardLimits() {
    columnsLimits = [];
    let limit = 0;
    for (let i = 0; i <= amountOfColumns; i++) {
        columnsLimits.push(limit);
        limit += amountOfRows;
    }
    amountSlot = amountOfRows * amountOfColumns;
    console.log("columnsLimits", columnsLimits);
}

console.log("amountSlot", amountSlot);
let currentPlayer = "player1";

function resetGame() {
    currentPlayer = "player1";
    amountSlotUsed = 0;
    gameOn = true;
}

let currentPlayerName = "";
function switchPlayer() {
    if (currentPlayer === "player1") {
        currentPlayer = "player2";
        $currentPlayerDisplay.removeClass("player1");
        $currentPlayerDisplay.addClass("player2");
        currentPlayerName = playerName_2;
    } else {
        currentPlayer = "player1";
        $currentPlayerDisplay.removeClass("player2");
        $currentPlayerDisplay.addClass("player1");
        currentPlayerName = playerName_1;
    }
    // currentPlayer = currentPlayer=== "player1" ? "player2" : "player"; hexAToHSLA(H)
    $currentPlayerName.html(currentPlayerName);
}

function firstTurn() {
    $currentPlayerDisplay.addClass("player1");
    $currentPlayerName.html(playerName_1);
    gameOn = true;
}

function newPlayerConfig() {
    firstTurn();
    $gameSection.hidde();
}

/*-------------------------------------------------------------------------- 
                    Event: Reset Board configuration button
    -----------------------------------------------------------------------------*/
$resetBoard.on("click", function () {
    //Grab default value and set them in the input
    amountOfRows = parseInt($rows_input.prop("defaultValue"));
    amountOfColumns = parseInt($cols_input.prop("defaultValue"));
    numConnectedWinn = parseInt($piecesConnect_input.prop("defaultValue"));
    boardColor = $boardColor_input.prop("defaultValue");

    $rows_input.val(amountOfRows);
    $cols_input.val(amountOfColumns);
    $piecesConnect_input.val(numConnectedWinn);
    $boardColor_input.val(boardColor);
});

/*-------------------------------------------------------------------------- 
                    Event: Submit Players configuration button
    -----------------------------------------------------------------------------*/
$submitPlayers.on("click", function () {
    //Grab Players Info.
    boardColor = $boardColor_input.val();

    playerColor_1 = $playerColor1_input.val();
    playerColor_2 = $playerColor2_input.val();

    playerColor_1 = hexAToHSLA(playerColor_1);
    playerColor_2 = hexAToHSLA(playerColor_2);

    $cssVariables.css("--player1-color", playerColor_1);
    $cssVariables.css("--player2-color", playerColor_2);

    playerName_1 = $playerName1_input.val();
    playerName_2 = $playerName2_input.val();

    newPlayerConfig();
});
/*-------------------------------------------------------------------------- 
                   Event:  Start Game button
    -----------------------------------------------------------------------------*/
$startGame.on("click", function () {
    console.log("Click start Game");

    amountOfRows = parseInt($rows_input.val());
    amountOfColumns = parseInt($cols_input.val());
    numConnectedWinn = parseInt($piecesConnect_input.val());

    // I will have the color in hexa
    boardColor = $boardColor_input.val();
    $cssVariables.css("--board-color", boardColor);

    //Clear the board.
    $board.empty();

    //Creat the board
    for (let i = 0; i < amountOfColumns; i++) {
        const $col = $("<div></div>").addClass("columns");

        for (let j = 0; j < amountOfRows; j++) {
            const $slot = $("<div> </div>").addClass("slot");
            const $whole = $("<div></div>").addClass("whole");

            $slot.append($whole);
            $col.append($slot);
        }
        $board.append($col);
    }

    //Calculate the limmits of the board.
    console.log(
        "----------------------------------\n        NEW GAME\n------------------------------------------"
    );
    boardLimits();
    firstTurn();
    $gameSection.show();
});

$newGame.on("click", function () {
    const $slots = $(".slot");
    for (let i = 0; i < $slots.length; i++) {
        $currentSlot = $slots.eq(i);
        $whole = $currentSlot.children();
        $whole.removeClass("player1 player2 winner");
    }
    //Add click handler for the Columns
    $("body").on("click", ".columns", clickedColumns());

    //Hide the winner display
    $newGame.hide();
    firstTurn();
    $playerStatus.html("is your turn");

    //Need to rest the player turn.
    resetGame();
});

/*-------------------------------------------------------------------------- 
                    Event: COLUMNS  
    -----------------------------------------------------------------------------*/
$("body").on("click", ".columns", clickedColumns());

function clickedColumns() {
    return function (e) {
        console.log("event clicked", e);
        const $col = $(e.currentTarget);
        dropPiece($col);
    };
}

/* -----------------------------------------
                Event listener: KEYBOARD
    --------------------------------------- */
// $(document).on("keydown", clickedKey());
$("body").on("keydown", clickedKey());

let currentColumn_index = 0;
let newTurn = true;

function clickedKey() {
    return function (e) {
        if (gameOn) {
            const $columns = $(".columns");
            switch (e.key) {
                case "ArrowUp":
                    console.log("ArrowUp");

                    break;
                case "ArrowDown":
                    //Drop pice
                    console.log("ArrowDown");
                    dropPiece($columns.eq(currentColumn_index));
                    break;
                case "ArrowLeft":
                    //previous Columns
                    console.log("ArrowLeft");
                    if (newTurn) {
                        currentColumn_index = $columns.length - 1;
                        newTurn = false;
                    } else {
                        currentColumn_index--;
                    }
                    if (currentColumn_index < 0) {
                        currentColumn_index = 0;
                    }

                    $columns
                        .eq(currentColumn_index + 1)
                        .removeClass("currentColumns");

                    $columns.eq(currentColumn_index).addClass("currentColumns");
                    break;
                case "ArrowRight":
                    //next Columns
                    console.log("ArrowRight");
                    if (newTurn) {
                        currentColumn_index = 0;
                        newTurn = false;
                    } else {
                        currentColumn_index++;
                    }

                    if (currentColumn_index >= $columns.length) {
                        currentColumn_index = $columns.length - 1;
                    }

                    $columns
                        .eq(currentColumn_index - 1)
                        .removeClass("currentColumns");

                    $columns.eq(currentColumn_index).addClass("currentColumns");
                    break;
                default:
                    break;
            }
        }
    };
}

function dropPiece($col) {
    const $slots = $col.children();
    let $currentSlot;

    for (let i = $slots.length - 1; i >= 0; i--) {
        $currentSlot = $slots.eq(i);
        const $whole = $currentSlot.children();

        /* 1. Is the slot free?
                if YES -> color it.
                if NO -> Move on.
            
            */
        if (!$whole.hasClass("player1") && !$whole.hasClass("player2")) {
            $whole.addClass(currentPlayer);
            amountSlotUsed++;
            // See if there is a winner.
            if (
                verticalVictory() ||
                hotizontalVictory(i) ||
                diagonallVictory()
            ) {
                console.log(
                    `PLAYER ${currentPlayer}\n slots ${winnerSlotsArray}`
                );
                gameOver();
                return;
            }

            console.log("------------------------------------------------");
            switchPlayer();
            break;
        }
    }
    if (!(amountSlotUsed < amountSlot)) {
        //Its a draw no more empty slot
        gameOver("It's a draw no more empty slot");
    }
}

function gameOver(draw) {
    let answerText = "";
    let winnerColor;
    let index = 0;

    const $columns = $(".columns");
    const $slots = $(".slot");
    let $currentSlot;
    let $whole;
    let audio;

    // REVIEW: This the events are different.
    console.log("GAME OVER!");
    // $columns.off("click");
    $("body").off("click", ".columns");
    // $("body").off("keydown", ".columns");

    gameOn = false;

    // $("#board").off("keydown", clickedKey()); //NOT WORKING

    if (typeof draw !== "undefined") {
        answerText = draw;
    } else {
        answerText = "You are the Winner";
        if (currentPlayer === "player1") {
            // answerText = "Player 1 Winns";
            winnerColor = $cssVariables.css("--player1-color");
            console.log("Player 1: WinnerColor:", winnerColor);
        } else {
            // answerText = "Player 2 Winns";
            winnerColor = $cssVariables.css("--player2-color");
            console.log("Player 2: WinnerColor:", winnerColor);
        }
        console.log("WinnerColor SET:", winnerColor);
        $cssVariables.css("--winner-color", winnerColor);

        winnerColor = $cssVariables.css(" --winner-color");
        console.log("WinnerColor GET:", winnerColor);

        //Go through the winners Slots.
        for (let i = 0; i < winnerSlotsArray.length; i++) {
            index = winnerSlotsArray[i];
            $currentSlot = $slots.eq(index);
            $whole = $currentSlot.children();
            $whole.addClass("winner");
        }
        //Go through the columns and remove the state.
        for (let i = 0; i < $columns.length; i++) {
            $columns.removeClass("currentColumns");
        }

        //Play Sound of winner
        audio = new Audio("sounds/WinGame.wav");
        audio.play();
    }
    // We generate our html
    $playerStatus.html(answerText);

    // inject our Html into the div with the results class
    $newGame.show();
}

function hotizontalVictory(currentRow) {
    const $slots = $(".slot");
    let $currentSlot;
    let $whole;
    let counter = 0;

    for (let i = currentRow; i < $slots.length; i += amountOfRows) {
        $currentSlot = $slots.eq(i);
        $whole = $currentSlot.children();

        if ($whole.hasClass(currentPlayer)) {
            winnerSlotsArray.push(i);
            counter++;
        } else {
            counter = 0;
            winnerSlotsArray = [];
        }

        if (counter === numConnectedWinn) {
            console.log("hotizontalVictory:\tWINNER!!");
            return true;
        }
    }
    console.log("hotizontalVictory:\tNO Winner");
    return false;
}

function verticalVictory() {
    /* 
        1. Set up a counter veriable
        2. Move through the slots and:
            - increment the counter by 1 if the slot has the class or the current plazer.
            - reset the counter if it doesnt.
        3. If the counter is 4 we have a winner.
        */
    const $slots = $(".slot");

    let $currentSlot;
    let $whole;
    let currentColumn = 0;
    winnerSlotsArray = [];

    let counter = 0;
    for (let i = 0; i < $slots.length; i++) {
        $currentSlot = $slots.eq(i);
        $whole = $currentSlot.children();

        if (i >= columnsLimits[currentColumn + 1]) {
            // Keeping track in which column I am in.
            //Next column, reset values
            currentColumn++;
            winnerSlotsArray = [];
            counter = 0;
        } else if ($whole.hasClass(currentPlayer)) {
            winnerSlotsArray.push(i);
            counter++;
        } else {
            counter = 0;
            winnerSlotsArray = [];
        }

        if (counter === numConnectedWinn) {
            console.log("verticalVictory:\tWINNER!!");
            return true;
        }
    }

    console.log("verticalVictory:\tNO Winner");
    /* We return an boolean, true is there is a winner and false otherwise */
    return false;
}

function nextPositionDiagonal(
    nextStep,
    setpFoward,
    $slots,
    nextColumn,
    counter
) {
    nextStep += setpFoward;
    $currentSlot = $slots.eq(nextStep);
    $whole = $currentSlot.children();

    // console.log(
    //     `nextStep: ${nextStep}\n setpFoward: ${setpFoward}, nextColumn: ${nextColumn}, counter: ${counter}`
    // );

    // console.log(
    //     " nextStep < columnsLimits[nextColumn] ",
    //     nextStep < columnsLimits[nextColumn],
    //     "\n  nextStep >= columnsLimits[nextColumn + 1]",
    //     nextStep >= columnsLimits[nextColumn + 1]
    // );

    if (
        nextStep < columnsLimits[nextColumn] ||
        nextStep >= columnsLimits[nextColumn + 1] ||
        (!$whole.hasClass(currentPlayer) && counter !== numConnectedWinn)
    ) {
        // I am NOT in  the next column or the slot has not my current player color.
        return false;
    }
    counter++;
    nextColumn++;
    winnerSlotsArray.push(nextStep);

    // console.log(
    //     `nextStep: ${nextStep}\n setpFoward: ${setpFoward}, nextColumn: ${nextColumn}, counter: ${counter}`
    // );

    if (counter === numConnectedWinn) {
        return true;
    }
    return nextPositionDiagonal(
        nextStep,
        setpFoward,
        $slots,
        nextColumn,
        counter
    );
}

function diagonallVictory() {
    /* 
        +7 -> be careful that they are un the next colomn the next value.
        +5 -> be careful that they are in the nest column.
        */
    const $slots = $(".slot");

    let $whole;
    let counter = 0;
    let nextColumn = 0;
    let currentColumn = 0;

    let found = false;
    // let nextDiagPosition = 0;

    for (let i = 0; i < $slots.length; i++) {
        $currentSlot = $slots.eq(i);
        $whole = $currentSlot.children();
        // First time founding a slot of the courrent Player.
        if ($whole.hasClass(currentPlayer)) {
            // Reset values for the diagonal Seach
            winnerSlotsArray = [];
            // nextDiagPosition = i;

            // Save the column where the slot was found, this is for limits reasons.
            nextColumn = currentColumn + 1;
            counter++;
            winnerSlotsArray.push(i);

            // console.log(
            //     `CurrentPlayer: ${currentPlayer}\nCurrent Column: ${currentColumn}\n  Next Column:${nextColumn}`
            // );
            // console.log(
            //     `Current Pos: ${i}\n setpFoward: ${
            //         amountOfRows - 1
            //     }, counter: ${counter}`
            // );

            // Search in one diagonal. 5+
            /*    /
                     /
                    /     From left to right */
            found = nextPositionDiagonal(
                i,
                amountOfRows - 1,
                $slots,
                nextColumn,
                counter
            );
            console.log("Return value ( / )", found);
            if (found) {
                console.log("winnerSlots ( / )", winnerSlotsArray);
                return true;
            }


            /*  \
                     \
                      \    From right to left */
            winnerSlotsArray = [];
            winnerSlotsArray.push(i);

            // console.log(
            //     `Current Pos: ${i}\n setpFoward: ${
            //         amountOfRows - 1
            //     }, nextColumn: ${nextColumn}, counter: ${counter}`
            // );
            found = nextPositionDiagonal(
                i,
                amountOfColumns,
                $slots,
                nextColumn,
                counter
            );
            console.log(`Return value od nextPosition ( \ )`, found);
            if (found) {
                console.log("winnerSlots (  )", winnerSlotsArray);
                return true;
            }
        }
        counter = 0;

        if (i >= columnsLimits[currentColumn + 1]) {
            // Keeping track in which column I am in
            currentColumn++;
        }
    }
}

/* Becuase the way we display the winner que need to convert the input color to hsl values 
    
    thank u: https://css-tricks.com/converting-color-spaces-in-javascript/ */

function hexAToHSLA(H) {
    let r = 0,
        g = 0,
        b = 0;

    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    // return "hsla(" + h + "," + s + "%," + l + "%," + ")";
    // We return the only value that we need.
    return h;
}
// })();
