const startGame = async (event) => {
  event.preventDefault();

  const response = await fetch('/api/games/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/game/setup');
  } else {
    alert(response.statusText);
  } 
};

const joinGame = (event) => {
  event.preventDefault();
  document.location.replace('/join');
};

const activeGame = (event) => {
  event.preventDefault();
  document.location.replace('/active');
}

document
  .querySelector('.play-game')
  .addEventListener('click', startGame);

document
  .querySelector('.join-game')
  .addEventListener('click', joinGame);

document
  .querySelector('.active-game')
  .addEventListener('click', activeGame);