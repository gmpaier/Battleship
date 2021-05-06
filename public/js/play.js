document.addEventListener('DOMContentLoaded', () => {
  const myGrid = document.querySelector('.grid-user');
  const opGrid = document.querySelector('.grid-op');

  const mySquares = [];
  const opSquares = [];
  const width = 10;

  function createMyBoard(grid, squares) {
    for (let i = 0; i < width; i++) {
        const row = [];
        for (let j = 0; j < width; j++){
            const square = document.createElement('div');
            square.setAttribute("value", `[${i},${j}]`);
            let jSquare = $(square);
            jSquare.addClass('my-square');
            grid.appendChild(square);
            row.push(square);
        }
        squares.push(row);
    }
  }

  function createOpBoard(grid, squares) {
    for (let i = 0; i < width; i++) {
        const row = [];
        for (let j = 0; j < width; j++){
            const square = document.createElement('div');
            square.setAttribute("value", `[${i},${j}]`);
            let jSquare = $(square);
            jSquare.addClass('op-square');
            grid.appendChild(square);
            row.push(square);
        }
        squares.push(row);
    }
  }

  function initializeMyBoard(grid, shots, ships) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++){
        ships.forEach((ship) => {
          ship.position.forEach((coord) => {
            if (coord[0] === i && coord[1] === j){
              grid[i][j].classList.add(ship.name);
            }
          });         
        });
        shots.forEach((shot) => {
          if(shot.row === i && shot.col === j){
            if (shot.hit === true){
              grid[i][j].textContent = "X";
            }
            else {
              grid[i][j].textContent = 'O';
            }
          }
        })  
      };
    }
  }

  function updateOpBoard(grid, shots, ships) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++){
        ships.forEach((ship) => {
          ship.position.forEach((coord) => {
            if (coord[0] === i && coord[1] === j){
              if (grid[i][j].classList.contains(ship.name)){}
              else{
                grid[i][j].classList.add(ship.name);
              }
            }
          });         
        });
        shots.forEach((shot) => {
          if(shot.row === i && shot.col === j){
            if (shot.hit === true){
              grid[i][j].textContent = "X";
            }
            else {
              grid[i][j].textContent = 'O';
            }
            let square = $(grid[i][j])
            square.css("pointer-events", "none");
          }
        })  
      };
    }
  }
  
  function updateMyBoard (grid, shots) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++){
        ships.forEach((ship) => {
          ship.position.forEach((coord) => {
            if (coord[0] === i && coord[1] === j){
              grid[i][j].classList.add(ship.name);
            }
          });         
        });
        shots.forEach((shot) => {
          if(shot.row === i && shot.col === j){
            if (shot.hit === true){
              grid[i][j].textContent = "X";
            }
            else {
              grid[i][j].textContent = 'O';
            }
          }
        })  
      };
    }
  }


  async function getStatus () {
    const responseData = await fetch('/api/games/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'  },
    });
    const response = await responseData.json();
    return response;
  }

  async function playGame () {
    if (game.turn === player_id){
      $(".game-header").text(myName + "'s Turn")
      for (i = 0; i < width; i++){
        for (j=0; j< width; j++){
          shots.forEach((shot) => {
            if(shot.row === i && shot.col === j){}
            else {
              let square = $(opSquares[i][j]);
              square.css("pointer-events", "auto");
            }
          })  
        }
      }
    }
    else {
      $(".game-header").text(opName + "'s Turn")
      for (i = 0; i < width; i++){
        for (j=0; j< width; j++){
              let square = $(opSquares[i][j]);
              square.css("pointer-events", "none");
        }
      }  
      () => {
        let interval = setInterval(async function () {
          const responseData = await fetch('/api/games/status', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'  },
          });
          const response = await responseData.json();
          updateMyBoard(response.myBoard, response.opShots)
          let hitOrMiss;
          if (response.lastShot.hit === true){
            hitOrMiss = "Hit"
          }
          else {
            hitOrMiss = "Miss"
          }
          $('.status-text').text(hitOrMiss + "at [" + response.lastShot.row + "," + response.lastShot.col + "]");
          if (response.game.turn === response.player_id) {
            clearInterval(interval);
          }
        }, 4000)
      }
    }
  }

  async function postMove() {
    let coordData = $(this).attr("value")
    let coord = JSON.parse(coordData);
    const responseData = await fetch('/api/games/shot', {
      method: 'POST',
      body: JSON.stringify({game_id: game.id, board_id: opBoard.id, shot: coord}),
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await responseData.json();
  }


  createMyBoard(myGrid, mySquares);
  createOpBoard(opGrid, opSquares);
  let {game, player_id, myBoard, opBoard, myShips, opShips, myShots, opShots, myName, opName, lastShot} = getStatus();
  initializeMyBoard(myBoard, opShots, myShips);
  updateOpBoard(opBoard, myShots, opShips);
  playGame(opSquares);


  $(document).on("click", ".op-square", postMove);
});