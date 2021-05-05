async function joinGame() {
  let idData = $(this).attr("value")
  console.log(idData);
  let game_id = JSON.parse(idData);

  const response = await fetch('/api/games/join', {
    method: 'POST',
    body: JSON.stringify({ game_id: game_id }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    alert("Game joined successfully");
    document.location.replace('/game/setup');
  } else {
    alert(response.message);
  }

}

$(document).on("click", ".join-game", joinGame);