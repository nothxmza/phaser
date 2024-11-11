class Game extends Phaser.Scene {
	constructor() {
		super('Game' );
		this.widthWindow = window.innerWidth;
		this.heightWindow = window.innerHeight;
		this.player;
		this.platforms;
		this.cursors;
		this.score = 0;
		this.scoreText;
		this.bombs;
		this.gameOver = false;
		this.round = 1;
		this.gameOverText;
		this.megaBomb;
		this.victoryText;
		this.roundText;
		this.statusShield;
		this.shield;
		this.hasShield = false;
		this.bombSound;
		this.ambientSound;
		this.shieldSound;
		this.starsSound;
		this.loseSound;
		this.victorySound;
	}

	preload() {
		this.load.image('sky', 'assets/fond.png');
		this.load.image('ground', 'assets/platform2.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('bomb', 'assets/bomb.png');
		this.load.image("megaBomb", 'assets/Mega_Bomb.png');
		this.load.spritesheet('dude', 'assets/dude1.png', { frameWidth: 32, frameHeight: 40 });
		this.load.image('shield', 'assets/shield.png');
		this.load.audio('bombSound', 'assets/bombSound.mp3');
		this.load.audio('ambientSound', 'assets/ambientSound.mp3');
		this.load.audio('shieldSound', 'assets/shieldSound.mp3');
		this.load.audio('starsSound', 'assets/starsSound.mp3');
		this.load.audio('loseSound', 'assets/loseSound.mp3');
		this.load.audio('victorySound', 'assets/victorySound.mp3');
	}

	create() {

		this.sound.volume = 1;
		console.log('Mute status:', this.sound.mute)
		let settingsScene = this.scene.get('Settings');
        if (settingsScene) {
            this.keyBindings = settingsScene.getKeyBindings();
			console.log(this.keyBindings)
        }

		this.cursors = {
			left: this.input.keyboard.addKey(this.keyBindings.left),
			right: this.input.keyboard.addKey(this.keyBindings.right),
			up: this.input.keyboard.addKey(this.keyBindings.up),
			down: this.input.keyboard.addKey(this.keyBindings.down)
		};
		
		let background = this.add.image(0, 0, 'sky');
		background.setOrigin(0, 0);
		background.displayWidth = this.sys.game.config.width;
		background.displayHeight = this.sys.game.config.height;
		// this.add.image(400, 300, 'sky');

		this.bombSound = this.sound.add('bombSound', { volume: 0.2 });
		this.ambientSound = this.sound.add('ambientSound', { volume: 0.3, loop: true });
		this.shieldSound = this.sound.add('shieldSound', { volume: 0.5 });
		this.starsSound = this.sound.add('starsSound', { volume: 0.5 });
		this.loseSound = this.sound.add('loseSound', { volume: 0.6 });
		this.victorySound = this.sound.add('victorySound', { volume: 0.6 });
		this.ambientSound.play();

		this.returnButton = this.add.text(this.widthWindow - 50, 50, 'Retour', {
			fontSize: '18px',
			fill: 'white'
		})
		.setInteractive()
		.setOrigin(1, 0)
		.on('pointerdown', () => this.returnToMenu());


		this.platforms = this.physics.add.staticGroup();

		this.platforms.create(0, this.heightWindow, 'ground').setScale(this.widthWindow, 1).refreshBody();

		this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 650, 'ground');
		this.platforms.create(300, 550, 'ground').setScale(0.1, 2).refreshBody();
		this.platforms.create(370, 260, 'ground').setScale(0.1, 2).refreshBody();
		this.platforms.create(100, 460, 'ground').setScale(0.1, 2).refreshBody();
		this.platforms.create(200, 300, 'ground').setScale(0.1, 2).refreshBody();
		this.platforms.create(1000, 300, 'ground').setScale(0.1, 2).refreshBody();
		this.platforms.create(1250, 400, 'ground').setScale(0.5,1).refreshBody();
		this.platforms.create(650, 220, 'ground');
		this.platforms.create(120, 120, 'ground');
		this.platforms.create(970, 560, 'ground');
		this.platforms.create(1300, 740, 'ground');
		this.platforms.create(600, 700, 'ground');

		this.player = this.physics.add.sprite(100, 450, 'dude');

		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),//utilise les images 0, 1, 2 et 3
			frameRate: 10, // 10 images par seconde
			repeat: -1 //pour boucler
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		this.physics.add.collider(this.player, this.platforms);

		// this.cursors = this.input.keyboard.createCursorKeys();

		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 4,
			setXY: { x: this.widthWindow / 2 - 300, y: 0, stepX: 70 }
		});

		this.stars.children.iterate(function (child) {

			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

		});
		this.physics.add.collider(this.stars, this.platforms);//collider ajoute une collision
		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);//overlap gere les interaction entre 2 objets juste quand sa touche

		this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'white' });
		
		// Dessiner le  status shield
		this.statusShield = this.add.graphics();
		this.statusShield.setDepth(10);
		this.statusShield.setScrollFactor(0);
		
		this.statusShield.fillStyle(0xFFFFFF, 1);
		this.statusShield.fillRect(10, 50, 200, 20);

		//le shield
		this.shield = this.physics.add.group();

		let shieldX = Phaser.Math.Between(0, this.widthWindow);
		let shieldY = Phaser.Math.Between(0, this.heightWindow);
		this.shield.create(shieldX, shieldY, 'shield');

		this.physics.add.collider(this.shield, this.platforms);
		this.physics.add.overlap(this.player, this.shield, this.collectShield, null, this);

		///Les bombes
		this.bombs = this.physics.add.group();

		this.physics.add.collider(this.bombs, this.platforms);
		this.physics.add.collider(this.player, this.bombs, this.hitBomb,null, this);

		this.megaBomb = this.physics.add.group();

		this.physics.add.collider(this.megaBomb, this.platforms);
		this.physics.add.collider(this.player, this.megaBomb, this.hitMegaBomb,null, this);

		//Text round
		this.roundText =  this.add.text(this.widthWindow / 2, this.heightWindow / 2 - 100, "Round 1", { fontSize: '64px', fill: 'white' })
		.setOrigin(0.5)
		.setVisible(false)

		//TEXT Fin de game
		this.gameOverText = this.add.text(this.widthWindow / 2, this.heightWindow / 2 - 100, 'GAME OVER', { fontSize: '64px', fill: 'red' })
		.setOrigin(0.5)
		.setVisible(false);

		this.retryButton = this.add.text(this.widthWindow / 2, this.heightWindow / 2, 'Relancer', { fontSize: '32px', fill: '#ffffff', backgroundColor: '#000000', margin: 10, padding:10,zIndex:10 })
		.setInteractive()
		.setOrigin(0.5)
		.setVisible(false);

		this.retryButton.once('pointerdown', () => this.restartGame(this));

		this.victoryText = this.add.text(this.widthWindow / 2, this.heightWindow / 2 - 100, 'Victoire', { fontSize: '64px', fill: 'green' })
		.setOrigin(0.5)
		.setVisible(false);

		this.roundText.setVisible(true)
		setTimeout(() => {
			this.roundText.setVisible(false);
		}, 2000);
	}

	update() {
		if(this.gameOver){
			return
		}
		if (this.cursors.left.isDown)
			{
				this.player.setVelocityX(-160);
				this.player.anims.play('left', true);
			}
			else if (this.cursors.right.isDown)
			{
				this.player.setVelocityX(160);
				this.player.anims.play('right', true);
			}
			else
			{
				this.player.setVelocityX(0);
				this.player.anims.play('turn');
			}
		
			if (this.cursors.up.isDown && this.player.body.touching.down)
			{
				this.player.setVelocityY(-330);
			}
			else if (this.cursors.down.isDown){
				this.player.setVelocityY(330)
			}
	}

	collectStar(player, star) {
		star.disableBody(true, true);
		this.score += 10;
		this.scoreText.setText('score: ' + this.score);
		this.starsSound.play();

		if (this.stars.countActive(true) === 0)
		{
			if(this.round === 2){
				this.showVictory(this)
			}else{
				this.round += 1;
				this.roundText.setText(`Round ${this.round}`);
				this.roundText.setVisible(true);
				setTimeout(() => {
					this.roundText.setVisible(false);
				}, 2000);

				this.stars.children.iterate((child) => {
					child.enableBody(true, child.x, Phaser.Math.Between(0, this.heightWindow - 100), true, true);//reactive les etooiles
				});
	
				this.shield.create(Phaser.Math.Between(0, this.widthWindow), Phaser.Math.Between(0, this.heightWindow - 100),'shield')

				let x =  Phaser.Math.Between(0, 1000)
	
				let bomb = this.bombs.create(x, 1, 'bomb');
				bomb.setBounce(1);
				bomb.setCollideWorldBounds(true);//reste dans la scene
				bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);//la vitesse
	
				if(this.round === 2){
					let megaB = this.megaBomb.create(x, 1, 'megaBomb');
					megaB.setBounce(1);
					megaB.setCollideWorldBounds(true);
					megaB.setVelocity(Phaser.Math.Between(-200, 200), 60);
				}
			}
		}
		console.log(this.round)
	}

	hitBomb(player, bomb) {
		if(this.hasShield){
			this.statusShield.clear();
			this.statusShield.fillStyle(0xFFFFFF, 1);
			this.statusShield.fillRect(10, 50, 200, 20);
			this.hasShield = false;
			this.bombSound.play();
			bomb.destroy();
			return;
		}

		this.bombSound.play();
		this.physics.pause();


		this.player.setTint(0xff0000);
		this.loseSound.play();
		this.player.anims.play('turn');

		this.gameOver = true;
		this.gameOverText.setVisible(true)
		this.retryButton.setVisible(true)
	}

	hitMegaBomb(player, bomb) {
		this.bombSound.play();
		this.physics.pause();

		this.player.setTint(0xff0000);
		this.loseSound.play();
		this.player.anims.play('turn');

		this.gameOver = true;
		this.gameOverText.setVisible(true)
		this.retryButton.setVisible(true)
	}

	restartGame(scene) {
		this.gameOver = false;
		this.score = 0;
		this.round = 1;

		scene.anims.remove('left');
		scene.anims.remove('turn');
		scene.anims.remove('right');

		this.gameOverText.setVisible(false)
		this.retryButton.setVisible(false)
		scene.scene.restart();
	}

	showVictory(stop) {
		stop.physics.pause();
		this.victorySound.play();
		this.gameOver = true;
		this.victoryText.setVisible(true);
		this.retryButton.setVisible(true)
	}

	collectShield(player, shield) {
		this.shieldSound.play();
		shield.disableBody(true, true);
		this.hasShield = true;
		this.statusShield.fillStyle(0x0000FF, 1);
		this.statusShield.fillRect(10, 50, 200, 20);
	}

	returnToMenu() {
		this.ambientSound.stop();
		this.scene.start('Menu');
	}
	
	goToSettings() {
		this.scene.start('Settings');
	}
}