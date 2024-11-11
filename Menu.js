class Menu extends Phaser.Scene {
    constructor() {
        super({key:'Menu'});

        this.menuSound;
    }


    preload() {

        this.load.audio('menuSound', 'assets/menuSound.mp3');
    }

    create() {

        this.menuSound = this.sound.add('menuSound');
        this.menuSound.play();

        const playButton = this.add.text(400, 250, 'JOUER', {
            fill: 'white'
        })
        .setOrigin(0.5)
        .setInteractive();

        const settingsButton = this.add.text(400, 350, 'PARAMÈTRES', {
            fill: 'white'
        })
        .setOrigin(0.5)
        .setInteractive();

        playButton.on('pointerdown', () => {
            this.menuSound.stop();
            this.scene.start('Game');
        });

        settingsButton.on('pointerdown', () => {
            this.menuSound.stop();
            this.scene.start('Settings');
        });

        playButton.on('pointerover', () => {
            playButton.setStyle({ fill: 'yellow' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ fill: 'white' });
        });

        settingsButton.on('pointerover', () => {
            settingsButton.setStyle({ fill: 'yellow' });
        });

        settingsButton.on('pointerout', () => {
            settingsButton.setStyle({ fill: 'white' });
        });
    }
}
