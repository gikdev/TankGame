/**
 * Selects wiht `querySelectorAll`
 * @param e {*} selector(s) to select
 * @returns {NodeListOf<any>} some elements
 */
const $ = (e: any) => document.querySelectorAll(e);

/**
 * Represents the possible modes of the game
 */
enum GameMode {
  play,
  arrange,
}

/**
 * Represents the possible types/colors of a player
 */
enum Player {
  blue = "blue",
  red = "red",
}

export { $, GameMode, Player };
