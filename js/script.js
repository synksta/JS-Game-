class Coordinates {
	constructor(x = undefined, y = undefined) {
		this.x = x
		this.y = y
	}
}
class Game {
	currentTetromino

	constructor(
		canvasWidth,
		canvasHeight,
		canvasPaddingX,
		canvasPaddingY,
		canvasIncrement
	) {
		this.canvasWidth = canvasWidth
		this.canvasHeight = canvasHeight
		this.canvasPaddingX = canvasPaddingX
		this.canvasPaddingY = canvasPaddingY
		this.canvasIncrement = canvasIncrement
		this.Init()
	}

	Init() {
		this.Clear()

		this.Field = new Array()

		for (
			let gbY = 0, cY = this.canvasPaddingY;
			cY + this.canvasIncrement < this.canvasHeight - this.canvasPaddingY;
			gbY++, cY += this.canvasIncrement
		) {
			this.Field.push(new Array())
			for (
				let gbX = 0, cX = this.canvasPaddingX;
				cX + this.canvasIncrement < this.canvasWidth - this.canvasPaddingX;
				gbX++, cX += this.canvasIncrement
			) {
				this.Field[gbY].push(new Cell(cX, cY))
			}
		}

		if (this.Field.length > 0 && this.Field[0].length > 0) {
			SETTINGS.GB_FIELD_WIDTH = this.Field[0].length
			SETTINGS.GB_FIELD_HEIGHT = this.Field.length

			// Setting start tetromino coordinate as the horizontal middle of game field
			SETTINGS.START_CELL_INDEX_X =
				SETTINGS.GB_FIELD_WIDTH % 2 === 0
					? Math.ceil(SETTINGS.GB_FIELD_WIDTH / 2) - 1
					: Math.ceil(SETTINGS.GB_FIELD_WIDTH / 2)
			// Inittializing the first tetromino
			this.currentTetromino = new Tetromino(this)

			//let testTetromino1 = new Tetromino(this, 0, 0)
			//let testTetromino2 = new Tetromino(this, 5, 5)
		}
	}

	Clear() {
		//context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

		context.fillStyle = COLORS.GRID
		context.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
	}
}

class Cell {
	constructor(canvasX, canvasY, color = COLORS.TRANSPARENT) {
		this.canvasX = canvasX
		this.canvasY = canvasY
		this.color = color
	}

	get color() {
		return this._color
	}

	set color(value) {
		this._color =
			typeof value === 'number' ? COLORS[Object.keys(COLORS)[value]] : value
		if (this._color === COLORS.TRANSPARENT) this.Clear()
		else this.Draw()
	}

	Clear() {
		context.clearRect(
			this.canvasX,
			this.canvasY,
			SETTINGS.C_PIXEL_SIDE,
			SETTINGS.C_PIXEL_SIDE
		)
	}

	Draw() {
		context.fillStyle = this.color
		context.fillRect(
			this.canvasX,
			this.canvasY,
			SETTINGS.C_PIXEL_SIDE,
			SETTINGS.C_PIXEL_SIDE
		)
	}
}

class Tetromino {
	_currentCoordinates = new Coordinates()

	set currentCoordinates({ x, y }) {
		this.previousCoordinates.x =
			typeof this.currentCoordinates.x === 'undefined'
				? x
				: this.currentCoordinates.x
		this.previousCoordinates.y =
			typeof this.currentCoordinates.y === 'undefined'
				? y
				: this.currentCoordinates.y
		this._currentCoordinates.x = x
		this._currentCoordinates.y = y
		this.Draw()
	}

	get currentCoordinates() {
		return this._currentCoordinates
	}

	constructor(
		game,
		x = SETTINGS.START_CELL_INDEX_X,
		y = SETTINGS.START_CELL_INDEX_Y,
		shape = undefined
	) {
		if (typeof shape === 'undefined') {
			let tetrominoIndex = Math.floor(Math.random() * TETROMINOS.length)
			this.shape = TETROMINOS[tetrominoIndex]['shape']
			this.color = TETROMINOS[tetrominoIndex]['color']
		} else {
			this.shape = shape
			this.color = COLORS.TRANSPARENT
		}
		this.game = game
		this.direction = DIRECTIONS.IDLE

		this.previousCoordinates = new Coordinates()

		this.currentCoordinates = new Coordinates(x, y)
	}

