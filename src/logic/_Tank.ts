import redTank from '/images/red-tank.svg'
import blueTank from '/images/blue-tank.svg'
import deadTank from '/images/dead.svg'

export default class Tank {
  #isDead: boolean = false;
  #cell: HTMLImageElement = new Image();
  #color: string;

  constructor(color = ``) {
    this.#color = color;
    this.#cell.classList.add(`tank`);
    if (this.#color === `red`)
      this.#cell.src = redTank;
    if (this.#color === `blue`)
      this.#cell.src = blueTank;
  }
  destroy = () => {
    this.#cell.src = deadTank;
    this.#isDead = true;
  }

  public get position(): string {
    return this.#cell.parentElement?.getAttribute(`data-address`)!;
  }
  public get isDead(): boolean {
    return this.#isDead;
  }
  public get cell(): HTMLImageElement {
    return this.#cell;
  }
  public get color(): string {
    return this.#color;
  }
}
