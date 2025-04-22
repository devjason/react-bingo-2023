// GameBoard.jsx

import React, { useState, useEffect } from 'react';
import wordsArray from './words'; // Ensure this path is correct
import './GameBoard.css';

const gridSize = 4;

// Fisher-Yates Shuffle algorithm
const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

// Updated generateGrid function
const generateGrid = () => {
  const shuffledWords = shuffleArray(wordsArray);
  let wordIndex = 0;
  return Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize)
      .fill(null)
      .map(() => {
        const word = shuffledWords[wordIndex % shuffledWords.length];
        wordIndex++;
        return { word: word, selected: false };
      }));
};

const localStorageKey = "reactBingoGame";

function GameBoard() {
  const savedState = JSON.parse(localStorage.getItem(localStorageKey));
  const [grid, setGrid] = useState(savedState?.grid || generateGrid());
  const [winner, setWinner] = useState(savedState?.winner || false);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify({ grid, winner }));
  }, [grid, winner]);

  const checkForWinner = (newGrid) => {
    // Check rows and columns
    for (let i = 0; i < gridSize; i++) {
      if (newGrid[i].every(v => v.selected) || newGrid.every(row => row[i].selected)) {
        return true;
      }
    }

    // Check diagonals
    if (
      newGrid.every((row, idx) => row[idx].selected) ||
      newGrid.every((row, idx) => row[gridSize - 1 - idx].selected)
    ) {
      return true;
    }

    return false;
  };

  const handleClick = (rowIndex, colIndex) => {
    if (winner) return;

    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          return { ...cell, selected: !cell.selected };
        }
        return cell;
      })
    );

    setGrid(newGrid);

    if (checkForWinner(newGrid)) {
      setWinner(true);
    }
  };

  const resetGame = () => {
    const newGrid = generateGrid();
    setGrid(newGrid);
    setWinner(false);
    localStorage.setItem(localStorageKey, JSON.stringify({ grid: newGrid, winner: false }));
  };

  return (
    <div className="gameBoard">
      <h1>{winner ? 'Game Won!' : 'Family Bingo!'}</h1>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`gridCell ${cell.selected ? 'selected' : 'notSelected'}`}
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {cell.word}
            </div>
          ))
        ))}
      </div>
      <button className="resetButton" onClick={resetGame}>Reset Game</button>
    </div>
  );
}

export default GameBoard;
