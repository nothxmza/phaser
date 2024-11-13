class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
        this.keyBindings = {
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,  
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT, 
            up: Phaser.Input.Keyboard.KeyCodes.UP,    
            down: Phaser.Input.Keyboard.KeyCodes.DOWN  
        };
        this.menuSound;
    }

    preload() {
        this.load.audio('menuSound', 'assets/menuSound.mp3');
    }

    create() {
        this.menuSound = this.sound.add('menuSound');
        this.menuSound.play();
        this.add.text(400, 100, 'Paramètres des touches', {
            fontSize: '32px',
            fill: 'white'
        }).setOrigin(0.5);

        this.add.text(300, 200, 'Gauche :', { fontSize: '24px', fill: 'white' });
        this.add.text(300, 250, 'Droite :', { fontSize: '24px', fill: 'white' });
        this.add.text(300, 300, 'Haut :', { fontSize: '24px', fill: 'white' });
        this.add.text(300, 350, 'Bas :', { fontSize: '24px', fill: 'white' });

        this.leftKeyText = this.add.text(450, 200, this.keyBindings.left, { fontSize: '24px', fill: 'yellow' });
        this.rightKeyText = this.add.text(450, 250, this.keyBindings.right, { fontSize: '24px', fill: 'yellow' });
        this.upKeyText = this.add.text(450, 300, this.keyBindings.up, { fontSize: '24px', fill: 'yellow' });
        this.downKeyText = this.add.text(450, 350, this.keyBindings.down, { fontSize: '24px', fill: 'yellow' });

        this.add.text(400, 400, 'Cliquez sur un texte pour changer la touche', {
            fontSize: '18px',
            fill: 'white'
        }).setOrigin(0.5);

        const backButton = this.add.text(400, 500, 'Retour', {
            fontSize: '24px',
            fill: 'white'
        }).setOrigin(0.5).setInteractive();
        backButton.on('pointerdown', () => {
            this.menuSound.stop();
            this.scene.start('Menu');
        });

        this.leftKeyText.setInteractive();
        this.rightKeyText.setInteractive();
        this.upKeyText.setInteractive();
        this.downKeyText.setInteractive();

        this.leftKeyText.on('pointerdown', () => this.changeKey('left'));
        this.rightKeyText.on('pointerdown', () => this.changeKey('right'));
        this.upKeyText.on('pointerdown', () => this.changeKey('up'));
        this.downKeyText.on('pointerdown', () => this.changeKey('down'));

        this.input.keyboard.on('keydown', (event) => {
            if (this.changingKey) {
                this.keyBindings[this.changingKey] = event.keyCode;
                this.updateKeyText(this.changingKey, this.getKeyName(event.keyCode));
                this.changingKey = null;
            }
        });

        this.changingKey = null;
    }

    getKeyName(keyCode) {
        switch (keyCode) {
            case Phaser.Input.Keyboard.KeyCodes.LEFT:
                return 'ArrowLeft';
            case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                return 'ArrowRight';
            case Phaser.Input.Keyboard.KeyCodes.UP:
                return 'ArrowUp';
            case Phaser.Input.Keyboard.KeyCodes.DOWN:
                return 'ArrowDown';
            case Phaser.Input.Keyboard.KeyCodes.SPACE:
                return 'Space';
            case Phaser.Input.Keyboard.KeyCodes.ENTER:
                return 'Enter';
            case Phaser.Input.Keyboard.KeyCodes.SHIFT:
                return 'Shift';
            case Phaser.Input.Keyboard.KeyCodes.Q:
                return 'Q';
            case Phaser.Input.Keyboard.KeyCodes.W:
                return 'W';
            case Phaser.Input.Keyboard.KeyCodes.E:
                return 'E';
            case Phaser.Input.Keyboard.KeyCodes.D:
                return 'D';
            case Phaser.Input.Keyboard.KeyCodes.A:
                return 'A';
            case Phaser.Input.Keyboard.KeyCodes.S:
                return 'S';
            case Phaser.Input.Keyboard.KeyCodes.D:
                return 'D';
            default:
                return 'Unknown';
        }
    }

    changeKey(direction) {
        this.changingKey = direction;
        this.updateKeyText(direction, 'Press a key...');
    }

    updateKeyText(direction, key) {
        switch (direction) {
            case 'left':
                this.leftKeyText.setText(key);
                break;
            case 'right':
                this.rightKeyText.setText(key);
                break;
            case 'up':
                this.upKeyText.setText(key);
                break;
            case 'down':
                this.downKeyText.setText(key);
                break;
        }
    }

    getKeyBindings() {
        return this.keyBindings;
    }
}
