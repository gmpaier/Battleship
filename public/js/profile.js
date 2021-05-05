const playgame = async (event) => {
  event.preventDefault();

  const response = await fetch('/api/games/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/game');
  } else {
    alert(response.statusText);
  } 
  
};
document
  .querySelector('.play-game')
  .addEventListener('click', playgame);