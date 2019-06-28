// annonymouse function to put all variables local scope by default.
(function(){

	let mainContainer, gameScene, gameOverScene, gameInfo, gamePaused;
	let message, info, paused, model, score, tiles = [];

	PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
	const app = new PIXI.Application({
		backgroundColor: 0x999999,
		antialiasing: true,
	  }
	);
	document.body.appendChild(app.view);
	app.renderer.view.style.position = "absolute";
	app.renderer.view.style.display = "block";
	app.renderer.autoResize = true;

	const logicalWidth  = 500;
	const logicalHeight = 500;
	const resizeHandler = () => {
	  const scaleFactor = Math.min(
		window.innerWidth / logicalWidth,
		window.innerHeight / logicalHeight
	  );
	  app.renderer.resize(window.innerWidth, window.innerHeight);
	  mainContainer.scale.set(Math.min(scaleFactor, 1));
	};
	window.addEventListener('resize', resizeHandler, false);

	app.view.addEventListener('contextmenu', (e) => {
		e.preventDefault();
	});

	PIXI.loader
		.add("images/images.json")
		.load(setup);

	const cfg = {
		rows: 6,
		cols: 6,
		numBombs: 5
	}

	function setup() {
		mainContainer = new PIXI.Container();
		app.stage.addChild(mainContainer);
		resizeHandler();

		addGameScene();
		addGameOverScene();
		paused = true;
	}

	function addGameScene() {
		gameScene = new PIXI.Container();
		mainContainer.addChild(gameScene);

		addGameInfo();
		addGamePaused();

		let gameField = new PIXI.Container();
		gameField.position.y = 200;
		gameScene.addChild(gameField);

		model = new Model();
		model.putBombs(cfg.rows * cfg.cols);

		// place down tiles
		/*/
		for (let row = 0; row < cfg.rows; ++row){
			for (let col = 0; col < cfg.cols; ++col){
				const tile = new Tile(row, col);
				tile.position.set(50 + row * 80, 50 + col * 80);
				gameField.addChild(tile);
				tiles.push(tile);
			}
		}
		/*/
	}

	function addGameInfo() {
		gameInfo = new PIXI.Container();
		mainContainer.addChild(gameInfo);
		gameInfo.visible = false;

		info = new PIXI.Text("Score: 0", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		info.anchor.set(0.5);
		info.position.set(logicalWidth / 2, 64);
		gameInfo.addChild(info);

		let btn = getButton(254, 64, 0x333333);
		btn.anchor.set(0.5);
		btn.position.set(logicalWidth / 2, 150);
		gameInfo.addChild(btn);

		btn.buttonMode = true;
		btn.interactive = true;
		btn.click = ()=>{
			paused = true;
			gameInfo.visible = false;
			gamePaused.visible = true;
		};

		let label = new PIXI.Text("Pause", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label.anchor.set(0.5);
		label.position.set(logicalWidth / 2, 150);
		gameInfo.addChild(label);
	}

	function addGamePaused() {
		gamePaused = new PIXI.Container();
		mainContainer.addChild(gamePaused);
		gamePaused.visible = false;

		let t = new PIXI.Text("Paused...", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		t.anchor.set(0.5);
		t.position.set(logicalWidth / 2, 64);
		gamePaused.addChild(t);

		let btn1 = getButton(230, 64, 0x333333);
		btn1.anchor.set(0.5);
		btn1.position.set(logicalWidth / 2 - 120, 150);
		gamePaused.addChild(btn1);

		btn1.buttonMode = true;
		btn1.interactive = true;
		btn1.click = ()=>{
			paused = false;
			gameInfo.visible = true;
			gamePaused.visible = false;
		};

		let label1 = new PIXI.Text("Continue", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label1.anchor.set(0.5);
		label1.position.set(logicalWidth / 2 - 120, 150);
		gamePaused.addChild(label1);

		let btn2 = getButton(230, 64, 0x333333);
		btn2.anchor.set(0.5);
		btn2.position.set(logicalWidth / 2 + 120, 150);
		gamePaused.addChild(btn2);

		btn2.buttonMode = true;
		btn2.interactive = true;
		btn2.click = ()=>{
			gamePaused.visible = false;
			resetGame();
		};

		let label2 = new PIXI.Text("New Game", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label2.anchor.set(0.5);
		label2.position.set(logicalWidth / 2 + 120, 150);
		gamePaused.addChild(label2);
	}

	function addGameOverScene() {
		gameOverScene = new PIXI.Container();
		mainContainer.addChild(gameOverScene);

		message = new PIXI.Text("New Game", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		message.anchor.set(0.5);
		message.position.set(logicalWidth / 2, 64);
		gameOverScene.addChild(message);

		let btn = getButton(254, 64, 0x333333);
		btn.anchor.set(0.5);
		btn.position.set(logicalWidth / 2, 150);
		gameOverScene.addChild(btn);

		btn.buttonMode = true;
		btn.interactive = true;
		btn.click = ()=>{
			resetGame();
		};

		let label = new PIXI.Text("Play Game", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label.anchor.set(0.5);
		label.position.set(logicalWidth / 2, 150);
		gameOverScene.addChild(label);
	}

	class Model{
		constructor(){
			this.board = [];
		}

		putBombs(n) {
			this.board = Array(n).fill()
				.map((it, i) => ({sort: Math.random(), value: i}))
				.sort((a, b) => a.sort - b.sort)
				.map((it) => it.value);
		}

		hasBomb(row, col) {
			if (0 > row || row >= cfg.rows || 0 > col || col >= cfg.cols) return false;
			return (this.board[row * cfg.rows + col] < cfg.numBombs);
		}

		getBombs(row, col) {
			let n = 0;
			if (this.hasBomb(row - 1, col - 1)) ++n;
			if (this.hasBomb(row - 1, col    )) ++n;
			if (this.hasBomb(row - 1, col + 1)) ++n;
			if (this.hasBomb(row    , col - 1)) ++n;
			if (this.hasBomb(row    , col + 1)) ++n;
			if (this.hasBomb(row + 1, col - 1)) ++n;
			if (this.hasBomb(row + 1, col    )) ++n;
			if (this.hasBomb(row + 1, col + 1)) ++n;
			return n;
		}
	}

	class Tile extends PIXI.Container{
		constructor(row, col){
			super();
			this.row = row;
			this.col = col;
			this.marked = false;

			this.txt = new PIXI.Text("", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
			this.txt.anchor.set(0.5);
			this.addChild(this.txt);

			this.sprite = PIXI.Sprite.fromFrame(18);
			this.sprite.anchor.set(0.5);
			this.unmark();
			this.addChild(this.sprite);

			this.sprite.buttonMode = true;
			this.sprite.interactive = true;

			this.sprite.click = (data)=>{
				if (paused) return;
				if (model.hasBomb(this.row, this.col)) {
					this.sprite.tint = 0xff0000;
					endGame(false);
				}
				else {
					++score;
					info.setText("Score: " + score);
					if (score >= cfg.rows * cfg.cols - cfg.numBombs) endGame(true);

					this.setNumber(model.getBombs(this.row, this.col));
					this.sprite.visible = false;
				}
			};

			this.sprite.rightclick = (data)=>{
				if (paused) return;
				this.marked? this.unmark(): this.mark();
			};
		}

		setNumber(n){
			this.txt.setText(n? "" + n: "");
			this.txt.setStyle(new PIXI.TextStyle({
				fontFamily: "Futura", fontSize: 64,
				fill: ["white", "blue", "red", "green", "navy", "maroon", "teal", "purple", "black"][n]
			}));
		}

		mark(){
			this.marked = true;
			this.sprite.tint = 0xffffff;
			this.sprite.alpha = 1;
		}

		unmark(){
			this.marked = false;
			this.sprite.tint = 0x000000;
			// if (model.hasBomb(this.row, this.col)) { this.sprite.tint = 0xff0000; } // for testing
			this.sprite.alpha = 0.5;
		}

		reset(){
			this.txt.setText("");
			this.unmark();
			this.sprite.visible = true;
		}

	}

	function getButton(width, height, tint) {
		const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
		sprite.tint = tint;
		sprite.width = width;
		sprite.height = height;
		return sprite;
	}

	function resetGame() {
		score = 0;
		info.setText("Score: 0");
		model.putBombs(cfg.rows * cfg.cols);
		tiles.forEach(tile => tile.reset());
		gameInfo.visible = true;
		gameOverScene.visible = false;
		paused = false;
	}

	function endGame(win) {
		paused = true;
		message.setText(win? "You won!": "You lost!");
		gameInfo.visible = false;
		gameOverScene.visible = true;
	}

})();
