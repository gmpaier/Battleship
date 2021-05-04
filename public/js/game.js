document.addEventListener('DOMContentLoaded', () => {
    const myGrid = document.querySelector('.grid-user');
    const opGrid = document.querySelector('.grid-op');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelector('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const cruiser = document.querySelector('.cruise-container');
    const submarine = document.querySelector('.submarine-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');
    const start = document.querySelector('.start');
    const reset = document.querySelector('.reset');

    const mySquares = [];
    const opSquares = [];
    const width = 10;
      
    var timeleft = 120;
    var x = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = 0;
            complete(true);
        } else {
            document.getElementById("countdown").innerHTML = timeleft;
        }
        timeleft -= 1;
    }, 1000);
    function createBoard(grid, squares) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++){
                const square = document.createElement('div');
                square.setAttribute("value", `[${i},${j}]`);
                grid.appendChild(square);
                squares.push(square);
            }
        }
    }

    createBoard(myGrid, mySquares);
    createBoard(opGrid, opSquares);

    const shipsArray = [
        {
            name: "destroyer",
            directions: [
                [0, 1],
                [0, width]
            ]

        },
        {
            name: "cruise",
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]

        },
        {
            name: "submarine",
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]

        },
        {
            name: "battleship",
            directions: [
                [0, 1, 2, 3],
                [0, width, width * 2, width * 3]
            ]

        },
        {
            name: "carrier",
            directions: [
                [0, 1, 2, 3, 4],
                [0, width, width * 2, width * 3, width * 4]
            ]

        }
    ]

    function generate(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length);
        let current = ship.directions[randomDirection];
        if (randomDirection === 0) direction = 1;
        if (randomDirection === 1) direction = 10;
        let randomStart = Math.abs(Math.floor(Math.random() * opSquares.length - (ship.directions[0].length * direction)));
        const isSpotFree = current.some(index => opSquares[randomStart + index].classList.contains('reserved'));
        const isRightEdge = current.some(index => opSquares[randomStart + index] % width === width - 1);
        const isLeftEdge = current.some(index => opSquares[randomStart + index] % width === 0);
        console.log('isSpotFree',isSpotFree);
        if (!isSpotFree && !isRightEdge && !isLeftEdge) {
            current.forEach(
                index => opSquares[randomStart + index].classList.add('reserved', ship.name)
            );
        }
        else {
            generate(ship);
        }
    }
    generate(shipsArray[0]);
    generate(shipsArray[1]);
    generate(shipsArray[2]);
    generate(shipsArray[3]);
    generate(shipsArray[4]);
})

// Timer that counts down from 5
function countdown() {
    var timeLeft = 5;
  
    // Use the `setInterval()` method to call a function to be executed every 1000 milliseconds
    var timeInterval = setInterval(function () {
      // As long as the `timeLeft` is greater than 1
      if (timeLeft > 1) {
        // Set the `textContent` of `timerEl` to show the remaining seconds
        timerEl.textContent = timeLeft + ' seconds remaining';
        // Decrement `timeLeft` by 1
        timeLeft--;
      } else if (timeLeft === 1) {
        // When `timeLeft` is equal to 1, rename to 'second' instead of 'seconds'
        timerEl.textContent = timeLeft + ' second remaining';
        timeLeft--;
      } else {
        // Once `timeLeft` gets to 0, set `timerEl` to an empty string
        timerEl.textContent = '';
        // Use `clearInterval()` to stop the timer
        clearInterval(timeInterval);
        // Call the `displayMessage()` function
        displayMessage();
      }
    }, 1000);
  }