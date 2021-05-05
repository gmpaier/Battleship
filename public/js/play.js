document.addEventListener('DOMContentLoaded', () => {
  const myGrid = document.querySelector('.grid-user');
  const opGrid = document.querySelector('.grid-op');

  const mySquares = [];
  const opSquares = [];
  const width = 10;

  function createBoard(grid, squares) {
    for (let i = 0; i < width; i++) {
        const row = [];
        for (let j = 0; j < width; j++){
            const square = document.createElement('div');
            square.setAttribute("value", `[${i},${j}]`);
            grid.appendChild(square);
            row.push(square);
        }
        squares.push(row);
    }
  }
});