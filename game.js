const $ = (e) => document.querySelectorAll(e);

class TankGame {
  constructor(parent, state) {
    this.state = state ?? {
      blue: {
        A1: { hasTank: true, isTankDead: false },
        A2: { hasTank: false, isTankDead: false },
        A3: { hasTank: false, isTankDead: false },
        A4: { hasTank: true, isTankDead: false },
        B1: { hasTank: false, isTankDead: false },
        B2: { hasTank: false, isTankDead: false },
        B3: { hasTank: true, isTankDead: true },
        B4: { hasTank: false, isTankDead: false },
        C1: { hasTank: false, isTankDead: false },
        C2: { hasTank: true, isTankDead: false },
        C3: { hasTank: false, isTankDead: false },
        C4: { hasTank: false, isTankDead: false },
        D1: { hasTank: true, isTankDead: true },
        D2: { hasTank: false, isTankDead: false },
        D3: { hasTank: false, isTankDead: false },
        D4: { hasTank: true, isTankDead: false },
      },
      red: {
        A1: { hasTank: false, isTankDead: false },
        A2: { hasTank: true, isTankDead: false },
        A3: { hasTank: false, isTankDead: false },
        A4: { hasTank: false, isTankDead: false },
        B1: { hasTank: true, isTankDead: false },
        B2: { hasTank: true, isTankDead: true },
        B3: { hasTank: false, isTankDead: false },
        B4: { hasTank: false, isTankDead: false },
        C1: { hasTank: false, isTankDead: false },
        C2: { hasTank: true, isTankDead: false },
        C3: { hasTank: false, isTankDead: false },
        C4: { hasTank: false, isTankDead: false },
        D1: { hasTank: true, isTankDead: false },
        D2: { hasTank: true, isTankDead: true },
        D3: { hasTank: true, isTankDead: false },
        D4: { hasTank: false, isTankDead: false },
      },
    };
    this.parent = parent;
    this.renderGame();
  }
  renderGame = () => {
    this.parent.innerHTML = ``;
    this.parent.innerHTML += this.createGrid(`🟦`, this.state.blue);
    this.parent.innerHTML += this.createGrid(`🟥`, this.state.red);

    $(`.grid`).forEach((grid) =>
      grid.addEventListener(`click`, this.handleGridClick)
    );
  };
  handleGridClick = (e) => {
    const targetAddress = e.target.getAttribute(`data-address`);
    const targetColor = e.target.parentElement;

    if (targetColor === $(`#🟦`)[0]) this.destroyTank(`red`, targetAddress);
    if (targetColor === $(`#🟥`)[0]) this.destroyTank(`blue`, targetAddress);
  };
  createGrid = (id, gridState) => {
    let finalGrid = `<div class="grid" id="${id}">\n`;

    for (const cellAddr in gridState) {
      const relatedCell = gridState[cellAddr];
      finalGrid += `\t`;
      finalGrid += `<div class="grid__cell" data-address="${cellAddr}">`;
      finalGrid += relatedCell.hasTank
        ? relatedCell.isTankDead
          ? `💀`
          : id
        : ``;
      finalGrid += `</div>`;
      finalGrid += `\n`;
    }

    finalGrid += `</div>`;
    return finalGrid;
  };
  destroyTank = (player, address) => {
    this.state[player][address].isTankDead = true;
    this.renderGame();
  };
}

const tankGame1 = new TankGame($(`#tank-game`)[0]);
$(`#game-version`)[0].innerText = `v1.0.2`;
$(`#start-btn`)[0].addEventListener(`click`, () => {
  $(`#welcome-screen`)[0].classList.add(`hidden`);
});
