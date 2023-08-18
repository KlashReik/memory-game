export default class MatchGrid {
  constructor(args) {
    this.width = args.width;
    this.height = args.height;
    this.numColumns = args.numColumns;
    this.numRows = args.numRows;
    this.timeLimit = args.timeLimit;
    this.theme = args.theme;
    this.matchedPairs = 0;
    this.totalPairs = (this.numColumns * this.numRows) / 2;
    this.pairs = this.generatePairs();
    this.shuffledPairs = this.shuffleArray(this.pairs.slice());
    this.lastClickedCard = null;
    this.isGameRunning = false;
  }

  startGame() {
    this.clearTimer();
    this.matchedPairs = 0;
    this.isGameRunning = true;
    this.grid = this.createGrid();

    this.startTimer();
    anime({
      targets: ".card-container",
      scale: [
        { value: 0.1, easing: "easeInOutQuad", duration: 500 },
        { value: 1, easing: "easeOutSine", duration: 1200 },
      ],
      delay: anime.stagger(200, { grid: [16, 4], from: "center" }),
    });
  }

  startTimer() {
    this.remainingTime = this.timeLimit;
    this.updateTimer();
    this.startCountdown();

    const container = document.getElementById("game-container");
    if (container) {
      container.addEventListener("mouseenter", () => {
        if (this.isGameRunning) {
          this.startCountdown();
        }
        console.log("fires");
      });

      container.addEventListener("mouseleave", () => {
        clearInterval(this.timerInterval);
      });
    }
  }

  startCountdown() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      this.updateTimer();

      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.gameOver("You ran out of time!");
      }
    }, 1000);
  }

  updateTimer() {
    const timerElement = document.getElementById("game-timer");
    if (timerElement) {
      timerElement.innerText = `Time remaining: ${this.remainingTime} seconds`;
    }
  }

  clearTimer() {
    this.remainingTime = 0;
    clearInterval(this.timerInterval);
    const timerElement = document.getElementById("game-timer");
    if (timerElement) {
      timerElement.innerText = `The game is finished!`;
    }
  }

  generatePairs() {
    try {
      const pairs = new Array(this.totalPairs)
        .fill(0)
        .flatMap((_, i) => [i + 1, i + 1]);
      return pairs;
    } catch (e) {
      alert("Create grid with paired amount of cards!");
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  createCard(pairValue) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("div");
    front.classList.add("front");
    front.textContent = "Open me";
    front.style.backgroundColor = this.theme.mainColor;
    front.style.color = this.theme.secondaryColor;

    const back = document.createElement("div");
    back.classList.add("back");
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

      if (this.matchedPairs === this.totalPairs) {
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

    gridContainer.style.width = this.width;
    gridContainer.style.height = this.height;
    gridContainer.style.gridTemplateColumns = `repeat(${this.numColumns}, 1fr)`;
    gridContainer.style.fontSize = this.theme.fontSize;
    gridContainer.style.fontWeight = this.theme.fontWeight;

    this.shuffledPairs.forEach((pairValue) => {
      const card = this.createCard(pairValue);
      gridContainer.appendChild(card);
    });
  }

  gameOver(message) {
    this.clearTimer();
    this.isGameRunning = false;

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
