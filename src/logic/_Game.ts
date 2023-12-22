import { $, GameMode, Player } from "./_utils";
import Tank from "./_Tank";
import Toast from "./_Toast";

export default class Game {
  #state: any = { blue: {}, red: {} };
  #parent: Element;
  #gridSize: number = 4;
  #player = Player.red;
  #mode = GameMode.arrange;
  #aliveTanks: any = { red: 0, blue: 0 };
  #winner: Player | null = null;

  constructor(parent: Element, gridSize: number = 4) {
    this.#parent = parent;
    this.#gridSize = gridSize;
    this.generateGrid();
    this.renderGame();
  }

  /**
   * Generates the `state` object
   */
  private generateGrid(): void {
    let letters = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    [`blue`, `red`].forEach((color) => {
      for (let i = 0; i < this.#gridSize; i++)
        for (let j = 0; j < this.#gridSize; j++)
          this.#state[color][`${letters[i]}${j + 1}`] = {};
    });
  }

  /**
   * Renders the game and set the grids' event listeners
   */
  private renderGame(): void {
    this.#parent.innerHTML = ``;
    this.renderGrid(`blue`, this.#state.blue);
    this.renderGrid(`red`, this.#state.red);

    $(`.grid`).forEach((grid) =>
      grid.addEventListener(`click`, this.handleGridClick)
    );
  }

  /**
   * Handles the click event on the grids
   * @param e {*} Event Object passed to it
   */
  private handleGridClick = (e: any): void => {
    const isTargetImage = e.target.tagName === `IMG`;
    const currentTarget = isTargetImage ? e.target.parentElement : e.target;
    const address = currentTarget.dataset.address;
    const color = currentTarget.parentElement.id;

    console.log({
      alive: this.#aliveTanks,
      state: this.#state,
      winner: this.#winner,
      mode: this.#mode,
    });

    if (this.#mode === GameMode.play) {
      const enemyColor = color === `blue` ? `red` : `blue`;
      const enemyCell = this.#state[enemyColor][address];
      const isEnemyCellATank = enemyCell instanceof Tank;
      if (isEnemyCellATank) enemyCell.destroy();
      const alives: any = { blue: 0, red: 0 };
      [`blue`, `red`].forEach((color) => {
        for (const cellAddr in this.#state[color]) {
          const cell = this.#state[color][cellAddr];
          if (cell instanceof Tank && !cell.isDead) alives[color]++;
          this.#aliveTanks[color] = alives[color]
        }
      });
      console.log(`${color}:alive: ${this.#aliveTanks[color]}`);

      const probableWinner = this.whoWon();
      if (probableWinner) {
        this.#winner = probableWinner;
        this.showWinner();
      } else this.changePlayer();
    }
    if (this.#mode === GameMode.arrange) {
      this.addTank(address, new Tank(color));
    }
  };

  /**
   * Renders HTML structure for grid, and sets the styles...
   * @param id {string} `id` for the grid element
   * @param gridState {*} state object of a player
   */
  private renderGrid(id: string, gridState: any): void {
    let finalGrid = `<div class="grid" id="${id}">\n`;

    for (const cellAddr in gridState)
      finalGrid += `\t<div class="grid__cell" data-address="${cellAddr}"></div>\n`;

    finalGrid += `</div>`;
    this.#parent.innerHTML += finalGrid;

    $(`.grid`).forEach((grid: HTMLElement) => {
      grid.style.gridTemplateColumns = `repeat(${this.#gridSize}, 1fr)`;
      grid.style.gridTemplateRows = `repeat(${this.#gridSize}, 1fr)`;
    });
  }

  /**
   * Figures out that who won. If no one has won, returns `null`
   * @returns {?Player}
   */
  private whoWon(): Player | null {
    if (this.#aliveTanks.red === 0) return Player.blue;
    else if (this.#aliveTanks.blue === 0) return Player.red;
    else return null;
  }

  /**
   * Shows winner with a toast, also `freeze()` the game
   */
  private showWinner(): void {
    if (this.#winner === Player.blue) {
      new Toast(Player.blue, `آبی برنده شد!`).show();
    }
    if (this.#winner === Player.red) {
      new Toast(Player.red, `قرمز برنده شد!`).show();
    }
    this.freeze();
  }

  /**
   * Disables all buttons except the reload key
   * to prevent players from playing, and the
   * grid too.
   */
  public freeze() {
    $(`.btn:not(#btn-reload)`).forEach((btn) => (btn.disabled = true));
    $(`.grid`).forEach((grid) =>
      grid.removeEventListener(`click`, this.handleGridClick)
    );
  }

  /**
   * Adds a tank to the grid and to the `state`
   * @param cellAddress cell address in format of /[A-Z]+\d+/
   * @param tank a Tank class instance
   */
  public addTank(cellAddress: string, tank: Tank) {
    const alives: any = { blue: 0, red: 0 };
    [`blue`, `red`].forEach((color) => {
      for (const cellAddr in this.#state[color]) {
        const cell = this.#state[color][cellAddr];
        if (cell instanceof Tank && !cell.isDead) {
          alives[color]++;
        }
        this.#aliveTanks[color] = alives[color]
      }
    });

    this.#state[tank.color][cellAddress] = tank;
    $(`#${tank.color}`)[0]
      .querySelector(`[data-address=${cellAddress}]`)
      .append(tank.cell);
  }

  /**
   * Toggles player, color indicator and rotates the grid
   */
  public changePlayer = () => {
    this.#player = this.#player === Player.blue ? Player.red : Player.blue;
    this.#parent.classList.toggle(`blue`);
    if (this.#player === Player.red) {
      document.querySelector(
        `.color-indicator`
      )!.className = `color-indicator ${Player.red}`;
    }
    if (this.#player === Player.blue) {
      document.querySelector(
        `.color-indicator`
      )!.className = `color-indicator ${Player.blue}`;
    }
  };
  // public reload = () => {
  //   this.#aliveTanks = { red: 0, blue: 0 };
  //   this.#winner = null;
  //   this.generateGrid();
  //   this.renderGame();
  // };
  public set mode(val: GameMode) {
    this.#mode = val;
  }
}
