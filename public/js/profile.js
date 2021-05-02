const playgame = async (event) => {
  event.preventDefault();

  
      document.location.replace('/game');
    
  
};
document
  .querySelector('.play-game')
  .addEventListener('click', playgame);