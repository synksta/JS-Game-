//Надо объявить некоторые штуки по типу массива остановленных фигур

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

const DARK_COLOR = 'black'
const LIGHT_COLOR = 'white'
let SCORE_INCREMENT = 20

let canvas
let context

let gameBoardArrayHeight = 20
let gameBoardArrayWidth = 12

let startX = 4
let startY = 0

let score = 100
let level = 100
let gameOver = false

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

	context.fillStyle = DARK_COLOR
	context.fillRect(0, 0, canvas.width, canvas.height)

	context.strokeStyle = LIGHT_COLOR
	context.strokeRect(8, 8, 280, 462)

	// ui

	context.fillStyle = LIGHT_COLOR
	context.font = '21px Arial'
	context.fillText('SCORE', 300, 98)

	context.strokeRect(300, 107, 161, 24)

	context.fillText(score.toString(), 310, 127)

	context.fillText('LEVEL', 300, 157)

	context.strokeRect(300, 171, 161, 24)

	context.fillText(level.toString(), 310, 127)

	context.fillText('WIN/LOSE', 300, 220)

	context.fillText(gameOver, 310, 261)

	context.strokeRect(300, 232, 161, 95)

	context.fillText('CONTROLS', 300, 354)

	context.strokeRect(300, 366, 161, 104)

	context.font = '19px Arial'
	context.fillText('A : Move Left', 310, 388)
	context.fillText('D : Move Right', 310, 413)
	context.fillText('S : Move Down', 310, 438)
	context.fillText('E : Rotate Right', 310, 463)

	document.addEventListener('keydown', HandleKeyPress)

	CreateTetrominos()
	CreateTetromino()

	CreateCoordinatesArray()
	DrawTetromino()
}

function HandleKeyPress(key) {
	if (!gameOver) {
		if (key.keyCode === 65) {
			direction = DIRECTION.LEFT
			if (!HittingTheWall() && !CheckForHorizontalCollision()) {
				DeleteTetromino()
				startX--
				DrawTetromino()
			}
		} else if (key.keyCode === 68) {
			direction = DIRECTION.RIGHT
			if (!HittingTheWall() && !CheckForHorizontalCollision()) {
				DeleteTetromino()
				startX++
				DrawTetromino()
			}
		} else if (key.keyCode === 83) {
			MoveTetrominoDown()
		} else if (key.keyCode === 69) {
			RotateTetromino()
		}
	}
}

function MoveTetrominoDown() {
	if (!CheckForVerticalCollision) direction = DIRECTION.DOWN
	DeleteTetromino()
	startY++
	DrawTetromino()
}

window.setInterval(function () {
	if (!gameOver) {
		MoveTetrominoDown()
	}
}, 1000)

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

		context.fillStyle = DARK_COLOR
		context.strokeStyle = LIGHT_COLOR
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

function CheckForHorizontalCollision() {
	let tetrominoCopy = currentTetromino
	let collision = false
	for (let i = 0; i < tetrominoCopy.shape.length; i++) {
		let x = tetrominoCopy.shape[i][0] + startX
		let y = tetrominoCopy.shape[i][1] + startX

		if (direction === DIRECTION.LEFT) x--
		else if (direction === DIRECTION.RIGHT) x++

		if (typeof stoppedShapeArray[x][y] === 'string') {
			collision = true
			break
		}
	}

	return collision
}

function CheckForVerticalCollision() {
	let tetrominoCopy = currentTetromino
	let collision = false
	for (let i = 0; i < tetrominoCopy.shape.length; i++) {
		let x = tetrominoCopy.shape[i][0] + startX
		let y = tetrominoCopy.shape[i][1] + startX

		if (direction === DIRECTION.DOWN) y++
		if (gameBoardArray[x][y + 1] === 1) {
			if (typeof stoppedShapeArray[x][y + 1] === 'string') {
				DeleteTetromino()
				startY++
				DrawTetromino
				collision = true
				break
			}
			if (y >= 20) {
				collision = true
				break
			}
		}

		if (collision) {
			if (startY <= 2) {
				gameOver = true
				context.fillStyle = LIGHT_COLOR
				context.fillRect(310, 242, 140, 30)
				context.fillStyle = DARK_COLOR
				context.fillText("That's all folks!", 310, 261)
			} else {
				for (let i = 0; i < tetrominoCopy.shape.length; i++) {
					let x = tetrominoCopy.shape[i][0] + startX
					let y = tetrominoCopy.shape[i][1] + startX
					stoppedShapeArray[x][y] = currentTetromino.color
				}
				CheckForCompletedRows()
				CreateTetromino()
				direction = DIRECTION.IDLE
				startX = 4
				startY = 0
				DrawTetromino()
			}
		}
	}
}

