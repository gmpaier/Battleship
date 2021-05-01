const playgame = async (event) => {
  event.preventDefault();

  
      document.location.replace('/battleship');
    
  
};
document
  .querySelector('.play-game')
  .addEventListener('click', playgame);