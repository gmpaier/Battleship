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


document
  .querySelector('.play-game')
  .addEventListener('click', startGame);

document
  .querySelector('.join-game')
  .addEventListener('click', joinGame);