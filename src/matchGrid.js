import MatchTimer from "./matchTimer.js";
import PairsGenerator from "./pairsGenerator.js";

export default class MatchGrid {

  constructor(args) {
    this.timer = new MatchTimer({ timeLimit: args.timeLimit, gameOverCallback: this.gameOver.bind(this) });
    this.pairsGenerator = new PairsGenerator({ numColumns: args.numColumns, numRows: args.numRows });

    this.shuffledPairs = this.pairsGenerator.generateShuffledPairs();
    this.matchedPairs = 0;

    this.width = args.width;
    this.height = args.height;
  
    this.numColumns = args.numColumns;
    this.numRows = args.numRows;
  
    this.theme = args.theme;

    this.lastClickedCard = null;
  }

  startGame() {
    this.timer.clearTimer();
    this.matchedPairs = 0;
   
    this.grid = this.createGrid();

    this.timer.startTimer();
    anime({
      targets: ".card-container",
      scale: [
        { value: 0.1, easing: "easeInOutQuad", duration: 500 },
        { value: 1, easing: "easeOutSine", duration: 1200 },
      ],
      delay: anime.stagger(200, { grid: [16, 4], from: "center" }),
    });
  }

  createCard(pairValue) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("div");
    front.classList.add("front");
    front.style.width = this.width;
    front.style.height = this.height;
    front.textContent = "Open me";
    front.style.backgroundColor = this.theme.mainColor;
    front.style.color = this.theme.secondaryColor;

    const back = document.createElement("div");
    back.classList.add("back");
    back.style.width = this.width;
    back.style.height = this.height;
    back.textContent = pairValue;
    back.style.backgroundColor = this.theme.secondaryColor;
    back.style.color = this.theme.mainColor;

    card.appendChild(front);
    card.appendChild(back);
    cardContainer.appendChild(card);

    this.createEventListener(card);

    return cardContainer;
  }

  createEventListener(card) {
    const handleClick = this.animateCard(
      card,
      this.handleCardOpening.bind(this)
    );
    card.addEventListener("click", handleClick);
  }

  animateCard(card, callback) {
    let playing = false;
    const handleClick = function () {
      if (playing) return;

      playing = true;

      anime({
        targets: this,
        scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
        rotateY: { value: "+=180", delay: 200 },
        easing: "easeInOutSine",
        duration: 400,
        complete: () => {
          playing = false;
          if (callback) callback(card);
          
        },
      });
    }.bind(card);

    return handleClick;
  }

  animateCardFlip(card) {
    const handleClick = this.animateCard(card);
    handleClick();
  }

  handleCardOpening(currentCard) {
    if (this.lastClickedCard === null) {
      this.lastClickedCard = currentCard;
      return;
    }

    const previousCardValue = this.lastClickedCard.querySelector(".back");
    const currentCardValue = currentCard.querySelector(".back");

    const isSameCard = previousCardValue === currentCardValue;
    const isSameValue =
      previousCardValue.textContent === currentCardValue.textContent;

    if (!isSameCard && !isSameValue) {
      this.animateCardFlip(this.lastClickedCard);
      this.animateCardFlip(currentCard);
    }

    if (isSameValue && !isSameCard) {
      this.markMatchedCards([previousCardValue, currentCardValue]);
      this.matchedPairs++;

      if (this.matchedPairs === this.pairsGenerator.getTotalPairs()) {
        this.gameOver("You won! All pairs matched!");
      }
    }

    this.lastClickedCard = null;
  }

  markMatchedCards(cards) {
    cards.forEach((card) => {
      card.classList.add("matched");
      card.style.backgroundColor = "#90ee90";
    });
  }

  createGrid() {
    const gridContainer = document.getElementById("grid-container");
    if (gridContainer) {
      gridContainer.innerHTML = "";
    }


    gridContainer.style.gridTemplateColumns = `repeat(${this.numColumns}, 1fr)`;
    gridContainer.style.fontSize = this.theme.fontSize;
    gridContainer.style.fontWeight = this.theme.fontWeight;

    this.shuffledPairs.forEach((pairValue) => {
      const card = this.createCard(pairValue);
      gridContainer.appendChild(card);
    });
  }

  gameOver(message) {
    this.timer.clearTimer();
    this.timer.isGameRunning = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        alert(message);
      });
    });

    anime({
      targets: ".card-container",
      scale: [{ value: 1 }, { value: 0.5 }, { value: 0 }],
      easing: "easeInOutSine",
      duration: 3000,
    });

    setTimeout(() => {
      const gridContainer = document.getElementById("grid-container");
      gridContainer.innerHTML = "";
    }, 3000);
  }
}