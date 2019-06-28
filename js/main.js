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

	let curScene = null;
	function setScene(scene) {
		console.log(curScene? curScene.name: "--", ">", scene? scene.name: "--");
		if (curScene) curScene.exit();
		curScene = scene;
		if (curScene) curScene.enter();
		console.log(paused);
	}

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

		setScene(gameInfo);
	}

	function addGameScene() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);

		scene.name = "gameScene";
		scene.visible = false;

		scene.enter = ()=>{
			//paused = false;
			console.log("enter:", scene.name);
			scene.visible = true;
		};

		scene.exit = ()=>{
			//paused = true;
			console.log("exit:", scene.name);
			scene.visible = false;
		};

		gameInfo = addGameInfo();
		gamePaused = addGamePaused();

		let i = new PIXI.Text("В игре", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		i.anchor.set(0.5);
		i.position.set(logicalWidth / 2, 64);
		scene.addChild(i);

		let btn = getButton(254, 64, 0x333333);
		btn.anchor.set(0.5);
		btn.position.set(logicalWidth / 2, 150);
		scene.addChild(btn);

		btn.click = ()=>{
			//resetGame();

			setScene(gamePaused);
		};

		let label = new PIXI.Text("Проиграть", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label.anchor.set(0.5);
		label.position.set(logicalWidth / 2, 150);
		scene.addChild(label);

		return scene;
	}

	function addGameInfo() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);

		scene.name = "gameInfo";
		scene.visible = false;

		scene.enter = ()=>{
			//paused = false;
			//console.log("enter:", this.name);
			//this.visible = true;

			console.log("enter:", scene.name);
			scene.visible = true;
		};

		scene.exit = ()=>{
			//paused = true;
			//console.log("exit:", this.name);
			//this.visible = false;

			console.log("exit:", scene.name);
			scene.visible = false;
		};

		info = new PIXI.Text("Новая игра", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		info.anchor.set(0.5);
		info.position.set(logicalWidth / 2, 64);
		scene.addChild(info);

		let btn = getButton(254, 64, 0x333333);
		btn.anchor.set(0.5);
		btn.position.set(logicalWidth / 2, 150);
		scene.addChild(btn);

		btn.click = ()=>{
			//paused = true;
			//gameInfo.visible = false;
			//gamePaused.visible = true;

			setScene(gameScene);
		};

		let label = new PIXI.Text("Начать", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label.anchor.set(0.5);
		label.position.set(logicalWidth / 2, 150);
		scene.addChild(label);

		return scene;
	}

	function addGamePaused() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);

		scene.name = "gamePaused";
		scene.visible = false;

		scene.enter = ()=>{
			//paused = false;
			console.log("enter:", scene.name);
			scene.visible = true;
		};

		scene.exit = ()=>{
			//paused = true;
			console.log("exit:", scene.name);
			scene.visible = false;
		};

		let t = new PIXI.Text("Пауза...", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		t.anchor.set(0.5);
		t.position.set(logicalWidth / 2, 64);
		scene.addChild(t);

		let btn1 = getButton(230, 64, 0x333333);
		btn1.anchor.set(0.5);
		btn1.position.set(logicalWidth / 2 - 120, 150);
		scene.addChild(btn1);

		btn1.click = ()=>{
			//paused = false;
			//gameInfo.visible = true;
			//gamePaused.visible = false;

			setScene(gameInfo);
		};

		let label1 = new PIXI.Text("Новая", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label1.anchor.set(0.5);
		label1.position.set(logicalWidth / 2 - 120, 150);
		scene.addChild(label1);

		let btn2 = getButton(230, 64, 0x333333);
		btn2.anchor.set(0.5);
		btn2.position.set(logicalWidth / 2 + 120, 150);
		scene.addChild(btn2);

		btn2.click = ()=>{
			//gamePaused.visible = false;
			//resetGame();

			setScene(gameScene);
		};

		let label2 = new PIXI.Text("Дальше", new PIXI.TextStyle({ fontFamily: "Arial", fontSize: 32, fill: "white"}));
		label2.anchor.set(0.5);
		label2.position.set(logicalWidth / 2 + 120, 150);
		scene.addChild(label2);

		return scene;
	}

	function addGameOverScene() {
		let scene = new PIXI.Container();
		mainContainer.addChild(scene);

		scene.name = "gameOverScene";
		scene.visible = false;

		scene.enter = ()=>{
			//paused = false;
			console.log("enter:", scene.name);
			scene.visible = true;
		};

		scene.exit = ()=>{
			//paused = true;
			console.log("exit:", scene.name);
			scene.visible = false;
		};

		message = new PIXI.Text("Game Over", new PIXI.TextStyle({ fontFamily: "Futura", fontSize: 64, fill: "white"}));
		message.anchor.set(0.5);
		message.position.set(logicalWidth / 2, 64);
		scene.addChild(message);

		let btn = getButton(254, 64, 0x333333);
		btn.anchor.set(0.5);
		btn.position.set(logicalWidth / 2, 150);
		scene.addChild(btn);

		btn.click = ()=>{
			//resetGame();

			setScene(gameScene);
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