	Clear() {
		for (let i = 0; i < this.shape.length; i++) {
			let currentShapeCoordinates = new Coordinates(
				this.shape[i][1] + this.currentCoordinates.x,
				this.shape[i][0] + this.currentCoordinates.y
			)

			this.game.Field[currentShapeCoordinates.y][
				currentShapeCoordinates.x
			].color = COLORS.TRANSPARENT
		}
	}

	Draw() {
		if (this.color != COLORS.TRANSPARENT) {
			// Clear previous position
			for (let i = 0; i < this.shape.length; i++) {
				let previousShapeCoordinates = new Coordinates(
					this.shape[i][1] + this.previousCoordinates.x,
					this.shape[i][0] + this.previousCoordinates.y
				)

				this.game.Field[previousShapeCoordinates.y][
					previousShapeCoordinates.x
				].color = COLORS.TRANSPARENT
			}
			// Draw tetromino on a current position
			for (let i = 0; i < this.shape.length; i++) {
				let currentShapeCoordinates = new Coordinates(
					this.shape[i][1] + this.currentCoordinates.x,
					this.shape[i][0] + this.currentCoordinates.y
				)
				this.game.Field[currentShapeCoordinates.y][
					currentShapeCoordinates.x
				].color = this.color
			}
		}
	}

	MoveRight() {
		this.currentCoordinates = new Coordinates(
			this.currentCoordinates.x + 1,
			this.currentCoordinates.y
		)
		// console.log(this.currentCoordinates)
	}

	MoveLeft() {
		this.currentCoordinates = new Coordinates(
			this.currentCoordinates.x - 1,
			this.currentCoordinates.y
		)
		// console.log(this.currentCoordinates)
	}

	MoveDown() {
		if (VerticalCollisionCheck()) {
			this.currentCoordinates = new Coordinates(
				this.currentCoordinates.x,
				this.currentCoordinates.y + 1
			)
		} else {
			//delete completed rows and shift every other row
			let deletionStartRow
			let shift = 0

			for (let y = SETTINGS.GB_FIELD_HEIGHT - 1; y >= 0; y--) {
				let completed = true
				for (let x = 0; x < SETTINGS.GB_FIELD_WIDTH && completed; x++) {
					if (this.game.Field[y][x].color === COLORS.TRANSPARENT)
						completed = false
				}
				if (completed) {
					deletionStartRow =
						typeof deletionStartRow === 'undefined' ? y : deletionStartRow
					shift++
					for (let x = 0; x < SETTINGS.GB_FIELD_WIDTH && completed; x++) {
						this.game.Field[y][x].color = COLORS.TRANSPARENT
					}
				}
			}

			if (typeof deletionStartRow != 'undefined' && shift > 0) {
				for (let y = deletionStartRow - 1; y >= 0; y--) {
					for (let x = 0; x < SETTINGS.GB_FIELD_WIDTH; x++) {
						this.game.Field[y + shift][x].color = this.game.Field[y][x].color
						this.game.Field[y][x].color = COLORS.TRANSPARENT
					}
				}
			}

			this.game.currentTetromino = new Tetromino(this.game)
		}
		// console.log(this.currentCoordinates)
	}

