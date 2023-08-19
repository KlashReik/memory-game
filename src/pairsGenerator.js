export default class PairsGenerator {

    #totalPairs;

    constructor(args) {
        this.#totalPairs = this.#calculateTotalPairs(args.numColumns, args.numRows);
    }

    generateShuffledPairs() {
        return this.#shuffleArray(this.generatePairs());
    }

    generatePairs() {
        try {
          const pairs = new Array(this.#totalPairs)
            .fill(0)
            .flatMap((_, i) => [i + 1, i + 1]);
          return pairs;
        } catch (e) {
          alert("Create grid with paired amount of cards!");
        }
      }
    
    #shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
    }

    #calculateTotalPairs(numColumns, numRows) {
        return (numColumns * numRows) / 2;
    }

    getTotalPairs() {
        return this.#totalPairs;
    }
}