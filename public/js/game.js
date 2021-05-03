document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user');
    const opGrid = document.querySelector('.grid-op');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelector('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const battleship = document.querySelector('.battleship-container');
    const cruiser = document.querySelector('.cruise-container');
    const carrier = document.querySelector('.carrier-container');
    const start = document.querySelector('.start');
    const reset = document.querySelector('.reset');

    const mySquares = [];
    const opSquares = [];
    const width = 10;

    function createBoard(grid, squares) {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard(userGrid, mySquares);
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