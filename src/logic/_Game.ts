import { $, GameMode, Player } from "./_utils";
import Tank from "./_Tank";
import Toast from "./_Toast";

export default class Game {
  #state: any = { blue: {}, red: {} };
  #parent: Element;
  #gridSize: number = 4;
  #player = Player.red;
  #mode = GameMode.arrange;
  #aliveTanks = { red: 0, blue: 0 };
  #winner: Player | null = null;

  constructor(parent: Element, gridSize: number = 4) {
    this.#parent = parent;
    this.#gridSize = gridSize;
    this.generateGrid();
    this.renderGame();
  }
  private generateGrid(): void {
    let letters = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    [`blue`, `red`].forEach((color) => {
      for (let i = 0; i < this.#gridSize; i++)
        for (let j = 0; j < this.#gridSize; j++)
          this.#state[color][`${letters[i]}${j + 1}`] = {};
    });
  }
  private renderGame(): void {
    this.#parent.innerHTML = ``;
    this.renderGrid(`blue`, this.#state.blue);
    this.renderGrid(`red`, this.#state.red);

    $(`.grid`).forEach((grid) =>
      grid.addEventListener(`click`, this.handleGridClick)
    );
  }
  private handleGridClick = (e: any): void => {
    const isTargetImage = e.target.tagName === "IMG";
    const currentTarget = isTargetImage ? e.target.parentElement : e.target;
    const address = currentTarget.dataset.address;
    const color = currentTarget.parentElement.id;

    if (this.#mode === GameMode.play) {
      const enemyColor = color === `blue` ? `red` : `blue`;
      const enemyCell = this.#state[enemyColor][address];
      const isEnemyCellATank = enemyCell instanceof Tank;
      if (isEnemyCellATank) enemyCell.destroy();
      if (enemyColor === Player.red) this.#aliveTanks.red--;
      if (enemyColor === Player.blue) this.#aliveTanks.blue--;
      this.changePlayer();
      const probableWinner = this.whoWon();
      if (probableWinner) {
        this.#winner = probableWinner;
        this.showWinner()
      }
    }
    if (this.#mode === GameMode.arrange) {
      this.addTank(address, new Tank(color));
    }
  };
  private renderGrid(id: string, gridState: any): void {
    let finalGrid = `<div class="grid" id="${id}">\n`;

    for (const cellAddr in gridState)
      finalGrid += `\t<div class="grid__cell" data-address="${cellAddr}"></div>\n`;

    finalGrid += `</div>`;
    this.#parent.innerHTML += finalGrid;

    $(`.grid`).forEach((grid) => {
      grid.style.gridTemplateColumns = `repeat(${this.#gridSize}, 1fr)`;
      grid.style.gridTemplateRows = `repeat(${this.#gridSize}, 1fr)`;
    });
  }
  private whoWon(): Player | null {
    if (this.#aliveTanks.red === 0) return Player.blue;
    else if (this.#aliveTanks.blue === 0) return Player.red;
    else return null;
  }
  private showWinner(): void {
    if (this.#winner === Player.blue) {
      new Toast(Player.blue, 'آبی برنده شد!').show()
    }
    if (this.#winner === Player.red) {
      new Toast(Player.red, 'قرمز برنده شد!').show()
    }
    this.freeze()
  }

  public freeze() {
    $('.btn:not(#btn-reload)').forEach(btn => btn.disabled = true);
  }

  public addTank(cellAddress: string, tank: Tank) {
    if (tank.color === Player.red) this.#aliveTanks.red++;
    if (tank.color === Player.blue) this.#aliveTanks.blue++;
    this.#state[tank.color][cellAddress] = tank;
    $(`#${tank.color}`)[0]
      .querySelector(`[data-address=${cellAddress}]`)
      .append(tank.cell);
  }
  public changePlayer = () => {
    this.#player = this.#player === Player.blue ? Player.red : Player.blue;
    this.#parent.classList.toggle("blue");
    if (this.#player === Player.red) {
      document.querySelector(
        ".color-indicator"
      )!.className = `color-indicator ${Player.red}`;
    }
    if (this.#player === Player.blue) {
      document.querySelector(
        ".color-indicator"
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