function CheckForCompletedRows() {
	let rowsToDelete = 0
	let startOfDeletion = 0
	for (let y = 0; y < gameBoardArrayHeight; y++) {
		let completed = true
		for (let x = 0; x < gameBoardArrayWidth; x++) {
			if (
				stoppedShapeArray[x][y] === 0 ||
				typeof stoppedShapeArray[x][y] === 'undefined'
			) {
				completed = false
				break
			}
		}
		if (completed) {
			if (startOfDeletion === 0) startOfDeletion === y
			rowsToDelete++
			for (let i = 0; i < gameBoardArrayWidth; i++) {
				stoppedShapeArray[i][y] = 0
				gameBoardArray[i][y] = 0
				let coordinateX = coordinatesArray[i][y].x
				let coordinateY = coordinatesArray[i][y].y
				context.fillStyle = LIGHT_COLOR
				context.fillRect(coordinateX, coordinateY, 21, 21)
			}
		}
	}
	if (rowsToDelete > 0) {
		score += SCORE_INCREMENT
		context.fillStyle = LIGHT_COLOR
		context.fillRect(310, 109, 140, 19)
		context.fillStyle = DARK_COLOR
		context.fillText(score.toString(), 310, 127)
		MoveAllRowsDown(rowsToDelete, startOfDeletion)
	}
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
	for (let y0 = startOfDeletion - 1; y0 >= 0; y0--) {
		for (let x = 0; x < gameBoardArrayWidth; x++) {
			let y1 = y0 + rowsToDelete
			let currentSquare = stoppedShapeArray[x][y0]
			let nextSquare = stoppedShapeArray[x][y1]
			if (typeof currentSquare === 'string') {
				nextSquare = currentSquare
				gameBoardArray[x][y1] = 1
				stoppedShapeArray[x][y1] = currentSquare
				let coordinateX = coordinatesArray[x][y1].x
				let coordinateY = coordinatesArray[x][y1].y
				context.fillStyle = nextSquare
				context.fillRect(coordinateX, coordinateY, 21, 21)

				currentSquare = 0
				gameBoardArray[x][y0] = 0
				stoppedShapeArray[x][y0] = 0
				coordinateX = coordinatesArray[x][y0].x
				coordinateY = coordinatesArray[x][y0].y
				context.fillStyle = LIGHT_COLOR
				context.fillRect(coordinateX, coordinateY, 21, 21)
			}
		}
	}
}

function RotateTetromino() {
	let newRotation = new Array()
	let tetrominoCopy = currentTetromino
	let currentTetrominoBackup
	for (let i = 0; i < tetrominoCopy.shape.length; i++) {
		currentTetrominoBackup = { ...currentTetromino }
		let x = tetrominoCopy.shape[i][0]
		let y = tetrominoCopy.shape[i][1]

		let newX = GetLastSquareX() - y
		let newY = x

		newRotation.push([newX, newY])
	}
	DeleteTetromino()

	try {
		currentTetromino.shape = newRotation
		DrawTetromino()
	} catch (e) {
		if (e instanceof TypeError) {
			currentTetromino = currentTetrominoBackup
			DeleteTetromino()
			DrawTetromino()
		}
	}
}

function GetLastSquareX() {
	let lastX = 0
	for (let i = 0; i < currentTetromino.shape.length; i++) {
		const square = currentTetromino.shape[i]
		if (square[0] > lastX) lastX = square[0]
	}
	return lastX
}

// Tetrominos
// [[1,0],[0,1],[1,1],[2,1]] // bulge
// [[0,0],[0,1],[1,0],[1,1]] // square
// [[0,0],[0,1],[1,1],[1,1]] // corner left
// [[0,2],[0,1],[1,1],[2,1]] // corner right
// [[0,0],[0,1],[0,2],[0,3]] // line
// [[0,0],[0,1],[1,1],[2,1]] // curve left
// [[1,0],[2,0],[0,1],[1,1]] // curve right
