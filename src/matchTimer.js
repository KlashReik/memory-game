export default class MatchTimer {

    #timeLimit;
    #remainingTime;
    #timerInterval;
    #isGameRunning;
    #gameOver;

    constructor(args) {
        this.#timeLimit = args.timeLimit;
        this.#remainingTime = 0;
        this.#timerInterval = null;
        this.#isGameRunning = false; 
        this.#gameOver = args.gameOverCallback;
    }

    startTimer() {

        this.#remainingTime = this.#timeLimit;
        this.#updateTimer();
        this.#startCountdown();
        this.#isGameRunning = true;
        const container = document.getElementById("game-container");
        if (container) {
          container.addEventListener("mouseenter", () => {
            if (this.#isGameRunning) {
              this.#startCountdown();
            }
          });
    
          container.addEventListener("mouseleave", () => {
            clearInterval(this.#timerInterval);
          });
        }
      }
    
    #startCountdown() {
        if (this.#timerInterval) {
            clearInterval(this.#timerInterval);
        }
        this.#timerInterval = setInterval(() => {
            this.#remainingTime--;
            this.#updateTimer();

            if (this.#remainingTime <= 0) {
            clearInterval(this.#timerInterval);
            this.#gameOver("You ran out of time!");
            }
        }, 1000);
    }
    
    #updateTimer() {
        const timerElement = document.getElementById("game-timer");
        if (timerElement) {
            timerElement.innerText = `Time remaining: ${this.#remainingTime} seconds`;
        }
    }

    clearTimer() {
        this.#remainingTime = 0;
        clearInterval(this.#timerInterval);
        const timerElement = document.getElementById("game-timer");
        if (timerElement) {
            timerElement.innerText = `The game is finished!`;
        }
    }
}