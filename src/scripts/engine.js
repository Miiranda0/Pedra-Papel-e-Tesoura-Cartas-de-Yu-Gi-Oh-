const state = {
  score: {
    playerscore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("nex-duel"),
  },
};

const playersSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100");
  cardImage.setAttribute("src", `${pathImages}card-back.png`);
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === playersSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(parseInt(cardImage.getAttribute("data-id")));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();


  let computerCardId = await getRandomCardId();

  await ShowHiddenCardFieldsImages(true);
  
  await hiddenCardDetails();

  

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  const duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore(duelResults);
  await drawButton(duelResults);
}

async function removeAllCardsImages() {
  const computerCards = document.getElementById(playersSides.computer);
  const playerCards = document.getElementById(playersSides.player1);

  [computerCards, playerCards].forEach(container => {
    const images = container.querySelectorAll("img.card");
    images.forEach(img => img.remove());
  });
}

async function drawSelectCard(index) {
  const card = cardData[index];
  state.cardSprites.avatar.src = card.img;
  state.cardSprites.name.innerText = card.name;
  state.cardSprites.type.innerText = "Atributo: " + card.type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

function updateScore(result) {
  if (result === "win") {
    state.score.playerscore++;
  } else if (result === "lose") {
    state.score.computerScore++;
  }

  state.score.scoreBox.innerText = `Win: ${state.score.playerscore} | Lose: ${state.score.computerScore}`;
}

async function drawCardsInfield(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

}

async function ShowHiddenCardFieldsImages(value) {
  if(value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  }
  if(value=== false){
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
  }
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

function drawButton(result) {
  const button = state.actions.button;
  button.innerText = result === "win" ? "GANHOU" : result === "lose" ? "PERDEU" : "EMPATE";
  button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId) {
  const playerCard = cardData[playerCardId];
  let duelResults = "draw";

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win";
    await playAudio("win");
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "lose";
    await playAudio("lose");
  } else {
    await playAudio("draw");
  }

  return duelResults;
}


function resetDuel() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  state.actions.button.style.display = "none";
  drawCards(5, playersSides.player1);
  drawCards(5, playersSides.computer);
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}


function init() {
   ShowHiddenCardFieldsImages(false)

  drawCards(5, playersSides.player1);
  drawCards(5, playersSides.computer);

  
  document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    init();
  }, { once: true }); // só executa uma vez
});
  
  
  const bgm = document.getElementById("bgm");
  bgm.play();

  
}

init();
