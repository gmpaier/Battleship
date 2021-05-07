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

  async function getShips() {
    const responseData = await fetch('/api/games/ships', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'  },
    });
    const response = await responseData.json();
    let ships = response.ships
    return initializeMyShips(mySquares, ships)
  }

  function initializeMyShips(squares, ships) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++){
        ships.forEach((ship) => {
          let position = ship.position;
          console.log(position);
          console.log(typeof position); //its a string 0.0
          position.forEach((coord) => {
            if (coord[0] === i && coord[1] === j){
              squares[i][j].classList.add(ship.name);
            }
          });         
        });
      };
    }
  }

  function updateOpBoard(squares, shots) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++){
        if (shots){
          shots.forEach((shot) => {
            if(shot.row === i && shot.col === j){
              if (shot.hit === true){
                squares[i][j].textContent = "X";
              }
              else {
                squares[i][j].textContent = 'O';
              }
              let square = $(squares[i][j])
              square.css("pointer-events", "none");
            }
          })  
        }
      };
    }
  }
  
  function updateMyBoard (squares, shots) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++){
        if (shots){
          shots.forEach((shot) => {
            if(shot.row === i && shot.col === j){
              if (shot.hit === true){
                squares[i][j].textContent = "X";
              }
              else {
                squares[i][j].textContent = 'O';
              }
            }
          })  
        }
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
    let {game, player_id, myShots, opShots, myName, opName, lastShot} = await getStatus();
    updateMyBoard(mySquares, opShots);
    updateOpBoard(opSquares, myShots);
    if (lastShot){
      statusText(lastShot);
    }
    if (game.winner_id){
      for (i = 0; i < width; i++){
        for (j=0; j< width; j++){
          let square = $(opSquares[i][j]);
          square.css("pointer-events", "none");
        }
      }  
      if(game.winner_id === player_id){
        $(".game-header").text(myName + " Won!");
      }
      else {
        $(".game-header").text(opName = " Won!");
      }
      return;
    }
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
      standBy();
      }
  }
  
  function statusText(lastShot) {
    if (lastShot.hit === true){
      $(".status-text").text(`Hit at [${lastShot.row},${lastShot.col}]`);
    }
    else {
      $(".status-text").text(`Miss at [${lastShot.row},${lastShot.col}]`);
    }
  }

  function standBy () {
    setTimeout(function () {
      playGame();
    }, 3500)
  }



  async function postMove() {
    let coordData = $(this).attr("value")
    let coord = JSON.parse(coordData);
    const response = await fetch('/api/games/shot', {
      method: 'POST',
      body: JSON.stringify({shot: coord}),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok){
      playGame();
    }
    else {
      alert(response.statusText);
    }
  }


  createMyBoard(myGrid, mySquares);
  createOpBoard(opGrid, opSquares);
  getShips();
  playGame();


  $(document).on("click", ".op-square", postMove);
});

