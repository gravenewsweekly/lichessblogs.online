const board = document.getElementById("chessboard");
const initialPosition = [
    "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜",
    "♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙",
    "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"
];

let selectedPiece = null;
let selectedSquare = null;

// Create Board
for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add((Math.floor(i / 8) + i) % 2 === 0 ? "light" : "dark");
    square.textContent = initialPosition[i];
    square.dataset.index = i;
    square.draggable = true;
    square.addEventListener("dragstart", dragStart);
    square.addEventListener("dragover", dragOver);
    square.addEventListener("drop", dropPiece);
    board.appendChild(square);
}

// Drag & Drop Logic
function dragStart(event) {
    selectedPiece = event.target.textContent;
    selectedSquare = event.target;
    event.dataTransfer.setData("text", selectedPiece);
}

function dragOver(event) {
    event.preventDefault();
}

function dropPiece(event) {
    event.preventDefault();
    const targetSquare = event.target;

    if (!targetSquare.classList.contains("square")) return;
    
    // Prevent capturing own piece
    if ((selectedPiece.match(/[♜♞♝♛♚♟]/) && targetSquare.textContent.match(/[♜♞♝♛♚♟]/)) ||
        (selectedPiece.match(/[♙♖♘♗♕♔]/) && targetSquare.textContent.match(/[♙♖♘♗♕♔]/))) {
        return;
    }

    targetSquare.textContent = selectedPiece;
    selectedSquare.textContent = "";
    
    checkGameOver();
}

// Check for Checkmate or Draw
function checkGameOver() {
    let whiteKing = false;
    let blackKing = false;
    
    document.querySelectorAll(".square").forEach(square => {
        if (square.textContent === "♔") whiteKing = true;
        if (square.textContent === "♚") blackKing = true;
    });

    if (!whiteKing) {
        alert("Black wins! Checkmate.");
        resetBoard();
    } else if (!blackKing) {
        alert("White wins! Checkmate.");
        resetBoard();
    }
}

// Reset Board
function resetBoard() {
    document.querySelectorAll(".square").forEach((square, i) => {
        square.textContent = initialPosition[i];
    });
}
