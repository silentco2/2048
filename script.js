import Board from "./board.js"
import Tile from "./tile.js"
const main = document.getElementById("container")
const board = new Board(main)
board.random_cell().tile = new Tile(main)
board.random_cell().tile = new Tile(main)
reset_input()
function reset_input() {window.addEventListener("keydown", handleInput, { once: true })}
async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!movable_up()) {
        reset_input()
        return
      }
      await move_up()
      break
    case "ArrowDown":
      if (!movable_down()) {
        reset_input()
        return
      }
      await move_down()
      break
    case "ArrowLeft":
      if (!movable_left()) {
        reset_input()
        return
      }
      await move_left()
      break
    case "ArrowRight":
      if (!movable_right()) {
        reset_input()
        return
      }
      await move_right()
      break
    default:
      reset_input()
      return
  }
  board.cells.forEach(cell => cell.merge_tiles())
  const newTile = new Tile(main)
  board.random_cell().tile = newTile
  if (!movable_up() && !movable_down() && !movable_left() && !movable_right()) {
    newTile.transition(true).then(() => {alert("Game Over")})
    return
  }

  reset_input()
}

function move_up() {return slide(board.column_cells)}

function move_down() {return slide(board.column_cells.map(column => [...column].reverse()))}

function move_left() {return slide(board.row_cells)}

function move_right() {return slide(board.row_cells.map(row => [...row].reverse()))}

function slide(cells) {
  return Promise.all(cells.flatMap(group => {const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let valid_move
        for (let j = i - 1; j >= 0; j--) {
          const moveto = group[j]
          if (!moveto.accept_motion(cell.tile)) break
          valid_move = moveto
        }
        if (valid_move != null) {
          promises.push(cell.tile.transition())
          if (valid_move.tile != null) {valid_move.merge = cell.tile} 
            else {valid_move.tile = cell.tile}
          cell.tile = null
        }
      }
      return promises
    })
  )
}

function movable_up() {return movable(board.column_cells)}

function movable_down() {return movable(board.column_cells.map(column => [...column].reverse()))}

function movable_left() {return movable(board.row_cells)}

function movable_right() {return movable(board.row_cells.map(row => [...row].reverse()))}

function movable(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveto = group[index - 1]
      return moveto.accept_motion(cell.tile)
    })
  })
}