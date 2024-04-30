class Game {
	constructor(
		canvasWidth,
		canvasHeight,
		canvasShiftX,
		canvasShiftY,
		canvasIncrement
	) {
		this.canvasWidth = canvasWidth
		this.canvasHeight = canvasHeight
		this.canvasShiftY = canvasShiftX
		this.canvasPaddingY = canvasShiftY
		this.canvasIncrement = canvasIncrement
		this.Init()
	}

	Init() {
		let canvasWidth = this.canvasWidth
		let canvasHeight = this.canvasHeight
		let canvasPaddingX = this.canvasShiftY
		let canvasPaddingY = this.canvasPaddingY
		let canvasIncrement = this.canvasIncrement

		this.Field = [...Array(canvasHeight)].map((e) => Array(canvasWidth).fill(0))

		for (
			let gbY = 0, cY = canvasPaddingY;
			cY + canvasIncrement < canvasHeight - canvasPaddingY;
			gbY++, cY += canvasIncrement
		) {
			for (
				let gbX = 0, cX = canvasPaddingX;
				cX + canvasIncrement < canvasWidth - canvasPaddingX;
				gbX++, cX += canvasIncrement
			) {
				this.Field[gbY][gbX] = new Cell(cX, cY)
			}
		}

		this.Field[1][1].color = 3
	}

	Clear() {
		context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
	}
}

class Cell {
	constructor(canvasX, canvasY, color = 0) {
		this.canvasX = canvasX
		this.canvasY = canvasY
		this.color = COLORS[Object.keys(COLORS)[color]]
	}

	get color() {
		return this._color
	}

	set color(value) {
		this._color = value
		this.Draw()
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
		context.fillStyle = COLORS[Object.keys(COLORS)[this.color]]
		console.log(context.fillStyle)
		context.fillRect(
			this.canvasX,
			this.canvasY,
			SETTINGS.C_PIXEL_SIDE,
			SETTINGS.C_PIXEL_SIDE
		)
	}
}

// The array with all the tetrominos shapes correlated with their own colors
const TETROMINOS = [
	[
		[
			[1, 0],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		'purple',
	],

	[
		[
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1],
		],
		'cyan',
	],
	[
		[
			[0, 0],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		'blue',
	],
	[
		[
			[0, 2],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		'yellow',
	],
	[
		[
			[0, 0],
			[0, 1],
			[0, 2],
			[0, 3],
		],
		'orange',
	],
	[
		[
			[0, 0],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		'green',
	],
	[
		[
			[1, 0],
			[2, 0],
			[0, 1],
			[1, 1],
		],
		'red',
	],
]

// The dict containing directions of an active tetromino
const DIRECTIONS = {
	IDLE: 0,
	DOWN: 1,
	LEFT: 2,
	RIGHT: 3,
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
	GB_ARRAY_HEIGHT: 20,
	GB_ARRAY_WIDTH: 12,
}

let gameBoardArray

let canvas
let context
let game

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

	console.log('blyaat')
	game.Field[1][1].color = 3
	//game.Field[1][1].Draw()
}

init()
