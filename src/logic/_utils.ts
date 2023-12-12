const $ = (e: any) => document.querySelectorAll(e);
enum GameMode { play, arrange }
enum Player {
  blue = "blue",
  red = "red",
}
export { $, GameMode, Player }