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
    }

    // Validate move
    if (isValidMove(selectedPiece, selectedSquare, targetSquare)) {
        if (targetPiece) targetSquare.removeChild(targetPiece);
        targetSquare.appendChild(selectedPiece);
        checkGameOver();
    }
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

// Validate Move
function isValidMove(piece, fromSquare, toSquare) {
    const pieceType = piece.textContent;
    const fromIndex = parseInt(fromSquare.dataset.index);
    const toIndex = parseInt(toSquare.dataset.index);
    const rowFrom = Math.floor(fromIndex / 8);
    const colFrom = fromIndex % 8;
    const rowTo = Math.floor(toIndex / 8);
    const colTo = toIndex % 8;

    switch (pieceType) {
        case "♟": // Black Pawn
            return isValidPawnMove(rowFrom, colFrom, rowTo, colTo, toSquare, "black");
        case "♙": // White Pawn
            return isValidPawnMove(rowFrom, colFrom, rowTo, colTo, toSquare, "white");
        case "♜": // Rook
        case "♖":
            return isValidRookMove(rowFrom, colFrom, rowTo, colTo);
        case "♞": // Knight
        case "♘":
            return isValidKnightMove(rowFrom, colFrom, rowTo, colTo);
        case "♝": // Bishop
        case "♗":
            return isValidBishopMove(rowFrom, colFrom, rowTo, colTo);
        case "♛": // Queen
        case "♕":
            return isValidQueenMove(rowFrom, colFrom, rowTo, colTo);
        case "♚": // King
        case "♔":
            return isValidKingMove(rowFrom, colFrom, rowTo, colTo);
        default:
            return false;
    }
}

// Pawn Move Validation
function isValidPawnMove(rowFrom, colFrom, rowTo, colTo, toSquare, color) {
    if (color === "white") {
        return (rowTo === rowFrom - 1 && colTo === colFrom && !toSquare.querySelector(".piece")) ||
               (rowTo === rowFrom - 1 && Math.abs(colTo - colFrom) === 1 && toSquare.querySelector(".piece"));
    } else {
        return (rowTo === rowFrom + 1 && colTo === colFrom && !toSquare.querySelector(".piece")) ||
               (rowTo === rowFrom + 1 && Math.abs(colTo - colFrom) === 1 && toSquare.querySelector(".piece"));
    }
}

// Rook Move Validation
function isValidRookMove(rowFrom, colFrom, rowTo, colTo) {
    if (rowFrom !== rowTo && colFrom !== colTo) return false;
    return isPathClear(rowFrom, colFrom, rowTo, colTo);
}

// Knight Move Validation
function isValidKnightMove(rowFrom, colFrom, rowTo, colTo) {
    return (Math.abs(rowFrom - rowTo) === 2 && Math.abs(colFrom - colTo) === 1) ||
           (Math.abs(rowFrom - rowTo) === 1 && Math.abs(colFrom - colTo) === 2);
}

// Bishop Move Validation
function isValidBishopMove(rowFrom, colFrom, rowTo, colTo) {
    if (Math.abs(rowFrom - rowTo) !== Math.abs(colFrom - colTo)) return false;
    return isPathClear(rowFrom, colFrom, rowTo, colTo);
}

// Queen Move Validation
function isValidQueenMove(rowFrom, colFrom, rowTo, colTo) {
    return isValidRookMove(rowFrom, colFrom, rowTo, colTo) || isValidBishopMove(rowFrom, colFrom, rowTo, colTo);
}

// King Move Validation
function isValidKingMove(rowFrom, colFrom, rowTo, colTo) {
    return Math.abs(rowFrom - rowTo) <= 1 && Math.abs(colFrom - colTo) <= 1;
}

// Check if path is clear
function isPathClear(rowFrom, colFrom, rowTo, colTo) {
    const rowStep = Math.sign(rowTo - rowFrom);
    const colStep = Math.sign(colTo - colFrom);
    let currentRow = rowFrom + rowStep;
    let currentCol = colFrom + colStep;

    while (currentRow !== rowTo || currentCol !== colTo) {
        if (document.querySelector(`.square[data-index="${currentRow * 8 + currentCol}"]`).querySelector(".piece")) {
            return false;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
}
