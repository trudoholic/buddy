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

		gameScene = addGameScene();
		gameOverScene = addGameOverScene();
		paused = true;
	}

	function addGameScene() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);

		gameInfo = addGameInfo();
		gamePaused = addGamePaused();

		return scene;
	}

	function addGameInfo() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);
		scene.visible = false;

		info = new PIXI.Text("Score: 0", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		info.anchor.set(0.5);
		info.position.set(logicalWidth / 2, 64);
		scene.addChild(info);

		let btn = getButton(254, 64, 0x333333);
		btn.anchor.set(0.5);
		btn.position.set(logicalWidth / 2, 150);
		scene.addChild(btn);

		//btn.buttonMode = true;
		//btn.interactive = true;
		btn.click = ()=>{
			paused = true;
			gameInfo.visible = false;
			gamePaused.visible = true;
		};

		let label = new PIXI.Text("Стоп", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label.anchor.set(0.5);
		label.position.set(logicalWidth / 2, 150);
		scene.addChild(label);

		return scene;
	}

	function addGamePaused() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);
		scene.visible = false;

		let t = new PIXI.Text("Paused...", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		t.anchor.set(0.5);
		t.position.set(logicalWidth / 2, 64);
		scene.addChild(t);

		let btn1 = getButton(230, 64, 0x333333);
		btn1.anchor.set(0.5);
		btn1.position.set(logicalWidth / 2 - 120, 150);
		scene.addChild(btn1);

		//btn1.buttonMode = true;
		//btn1.interactive = true;
		btn1.click = ()=>{
			paused = false;
			gameInfo.visible = true;
			gamePaused.visible = false;
		};

		let label1 = new PIXI.Text("Continue", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label1.anchor.set(0.5);
		label1.position.set(logicalWidth / 2 - 120, 150);
		scene.addChild(label1);

		let btn2 = getButton(230, 64, 0x333333);
		btn2.anchor.set(0.5);
		btn2.position.set(logicalWidth / 2 + 120, 150);
		scene.addChild(btn2);

		//btn2.buttonMode = true;
		//btn2.interactive = true;
		btn2.click = ()=>{
			gamePaused.visible = false;
			resetGame();
		};

		let label2 = new PIXI.Text("New Game", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label2.anchor.set(0.5);
		label2.position.set(logicalWidth / 2 + 120, 150);
		scene.addChild(label2);

		return scene;
	}

	function addGameOverScene() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);

		message = new PIXI.Text("New Game", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		message.anchor.set(0.5);
		message.position.set(logicalWidth / 2, 64);
		scene.addChild(message);

		let btn = getButton(254, 64, 0x333333);
		btn.anchor.set(0.5);
		btn.position.set(logicalWidth / 2, 150);
		scene.addChild(btn);

		//btn.buttonMode = true;
		//btn.interactive = true;
		btn.click = ()=>{
			resetGame();
		};

		let label = new PIXI.Text("Play Game", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label.anchor.set(0.5);
		label.position.set(logicalWidth / 2, 150);
		scene.addChild(label);

		return scene;
	}

	function getButton(width, height, tint) {
		const btn = new PIXI.Sprite(PIXI.Texture.WHITE);
		btn.tint = tint;
		btn.width = width;
		btn.height = height;
		btn.buttonMode = true;
		btn.interactive = true;
		return btn;
	}

	function resetGame() {
		score = 0;
		info.setText("Score: 0");
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
