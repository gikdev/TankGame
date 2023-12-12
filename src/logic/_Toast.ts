import { Player } from "./_utils";

export default class Toast {
  #time: number;
  #text: string;
  #toast: HTMLElement;
  #winnerColor: Player;

  constructor(winnerColor: Player, text = "پیام تست", time = 3000) {
    this.#time = time;
    this.#text = text;
    this.#toast = document.createElement("DIV");
    this.#toast.classList.add("toast");
    this.#winnerColor = winnerColor;
    this.#toast.innerText = this.#text;
    this.#toast.classList.add(this.#winnerColor);
  }

  show() {
    document.body.append(this.#toast);
    this.#toast.classList.add("show");
    setTimeout(() => this.#toast.remove(), this.#time)
  }
}