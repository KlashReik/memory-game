import MatchGrid from "./matchGrid.js";

const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

const matchGrid = new MatchGrid({
  width: "1200px",
  height: "500px",
  numColumns: 4,
  numRows: 2,
  timeLimit: 300,
  theme: {
    mainColor: "#2196f3",
    secondaryColor: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
  },
});

startButton.addEventListener("click", () => {
  matchGrid.startGame();
  startButton.style.display = "none";
  resetButton.style.display = "block";
});

resetButton.addEventListener("click", () => {
  matchGrid.startGame();
});
