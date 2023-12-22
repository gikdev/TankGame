import "../styles/main.scss";
import { $, GameMode } from "./_utils";
import Game from "./_Game";

const tankGame = new Game($(`#🎮`)[0], 2);

$(`#start-btn`)[0].addEventListener(`click`, () => {
  $(`#👞`)[0].classList.add(`hidden`);
  $(`#note`)[0].remove();
});

$("#btn-arrange-tanks")[0].addEventListener(
  "click",
  () => (tankGame.mode = GameMode.arrange)
);
$("#btn-play-game")[0].addEventListener(
  "click",
  () => (tankGame.mode = GameMode.play)
);
$("#btn-change-player")[0].addEventListener("click", tankGame.changePlayer);
$("#btn-reload")[0].addEventListener("click", () => window.location.reload());
