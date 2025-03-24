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
    square.dataset.index = i;

    if (initialPosition[i] !== "") {
        const piece = document.createElement("div");
        piece.textContent = initialPosition[i];
        piece.classList.add("piece");
        piece.draggable = true;
        piece.addEventListener("dragstart", dragStart);
        square.appendChild(piece);
    }

    square.addEventListener("dragover", dragOver);
    square.addEventListener("drop", dropPiece);
    board.appendChild(square);
}

// Drag & Drop Logic
function dragStart(event) {
    selectedPiece = event.target;
    selectedSquare = selectedPiece.parentElement;
    event.dataTransfer.setData("text", selectedPiece.textContent);
}

function dragOver(event) {
    event.preventDefault();
}

function dropPiece(event) {
    event.preventDefault();
    const targetSquare = event.target.closest(".square");

    if (!targetSquare || targetSquare === selectedSquare) return;

    // Prevent capturing own piece
    const targetPiece = targetSquare.querySelector(".piece");
    if (targetPiece) {
        if ((selectedPiece.textContent.match(/[♜♞♝♛♚♟]/) && targetPiece.textContent.match(/[♜♞♝♛♚♟]/)) ||
            (selectedPiece.textContent.match(/[♙♖♘♗♕♔]/) && targetPiece.textContent.match(/[♙♖♘♗♕♔]/))) {
            return;
        }
        targetSquare.removeChild(targetPiece);
    }

    targetSquare.appendChild(selectedPiece);

    checkGameOver();
}

// Check for Checkmate or Draw
function checkGameOver() {
    let whiteKing = false;
    let blackKing = false;
    
    document.querySelectorAll(".piece").forEach(piece => {
        if (piece.textContent === "♔") whiteKing = true;
        if (piece.textContent === "♚") blackKing = true;
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
        square.innerHTML = "";
        if (initialPosition[i] !== "") {
            const piece = document.createElement("div");
            piece.textContent = initialPosition[i];
            piece.classList.add("piece");
            piece.draggable = true;
            piece.addEventListener("dragstart", dragStart);
            square.appendChild(piece);
        }
    });
}
