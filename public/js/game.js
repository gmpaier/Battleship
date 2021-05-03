document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelector('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const battleship = document.querySelector('.battleship-container');
    const cruiser = document.querySelector('.cruise-container');
    const carrier = document.querySelector('.carrier-container');
    const start = document.querySelector('.start');
    const reset = document.querySelector('.reset');

    const userSquares = [];
    const computerSquares = [];
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
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard(userGrid, userSquares);
    createBoard(computerGrid, computerSquares);

    const shipsArray = [
        {
            name: "destroyer",
            directions: [
                [0, 1],
                [0, width]
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

        },
        {
            name: "cruise",
            directions: [
                [0, 1, 2, 3, 4, 5],
                [0, width, width * 2, width * 3, width * 4, width * 5]
            ]

        }
    ]

    
}

)