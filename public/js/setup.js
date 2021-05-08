document.addEventListener('DOMContentLoaded', () => {
    const myGrid = document.querySelector('.grid-user');
    const opGrid = document.querySelector('.grid-op');

    const mySquares = [];
    const opSquares = [];
    const width = 10;

    const shipsArray = [
        {
            name: "destroyer",
            coord: [0, 1]

        },
        {
            name: "cruise",
            coord: [0, 1, 2]

        },
        {
            name: "submarine",
            coord: [0, 1, 2]

        },
        {
            name: "battleship",
            coord: [0, 1, 2, 3]
        },
        {
            name: "carrier",
            coord: [0, 1, 2, 3, 4]
        }
    ]
  
  const placedShips = []

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

    async function hasShips() {
      const responseData = await fetch('/api/games/set', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'  },
      });
      if (responseData.ok) {
        const response = await responseData.json();
        console.log(response);
        if (response.set === true){
          $("#start").prop("disabled",true);
          $("#reset").prop("disabled",true);
          getPlay();
        }
        else {
          shipsArray.forEach((ship) => {
            generate(ship);
          });
        }
      }
    }

    function generate(ship) {
        let myShip = {
          name: ship.name,
          position: [],
          hits: []
        }
        let randomDirection = Math.floor(Math.random() * 2);
        let randomStart = Math.floor(Math.random() * (width - ship.coord.length));
        let otherRandom = Math.floor(Math.random() * width)
        let isSpotTaken;
        if (randomDirection === 0) {
          //horizontal
          isSpotTaken = ship.coord.some(index => mySquares[otherRandom][randomStart + index].classList.contains('reserved'));
        }
        if (randomDirection === 1) {
          //vertical
          isSpotTaken = ship.coord.some(index => mySquares[randomStart + index][otherRandom].classList.contains('reserved'));
        }
        if (!isSpotTaken) {
          if (randomDirection === 0) {
            ship.coord.forEach((index) => {
              mySquares[otherRandom][randomStart + index].classList.add('reserved', ship.name);
              console.log(mySquares[otherRandom][randomStart + index]);
              let coord = JSON.parse(mySquares[otherRandom][randomStart + index].getAttribute('value'));
              let str_coord = JSON.stringify(coord);
              myShip.position.push(str_coord);
              myShip.hits.push(0);
            });
          }
          else {
            ship.coord.forEach((index) => {
              mySquares[randomStart + index][otherRandom].classList.add('reserved', ship.name);
              console.log(mySquares[randomStart + index][otherRandom]);
              let coord = JSON.parse(mySquares[randomStart + index][otherRandom].getAttribute('value'));
              let str_coord = JSON.stringify(coord);
              myShip.position.push(str_coord);
              myShip.hits.push(0);
            });
          }
          myShip.position = JSON.stringify(myShip.position);
          placedShips.push(myShip);
        }
        else {
            generate(ship);
        }
    }

    function resetShips() {
      mySquares.forEach((row) => {
        row.forEach((square) => {
          square.className = '';
        })  
      });
      placedShips.splice(0, placedShips.length);
      shipsArray.forEach((ship) => {
        generate(ship);
      });   
    }

    async function postShips () {
      if (placedShips.length > 0) {
        const response = await fetch('/api/games/ships', {
          method: 'POST',
          body: JSON.stringify({ships: placedShips}),
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          $("#start").prop("disabled",true);
          $("#reset").prop("disabled",true);
          getPlay();
        } else {
          alert(response.statusText);
        }
      }
    }

    async function getPlay () {
      const responseData = await fetch('/api/games/play', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'  },
      });
      if (responseData.ok) {
        const response = await responseData.json();
        if (response.message === "yes") {
          startGame();
        }
        else {
          standBy();
        }
      }
      else {
        alert(responseData.statusText);
      }
    }

    async function startGame() {
      console.log("in async");
      const response = await fetch('/api/games/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'  },
      });
      if (response.ok){
        document.location.replace('/game/play');
      }
      else {
        alert(responseData.statusText);
      }
    }
    

    function standBy () {
      setTimeout(function () {
        getPlay();
      }, 3500)
    }

//runtime
    createBoard(myGrid, mySquares);
    createBoard(opGrid, opSquares);

    hasShips();

    $(document).on("click", "#reset", resetShips);
    $(document).on("click", "#start", postShips)
    

});

