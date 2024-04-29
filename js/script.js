class Tetromino {
	constructor() {
		let index = Math.floor(Math.random() * tetrominos.length)
		this.shape = tetrominos[index].shape
		this.color = tetrominos[index].color
	}
}
class TetrominoReference {
	constructor(shape, color) {
		this.shape = shape
		this.color = color
	}
}

class Coordinates {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

let canvas
let context

let gameBoardArrayHeight = 20
let gameBoardArrayWidth = 12

let startX = 4
let startY = 0

let coordinatesArray = [...Array(gameBoardArrayHeight)].map((e) =>
	Array(gameBoardArrayWidth).fill(0)
)
let gameBoardArray = [...Array(gameBoardArrayHeight)].map((e) =>
	Array(gameBoardArrayWidth).fill(0)
)

let DIRECTION = {
	IDLE: 0,
	DOWN: 1,
	LEFT: 2,
	RIGHT: 3,
}
let direction
let currentTetromino
// let currentTetromino = new Tetromino()

let tetrominoShapes = []

document.addEventListener('DOMContentLoaded', SetupCanvas)

// if (document.readyState !== 'loading') {
// 	console.log('Ready!')
// 	SetupCanvas()
// }

function CreateCoordinatesArray() {
	let i = 0
	let j = 0

	for (let y = 9; y <= 446; y += 23) {
		for (let x = 11; x <= 446; x += 23) {
			coordinatesArray[i][j] = new Coordinates(x, y)
			i++
		}
		j++
		i = 0
	}
}

function SetupCanvas() {
	canvas = document.getElementById('gameCanvas')
	context = canvas.getContext('2d')

	canvas.width = 936
	canvas.height = 956

	context.scale(2, 2)

	context.fillStyle = 'white'
	context.fillRect(0, 0, canvas.width, canvas.height)

	context.strokeStyle = 'black'
	context.strokeRect(8, 8, 280, 462)

	document.addEventListener('keydown', HandleKeyPress)

	CreateTetrominos()
	CreateTetromino()

	CreateCoordinatesArray()
	DrawTetromino()
}

function HandleKeyPress(key) {
	if (key.keyCode === 65) {
		direction = DIRECTION.LEFT
		if (!HittingTheWall()) {
			DeleteTetromino()
			startX--
			DrawTetromino()
		}
	} else if (key.keyCode === 68) {
		direction = DIRECTION.RIGHT
		if (!HittingTheWall()) {
			DeleteTetromino()
			startX++
			DrawTetromino()
		}
	} else if (key.keyCode === 83) {
		direction = DIRECTION.DOWN
		DeleteTetromino()
		startY++
		DrawTetromino()
	}
}

function CreateTetrominos() {
	tetrominos = [
		new TetrominoReference(
			[
				[1, 0],
				[0, 1],
				[1, 1],
				[2, 1],
			],
			'purple'
		),

		new TetrominoReference(
			[
				[0, 0],
				[0, 1],
				[1, 0],
				[1, 1],
			],
			'cyan'
		),
		new TetrominoReference(
			[
				[0, 0],
				[0, 1],
				[1, 1],
				[2, 1],
			],
			'blue'
		),
		new TetrominoReference(
			[
				[0, 2],
				[0, 1],
				[1, 1],
				[2, 1],
			],
			'yellow'
		),
		new TetrominoReference(
			[
				[0, 0],
				[0, 1],
				[0, 2],
				[0, 3],
			],
			'orange'
		),
		new TetrominoReference(
			[
				[0, 0],
				[0, 1],
				[1, 1],
				[2, 1],
			],
			'green'
		),
		new TetrominoReference(
			[
				[1, 0],
				[2, 0],
				[0, 1],
				[1, 1],
			],
			'red'
		),
	]
}

function CreateTetromino() {
	currentTetromino = new Tetromino()

	console.log(currentTetromino.color)
	console.log(currentTetromino.shape)
}

function DeleteTetromino() {
	for (let i = 0; i < currentTetromino.shape.length; i++) {
		let x = currentTetromino.shape[i][0] + startX
		let y = currentTetromino.shape[i][1] + startY

		gameBoardArray[x][y] = 0

		let coordinateX = coordinatesArray[x][y].x
		let coordinateY = coordinatesArray[x][y].y

		context.fillStyle = 'white'
		context.strokeStyle = 'black'
		context.fillRect(coordinateX, coordinateY, 21, 21)
	}
}

function DrawTetromino() {
	for (let i = 0; i < currentTetromino.shape.length; i++) {
		console.log('x = ' + currentTetromino.shape[i][0])
		console.log('y = ' + currentTetromino.shape[i][1])

		let x = currentTetromino.shape[i][0] + startX
		let y = currentTetromino.shape[i][1] + startY

		gameBoardArray[x][y] = 1

		console.log(x + ' ' + y)
		console.log(coordinatesArray[x][y])

		let coordinateX = coordinatesArray[x][y].x
		let coordinateY = coordinatesArray[x][y].y

		context.fillStyle = currentTetromino.color
		context.fillRect(coordinateX, coordinateY, 21, 21)

		console.log(coordinateX + ' ' + coordinateY)
	}
}

function HittingTheWall() {
	for (let i = 0; i < currentTetromino.shape.length; i++) {
		let x = currentTetromino.shape[i][0] + startX

		if (
			(x <= 0 && direction === DIRECTION.LEFT) ||
			(x >= 11 && direction === DIRECTION.RIGHT)
		)
			return true
	}

	return false
}

// Tetrominos
// [[1,0],[0,1],[1,1],[2,1]] // bulge
// [[0,0],[0,1],[1,0],[1,1]] // square
// [[0,0],[0,1],[1,1],[1,1]] // corner left
// [[0,2],[0,1],[1,1],[2,1]] // corner right
// [[0,0],[0,1],[0,2],[0,3]] // line
// [[0,0],[0,1],[1,1],[2,1]] // curve left
// [[1,0],[2,0],[0,1],[1,1]] // curve right
