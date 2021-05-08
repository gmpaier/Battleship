async function joinGame() {
  let idData = $(this).attr("value")
  console.log(idData);
  let game_id = JSON.parse(idData);

  const responseData = await fetch('/api/games/rejoin', {
    method: 'POST',
    body: JSON.stringify({ game_id: game_id }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (responseData.ok) {
    let response = await responseData.json();
    let game = response.game;
    let start = game.start;
    if (start === true) {
      document.location.replace('/game/play');
    }
    else {
      document.location.replace('/game/setup');
    }
  } else {
    alert(response.message);
  }

}

$(document).on("click", ".join-game", joinGame);