	Rotate() {
		let rotatedShape = new Array()
		let shapeRightX = [...this.shape].sort((a, b) => b[1] - a[1])[0][1]
		for (let i = 0; i < this.shape.length; i++) {
			rotatedShape.push([shapeRightX - this.shape[i][1], this.shape[i][0]])
		}

		let rotationTestTetromino = new Tetromino(
			this.game,
			this.currentCoordinates.x,
			this.currentCoordinates.y,
			rotatedShape
		)

		this.Clear()

		if (
			HorizontalCollisionCheck(rotationTestTetromino) &&
			VerticalCollisionCheck(rotationTestTetromino)
		) {
			this.shape = rotatedShape
		}

		this.Draw()
		// this.currentCoordinates = new Coordinates(
		// 	this.currentCoordinates.x,
		// 	this.currentCoordinates.y - 1
		// )
		// console.log(this.currentCoordinates)
	}
}
const COLORS = {
	TRANSPARENT: 'transparent',
	PINK: 'rgb(249, 168, 212)',
	PURPLE: 'rgb(216, 180, 254)',
	CYAN: 'rgb(103, 232, 249)',
	SKY: 'rgb(125, 211, 252)',
	LIME: 'rgb(190, 242, 100)',
	AMBER: 'rgb(252, 211, 77)',
	RED: 'rgb(252, 165, 165)',
	GRID: 'rgb(17, 24, 39)',
}
// The array with all the tetrominos shapes correlated with their own colors
const TETROMINOS = [
	{
		shape: [
			[1, 0],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		color: COLORS.RED,
	},
	{
		shape: [
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1],
		],
		color: COLORS.AMBER,
	},
	{
		shape: [
			[0, 0],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		color: COLORS.LIME,
	},
	{
		shape: [
			[0, 1],
			[0, 0],
			[1, 0],
			[2, 0],
		],
		color: COLORS.CYAN,
	},
	{
		shape: [
			[0, 0],
			[1, 0],
			[2, 0],
			[3, 0],
		],
		color: COLORS.SKY,
	},
	{
		shape: [
			[0, 0],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		color: COLORS.PURPLE,
	},
	{
		shape: [
			[1, 0],
			[2, 0],
			[0, 1],
			[1, 1],
		],
		color: COLORS.PINK,
	},
]

// The dict containing directions of an active tetromino
const DIRECTIONS = {
	IDLE: 0,
	DOWN: 1,
	LEFT: 2,
	RIGHT: 3,
}

const SETTINGS = {
	// Canvas
	C_WIDTH: 310,
	C_HEIGHT: 610,
	C_PADDING_X: 0,
	C_PADDING_Y: 0,
	C_PIXEL_SIDE: 20,
	C_PIXEL_GAP: 2,
	// Game board
	GB_FIELD_HEIGHT: 20,
	GB_FIELD_WIDTH: 12,
	// Rules
	START_CELL_INDEX_X: 0,
	START_CELL_INDEX_Y: 0,
	// Control keys
	CONTROLS_LEFT: 'ArrowLeft',
	CONTROLS_RIGHT: 'ArrowRight',
	CONTROLS_DOWN: 'ArrowDown',
	CONTROLS_ROTATE: 'ArrowUp',
}

let gameBoardArray

let canvas
let context
let game
// let currentTetromino

function init() {
	canvas = document.getElementById('gameCanvas')
	context = canvas.getContext('2d')

	canvas.width = SETTINGS.C_WIDTH
	canvas.height = SETTINGS.C_HEIGHT

	game = new Game(
		SETTINGS.C_WIDTH,
		SETTINGS.C_HEIGHT,
		SETTINGS.C_PADDING_X,
		SETTINGS.C_PADDING_Y,
		SETTINGS.C_PIXEL_SIDE + SETTINGS.C_PIXEL_GAP
	)

	document.addEventListener('keydown', HandleKeyPress)
}

function HandleKeyPress(keyInstance) {
	if (
		[
			SETTINGS.CONTROLS_LEFT,
			SETTINGS.CONTROLS_RIGHT,
			SETTINGS.CONTROLS_DOWN,
			SETTINGS.CONTROLS_ROTATE,
		].includes(keyInstance.code)
	) {
		switch (keyInstance.code) {
			case SETTINGS.CONTROLS_LEFT:
				game.currentTetromino.direction = DIRECTIONS.LEFT
				if (HorizontalCollisionCheck()) game.currentTetromino.MoveLeft()

				break
			case SETTINGS.CONTROLS_RIGHT:
				game.currentTetromino.direction = DIRECTIONS.RIGHT
				if (HorizontalCollisionCheck()) game.currentTetromino.MoveRight()

				break
			case SETTINGS.CONTROLS_DOWN:
				game.currentTetromino.direction = DIRECTIONS.DOWN
				game.currentTetromino.MoveDown()

				break
			case SETTINGS.CONTROLS_ROTATE:
				game.currentTetromino.Rotate()
				break
		}
		game.currentTetromino.direction = DIRECTIONS.IDLE
		console.log(game.currentTetromino.currentCoordinates)
	}
}

function HorizontalCollisionCheck(tetromino = game.currentTetromino) {
	for (let i = 0; i < tetromino.shape.length; i++) {
		let currentShapeCellX =
			tetromino.shape[i][1] + tetromino.currentCoordinates.x

		// Wall collision

		if (
			([DIRECTIONS.LEFT, DIRECTIONS.IDLE].includes(tetromino.direction) &&
				currentShapeCellX <= 0) ||
			([DIRECTIONS.RIGHT, DIRECTIONS.IDLE].includes(tetromino.direction) &&
				currentShapeCellX >= SETTINGS.GB_FIELD_WIDTH - 1)
		) {
			return false
		}

		// Tetromino collision

		let currentShapeCellY =
			tetromino.shape[i][0] + tetromino.currentCoordinates.y

		let currentShapeLeftX = tetromino.currentCoordinates.x

		let currentShapeRightX =
			[...tetromino.shape].sort((a, b) => b[1] - a[1])[0][1] +
			tetromino.currentCoordinates.x

		let currentShapeCellLeftX =
			tetromino.currentCoordinates.x +
			[...tetromino.shape]
				.filter((cell) => cell[0] === tetromino.shape[i][0])
				.sort((a, b) => a[1] - b[1])[0][1]

		let currentShapeCellRightX =
			tetromino.currentCoordinates.x +
			[...tetromino.shape]
				.filter((cell) => cell[0] === tetromino.shape[i][0])
				.sort((a, b) => b[1] - a[1])[0][1]

		if (
			!(
				currentShapeLeftX === 0 ||
				currentShapeRightX === SETTINGS.GB_FIELD_WIDTH - 1
			)
		) {
			if (
				([DIRECTIONS.LEFT, DIRECTIONS.IDLE].includes(tetromino.direction) &&
					game.Field[currentShapeCellY][currentShapeCellLeftX - 1].color !=
						COLORS.TRANSPARENT) ||
				([DIRECTIONS.RIGHT, DIRECTIONS.IDLE].includes(tetromino.direction) &&
					game.Field[currentShapeCellY][currentShapeCellRightX + 1].color !=
						COLORS.TRANSPARENT)
			) {
				return false
			}
		}
	}
	return true
}

function VerticalCollisionCheck(tetromino = game.currentTetromino) {
	for (let i = 0; i < tetromino.shape.length; i++) {
		let currentShapeCellY =
			tetromino.shape[i][0] + tetromino.currentCoordinates.y

		// Wall collision
		if (
			(currentShapeCellY <= 0 && tetromino.direction === DIRECTIONS.IDLE) ||
			(currentShapeCellY >= SETTINGS.GB_FIELD_HEIGHT - 1 &&
				[DIRECTIONS.DOWN, DIRECTIONS.IDLE].includes(tetromino.direction))
		)
			return false

		// Tetromino collision

		let currentShapeCellX =
			tetromino.shape[i][1] + tetromino.currentCoordinates.x

		let currentShapeUpY = tetromino.currentCoordinates.y

		let currentShapeDownY =
			[...tetromino.shape].sort((a, b) => b[0] - a[0])[0][0] +
			tetromino.currentCoordinates.y

		let currentShapeCellUpY =
			tetromino.currentCoordinates.y +
			[...tetromino.shape]
				.filter((cell) => cell[1] === tetromino.shape[i][1])
				.sort((a, b) => a[0] - b[0])[0][0]

		let currentShapeCellDownY =
			tetromino.currentCoordinates.y +
			[...tetromino.shape]
				.filter((cell) => cell[1] === tetromino.shape[i][1])
				.sort((a, b) => b[0] - a[0])[0][0]

		if (
			!(
				currentShapeUpY === 0 ||
				currentShapeDownY === SETTINGS.GB_FIELD_HEIGHT - 1
			)
		) {
			if (
				(DIRECTIONS.IDLE === tetromino.direction &&
					game.Field[currentShapeCellUpY - 1][currentShapeCellX].color !=
						COLORS.TRANSPARENT) ||
				([DIRECTIONS.DOWN, DIRECTIONS.IDLE].includes(tetromino.direction) &&
					game.Field[currentShapeCellDownY + 1][currentShapeCellX].color !=
						COLORS.TRANSPARENT)
			) {
				return false
			}
		}
	}
	return true
}

init()
