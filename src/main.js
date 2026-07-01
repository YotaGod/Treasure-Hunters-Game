import Phaser from 'phaser';

class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        this.activePopup = null;
        this.input.addPointer(3); // Enable multi-touch pointers for UI buttons and joystick
        const uiScale = 2.5;

        // --- HEALTH BAR UI ---
        this.healthUI = this.add.container(20, 30);

        // Fill behind the frame
        this.uiHealthFill = this.add.image(17 * uiScale, -1 * uiScale, 'ui_health_color')
            .setOrigin(0, 0.5)
            .setScale(2.34375 * uiScale, uiScale);
        this.fillMaxWidth = 32;

        // Frame pieces (1=left, 3=mid, 4=right)
        this.uiHealthBar1 = this.add.image(0, 0, 'ui_health_bar').setOrigin(0, 0.5).setScale(uiScale);
        this.uiHealthBar2 = this.add.image(32 * uiScale, 0, 'ui_health_bar_mid').setOrigin(0, 0.5).setScale(uiScale);
        this.uiHealthBar3 = this.add.image(64 * uiScale, 0, 'ui_health_bar_end').setOrigin(0, 0.5).setScale(uiScale);

        this.healthUI.add([this.uiHealthBar1, this.uiHealthBar2, this.uiHealthBar3, this.uiHealthFill]);

        // --- COIN UI ---
        this.coinUI = this.add.container(540, 30);

        // Banner pieces (1=left, 13=mid, 2=right)
        this.uiCoinBanner1 = this.add.image(0, 0, 'ui_coin_banner').setOrigin(0, 0.5).setScale(uiScale);
        this.uiCoinBanner2 = this.add.image(32 * uiScale, 0, 'ui_coin_banner_mid').setOrigin(0, 0.5).setScale(uiScale);
        this.uiCoinBanner3 = this.add.image(64 * uiScale, 0, 'ui_coin_banner_end').setOrigin(0, 0.5).setScale(uiScale);

        // Add coin icon inside the wooden board, centered vertically (offset from center is -1.5px)
        this.uiCoinIcon = this.add.sprite(36 * uiScale, -1.5 * uiScale, 'coin_1').setOrigin(0.5, 0.5).setScale(0.8 * uiScale);
        this.uiCoinIcon.play('coin_anim');

        // Add text to the right of the coin icon
        this.scoreText = this.add.text(46 * uiScale, -1.5 * uiScale, ': 0', {
            fontSize: '24px', fill: '#000', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        this.coinUI.add([this.uiCoinBanner1, this.uiCoinBanner2, this.uiCoinBanner3, this.uiCoinIcon, this.scoreText]);

        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('updateScore', (score) => {
            this.scoreText.setText(': ' + score);
        });

        gameScene.events.on('updateHealth', (health) => {
            const maxHealth = 5;
            const ratio = Math.max(0, health / maxHealth);
            this.uiHealthFill.setCrop(0, 0, this.fillMaxWidth * ratio, this.uiHealthFill.height);
        });

        gameScene.events.on('gameOver', () => {
            this.activePopup = 'gameOver';
            const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

            // Pop-up container
            const popup = this.add.container(400, 300);

            // Wooden board panel (128x128 scaled by 2.5x -> 320x320)
            const panel = this.add.image(0, 0, 'ui_board').setScale(2.5);

            // Title "Yah, Kalah!"
            const title = this.add.text(0, -85, 'Yah, Kalah!', {
                fontSize: '32px', fill: '#FFF', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5).setStroke('#000', 4);

            // "Ulangi" Button
            const btnUlangi = this.add.image(0, -10, 'ui_button').setScale(2.1, 0.6).setInteractive({ useHandCursor: true });
            const txtUlangi = this.add.text(0, -10, 'Ulangi', {
                fontSize: '16px', fill: '#000', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnUlangi.on('pointerover', () => btnUlangi.setTint(0xdddddd));
            btnUlangi.on('pointerout', () => btnUlangi.clearTint());
            btnUlangi.on('pointerdown', () => {
                gameScene.scene.restart({ level: gameScene.currentLevel, resetCheckpoint: false });
                this.scene.restart();
            });

            // "Keluar" Button
            const btnKeluar = this.add.image(0, 60, 'ui_button').setScale(2.1, 0.6).setInteractive({ useHandCursor: true });
            const txtKeluar = this.add.text(0, 60, 'Keluar', {
                fontSize: '16px', fill: '#000', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnKeluar.on('pointerover', () => btnKeluar.setTint(0xdddddd));
            btnKeluar.on('pointerout', () => btnKeluar.clearTint());
            btnKeluar.on('pointerdown', () => {
                window.location.reload(); // Refresh the page to return to initial screen
            });

            popup.add([panel, title, btnUlangi, txtUlangi, btnKeluar, txtKeluar]);

            // Pop-up intro animation
            popup.setScale(0);
            this.tweens.add({
                targets: popup,
                scale: 1,
                duration: 350,
                ease: 'Back.easeOut'
            });
        });

        gameScene.events.on('levelComplete', () => {
            this.activePopup = 'levelComplete';
            const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);
            const currentLevel = gameScene.currentLevel || 1;

            // Pop-up container
            const popup = this.add.container(400, 300);

            // Wooden board panel
            const panel = this.add.image(0, 0, 'ui_board').setScale(2.5);

            // Title "Level Selesai!"
            const title = this.add.text(0, -95, 'Level Selesai!', {
                fontSize: '32px', fill: '#FFF', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5).setStroke('#000', 4);

            // 1. "Stage Selanjutnya" Button
            let nextLevel = 1;
            if (currentLevel === 1) nextLevel = 2;
            else if (currentLevel === 2) nextLevel = 3;
            else if (currentLevel === 3) nextLevel = 4;
            else if (currentLevel === 4) nextLevel = 5;
            else if (currentLevel === 5) nextLevel = 6;
            else if (currentLevel === 6) nextLevel = 7;
            else if (currentLevel === 7) nextLevel = 8;
            else if (currentLevel === 8) nextLevel = 9;
            else if (currentLevel === 9) nextLevel = 10;
            else if (currentLevel === 10) nextLevel = 1;

            const btnSelanjutnya = this.add.image(0, -35, 'ui_button').setScale(2.1, 0.6).setInteractive({ useHandCursor: true });
            const txtSelanjutnya = this.add.text(0, -35, 'Stage Selanjutnya', {
                fontSize: '16px', fill: '#000', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnSelanjutnya.on('pointerover', () => btnSelanjutnya.setTint(0xdddddd));
            btnSelanjutnya.on('pointerout', () => btnSelanjutnya.clearTint());
            btnSelanjutnya.on('pointerdown', () => {
                gameScene.scene.restart({ level: nextLevel, resetCheckpoint: true });
                this.scene.restart();
            });

            // 2. "Ulangi Stage" Button
            const btnUlangi = this.add.image(0, 25, 'ui_button').setScale(2.1, 0.6).setInteractive({ useHandCursor: true });
            const txtUlangi = this.add.text(0, 25, 'Ulangi Stage', {
                fontSize: '16px', fill: '#000', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnUlangi.on('pointerover', () => btnUlangi.setTint(0xdddddd));
            btnUlangi.on('pointerout', () => btnUlangi.clearTint());
            btnUlangi.on('pointerdown', () => {
                gameScene.scene.restart({ level: currentLevel, resetCheckpoint: true });
                this.scene.restart();
            });

            // 3. "Keluar" Button
            const btnKeluar = this.add.image(0, 85, 'ui_button').setScale(2.1, 0.6).setInteractive({ useHandCursor: true });
            const txtKeluar = this.add.text(0, 85, 'Keluar', {
                fontSize: '16px', fill: '#000', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnKeluar.on('pointerover', () => btnKeluar.setTint(0xdddddd));
            btnKeluar.on('pointerout', () => btnKeluar.clearTint());
            btnKeluar.on('pointerdown', () => {
                window.location.reload();
            });

            popup.add([panel, title, btnSelanjutnya, txtSelanjutnya, btnUlangi, txtUlangi, btnKeluar, txtKeluar]);

            // Pop-up intro animation
            popup.setScale(0);
            this.tweens.add({
                targets: popup,
                scale: 1,
                duration: 350,
                ease: 'Back.easeOut'
            });
        });

        gameScene.events.on('gameVictory', () => {
            this.activePopup = 'gameVictory';
            const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

            // Pop-up container
            const popup = this.add.container(400, 300);

            // Wooden board panel (scaled up for final victory!)
            const panel = this.add.image(0, 0, 'ui_board').setScale(3.0);

            // Title
            const title = this.add.text(0, -115, 'TAMAT!', {
                fontSize: '36px', fill: '#FFD700', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5).setStroke('#000', 5);

            // Message
            const msg = this.add.text(0, -60, 'Selamat!\nKamu Berhasil Menemukan\nSemua Harta Karun!', {
                fontSize: '18px', fill: '#FFF', fontFamily: 'Arial, sans-serif', fontStyle: 'bold', align: 'center'
            }).setOrigin(0.5).setStroke('#000', 3);

            // Score Display
            const finalScoreText = this.add.text(0, 5, `Total Skor: ${gameScene.score}`, {
                fontSize: '20px', fill: '#00FF00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5).setStroke('#000', 3);

            // "Menu Utama" Button
            const btnMenu = this.add.image(0, 75, 'ui_button').setScale(2.5, 0.7).setInteractive({ useHandCursor: true });
            const txtMenu = this.add.text(0, 75, 'Menu Utama', {
                fontSize: '16px', fill: '#000', fontFamily: 'Arial, sans-serif', fontStyle: 'bold'
            }).setOrigin(0.5);

            btnMenu.on('pointerover', () => btnMenu.setTint(0xdddddd));
            btnMenu.on('pointerout', () => btnMenu.clearTint());
            btnMenu.on('pointerdown', () => {
                // Restart back to level 1 and reset all checkpoint data
                gameScene.scene.restart({ level: 1, resetCheckpoint: true });
                this.scene.restart();
            });

            popup.add([panel, title, msg, finalScoreText, btnMenu, txtMenu]);

            // Animation
            popup.setScale(0);
            this.tweens.add({
                targets: popup,
                scale: 1,
                duration: 500,
                ease: 'Back.easeOut'
            });
        });

        // Initialize mobile inputs
        this.setupMobileControls();
    }

    setupMobileControls() {
        // --- Fullscreen Toggle Button (Always available for both Desktop & Mobile) ---
        const btnFullscreen = this.add.image(750, 110, 'btn_fullscreen').setScale(5).setInteractive({ useHandCursor: true });
        btnFullscreen.setScrollFactor(0);
        btnFullscreen.setDepth(100);
        btnFullscreen.setAlpha(0.8);

        // Draw a neat fullscreen icon on top of the button
        const fsIcon = this.add.graphics();
        fsIcon.lineStyle(2, 0xffffff, 1);
        // Top-left bracket
        fsIcon.moveTo(743, 105);
        fsIcon.lineTo(743, 101);
        fsIcon.lineTo(747, 101);
        // Top-right bracket
        fsIcon.moveTo(757, 105);
        fsIcon.lineTo(757, 101);
        fsIcon.lineTo(753, 101);
        // Bottom-left bracket
        fsIcon.moveTo(743, 115);
        fsIcon.lineTo(743, 119);
        fsIcon.lineTo(747, 119);
        // Bottom-right bracket
        fsIcon.moveTo(757, 115);
        fsIcon.lineTo(757, 119);
        fsIcon.lineTo(753, 119);
        fsIcon.strokePath();
        fsIcon.setScrollFactor(0);
        fsIcon.setDepth(101);

        btnFullscreen.on('pointerdown', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });

        this.scale.on('fullscreenchange', () => {
            if (this.scale.isFullscreen) {
                btnFullscreen.setTint(0x00ff00);
            } else {
                btnFullscreen.clearTint();
            }
        });

        // --- Touch controls (Only for touch/mobile devices) ---
        const isTouchDevice = this.sys.game.device.input.touch ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
            (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches);

        if (!isTouchDevice) return;

        this.joystickInput = { x: 0, y: 0 };
        this.mobileJump = false;
        this.mobileAttack = false;
        this.mobileSprint = false;

        // Joystick Base and Knob
        const joyBaseX = 120;
        const joyBaseY = 480;
        const maxRadius = 45;

        // Draw Joystick using Graphics
        const joyBase = this.add.graphics();
        joyBase.fillStyle(0x000000, 0.25);
        joyBase.lineStyle(4, 0xffffff, 0.35);
        joyBase.fillCircle(joyBaseX, joyBaseY, 60);
        joyBase.strokeCircle(joyBaseX, joyBaseY, 60);
        joyBase.setScrollFactor(0);
        joyBase.setDepth(100);

        const joyKnob = this.add.graphics();
        joyKnob.fillStyle(0xffffff, 0.5);
        joyKnob.lineStyle(3, 0xffffff, 0.8);
        joyKnob.fillCircle(0, 0, 30);
        joyKnob.strokeCircle(0, 0, 30);
        joyKnob.setPosition(joyBaseX, joyBaseY);
        joyKnob.setScrollFactor(0);
        joyKnob.setDepth(101);

        // Joystick Touch Zone
        const joyZone = this.add.zone(joyBaseX, joyBaseY, 150, 150).setInteractive();
        joyZone.setScrollFactor(0);

        let joystickPointer = null;

        const updateJoystick = (pointer) => {
            if (!pointer.isDown) return;
            const dx = pointer.x - joyBaseX;
            const dy = pointer.y - joyBaseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const angle = Math.atan2(dy, dx);
                const clampedDist = Math.min(distance, maxRadius);
                const knobX = joyBaseX + Math.cos(angle) * clampedDist;
                const knobY = joyBaseY + Math.sin(angle) * clampedDist;

                joyKnob.setPosition(knobX, knobY);

                this.joystickInput.x = Math.cos(angle) * (clampedDist / maxRadius);
                this.joystickInput.y = Math.sin(angle) * (clampedDist / maxRadius);
            }
        };

        joyZone.on('pointerdown', (pointer) => {
            joystickPointer = pointer;
            updateJoystick(pointer);
        });

        this.input.on('pointermove', (pointer) => {
            if (joystickPointer && pointer.id === joystickPointer.id) {
                updateJoystick(pointer);
            }
        });

        const resetJoystick = (pointer) => {
            if (joystickPointer && pointer.id === joystickPointer.id) {
                joystickPointer = null;
                joyKnob.setPosition(joyBaseX, joyBaseY);
                this.joystickInput.x = 0;
                this.joystickInput.y = 0;
            }
        };

        this.input.on('pointerup', resetJoystick);
        this.input.on('pointerupoutside', resetJoystick);

        // Draw Jump Button using Graphics
        const btnJump = this.add.container(720, 440);
        const bgJump = this.add.graphics();
        bgJump.fillStyle(0x3e2723, 0.5);
        bgJump.fillCircle(0, 0, 35);
        bgJump.lineStyle(3, 0xd7ccc8, 0.7);
        bgJump.strokeCircle(0, 0, 35);
        const txtJump = this.add.text(0, 0, '▲', { fontSize: '28px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
        btnJump.add([bgJump, txtJump]);
        const zoneJump = this.add.zone(0, 0, 70, 70).setInteractive();
        btnJump.add(zoneJump);
        btnJump.setScrollFactor(0).setDepth(100);

        // Draw Attack Button using Graphics
        const btnAttack = this.add.container(630, 500);
        const bgAttack = this.add.graphics();
        bgAttack.fillStyle(0x3e2723, 0.5);
        bgAttack.fillCircle(0, 0, 35);
        bgAttack.lineStyle(3, 0xd7ccc8, 0.7);
        bgAttack.strokeCircle(0, 0, 35);
        const txtAttack = this.add.text(0, 0, '⚔', { fontSize: '28px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
        btnAttack.add([bgAttack, txtAttack]);
        const zoneAttack = this.add.zone(0, 0, 70, 70).setInteractive();
        btnAttack.add(zoneAttack);
        btnAttack.setScrollFactor(0).setDepth(100);

        // Draw Sprint Button using Graphics
        const btnSprint = this.add.container(720, 340);
        const bgSprint = this.add.graphics();
        bgSprint.fillStyle(0x3e2723, 0.5);
        bgSprint.fillCircle(0, 0, 25);
        bgSprint.lineStyle(2, 0xd7ccc8, 0.7);
        bgSprint.strokeCircle(0, 0, 25);
        const txtSprint = this.add.text(0, 0, '⚡', { fontSize: '20px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
        btnSprint.add([bgSprint, txtSprint]);
        const zoneSprint = this.add.zone(0, 0, 50, 50).setInteractive();
        btnSprint.add(zoneSprint);
        btnSprint.setScrollFactor(0).setDepth(100);

        // Button events
        zoneJump.on('pointerdown', () => {
            this.mobileJump = true;
            bgJump.clear();
            bgJump.fillStyle(0x8d6e63, 0.8);
            bgJump.fillCircle(0, 0, 35);
            bgJump.lineStyle(3, 0xffffff, 1.0);
            bgJump.strokeCircle(0, 0, 35);
        });
        const releaseJump = () => {
            this.mobileJump = false;
            bgJump.clear();
            bgJump.fillStyle(0x3e2723, 0.5);
            bgJump.fillCircle(0, 0, 35);
            bgJump.lineStyle(3, 0xd7ccc8, 0.7);
            bgJump.strokeCircle(0, 0, 35);
        };
        zoneJump.on('pointerup', releaseJump);
        zoneJump.on('pointerout', releaseJump);

        zoneAttack.on('pointerdown', () => {
            this.mobileAttack = true;
            bgAttack.clear();
            bgAttack.fillStyle(0x8d6e63, 0.8);
            bgAttack.fillCircle(0, 0, 35);
            bgAttack.lineStyle(3, 0xffffff, 1.0);
            bgAttack.strokeCircle(0, 0, 35);
        });
        const releaseAttack = () => {
            bgAttack.clear();
            bgAttack.fillStyle(0x3e2723, 0.5);
            bgAttack.fillCircle(0, 0, 35);
            bgAttack.lineStyle(3, 0xd7ccc8, 0.7);
            bgAttack.strokeCircle(0, 0, 35);
        };
        zoneAttack.on('pointerup', releaseAttack);
        zoneAttack.on('pointerout', releaseAttack);

        zoneSprint.on('pointerdown', () => {
            this.mobileSprint = true;
            bgSprint.clear();
            bgSprint.fillStyle(0x8d6e63, 0.8);
            bgSprint.fillCircle(0, 0, 25);
            bgSprint.lineStyle(2, 0xffffff, 1.0);
            bgSprint.strokeCircle(0, 0, 25);
        });
        const releaseSprint = () => {
            this.mobileSprint = false;
            bgSprint.clear();
            bgSprint.fillStyle(0x3e2723, 0.5);
            bgSprint.fillCircle(0, 0, 25);
            bgSprint.lineStyle(2, 0xd7ccc8, 0.7);
            bgSprint.strokeCircle(0, 0, 25);
        };
        zoneSprint.on('pointerup', releaseSprint);
        zoneSprint.on('pointerout', releaseSprint);

        // Dynamic visibility updates
        this.btnSprint = btnSprint;
        this.btnAttack = btnAttack;
        this.btnSprint.setVisible(false);
        this.btnAttack.setVisible(false);
    }

    update() {
        const gameScene = this.scene.get('GameScene');
        if (gameScene) {
            const sprintUnlocked = this.registry.get('sprintUnlocked') === true;
            const swordUnlocked = this.registry.get('swordUnlocked') === true;
            if (this.btnSprint) this.btnSprint.setVisible(sprintUnlocked);
            if (this.btnAttack) this.btnAttack.setVisible(swordUnlocked);

            // Handle gamepad menu navigation
            const pad = (this.input.gamepad && this.input.gamepad.total > 0) ? this.input.gamepad.getPad(0) : null;
            const padConnected = pad && pad.connected;
            if (padConnected && this.activePopup) {
                const btnA = (pad.buttons[0] && pad.buttons[0].pressed) || false;
                const btnB = (pad.buttons[1] && pad.buttons[1].pressed) || (pad.buttons[9] && pad.buttons[9].pressed) || false;
                
                if (btnA && !this.lastBtnAPressed) {
                    if (this.activePopup === 'gameOver') {
                        this.activePopup = null;
                        gameScene.scene.restart({ level: gameScene.currentLevel, resetCheckpoint: false });
                        this.scene.restart();
                    } else if (this.activePopup === 'levelComplete') {
                        let nextLevel = 1;
                        const currentLevel = gameScene.currentLevel || 1;
                        if (currentLevel === 1) nextLevel = 2;
                        else if (currentLevel === 2) nextLevel = 3;
                        else if (currentLevel === 3) nextLevel = 4;
                        else if (currentLevel === 4) nextLevel = 5;
                        else if (currentLevel === 5) nextLevel = 6;
                        else if (currentLevel === 6) nextLevel = 7;
                        else if (currentLevel === 7) nextLevel = 8;
                        else if (currentLevel === 8) nextLevel = 9;
                        else if (currentLevel === 9) nextLevel = 10;
                        else if (currentLevel === 10) nextLevel = 1;
                        
                        this.activePopup = null;
                        gameScene.scene.restart({ level: nextLevel, resetCheckpoint: true });
                        this.scene.restart();
                    } else if (this.activePopup === 'gameVictory') {
                        this.activePopup = null;
                        gameScene.scene.restart({ level: 1, resetCheckpoint: true });
                        this.scene.restart();
                    }
                }
                if (btnB && !this.lastBtnBPressed) {
                    if (this.activePopup === 'levelComplete') {
                        this.activePopup = null;
                        gameScene.scene.restart({ level: gameScene.currentLevel, resetCheckpoint: true });
                        this.scene.restart();
                    }
                }
                this.lastBtnAPressed = btnA;
                this.lastBtnBPressed = btnB;
            } else if (padConnected) {
                this.lastBtnAPressed = (pad.buttons[0] && pad.buttons[0].pressed) || false;
                this.lastBtnBPressed = (pad.buttons[1] && pad.buttons[1].pressed) || (pad.buttons[9] && pad.buttons[9].pressed) || false;
            }
        }
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        if (data && data.level !== undefined) {
            this.currentLevel = data.level;
            localStorage.setItem('treasure_hunters_level', this.currentLevel);
        } else {
            const savedLevel = localStorage.getItem('treasure_hunters_level');
            this.currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        }

        // Reset checkpoint if level changed or resetCheckpoint is requested
        if ((data && data.resetCheckpoint) || this.lastLevel !== this.currentLevel) {
            this.checkpointX = 100;
            this.checkpointY = 400;
            this.lastLevel = this.currentLevel;
        } else {
            this.checkpointX = this.checkpointX || 100;
            this.checkpointY = this.checkpointY || 400;
        }
        this.score = 0;
        this.health = 5;
        this.isGameOver = false;
        this.isLevelComplete = false;
        this.hasKey = false;

        if (this.currentLevel === 1) {
            this.registry.set('sprintUnlocked', false);
            this.registry.set('swordUnlocked', false);
        } else if (this.currentLevel === 2) {
            this.registry.set('sprintUnlocked', true);
            this.registry.set('swordUnlocked', false);
        } else {
            this.registry.set('sprintUnlocked', true);
            this.registry.set('swordUnlocked', true);
        }

        this.touchControls = {
            left: false,
            right: false,
            jump: false,
            attack: false,
            sprint: false
        };
    }

    preload() {
        for (let i = 1; i <= 5; i++) this.load.image(`idle_${i}`, `assets/player/Captain Clown Nose/Captain Clown Nose without Sword/01-Idle/Idle 0${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`run_${i}`, `assets/player/Captain Clown Nose/Captain Clown Nose without Sword/02-Run/Run 0${i}.png`);
        for (let i = 1; i <= 3; i++) this.load.image(`jump_${i}`, `assets/player/Captain Clown Nose/Captain Clown Nose without Sword/03-Jump/Jump 0${i}.png`);
        this.load.image('fall_1', 'assets/player/Captain Clown Nose/Captain Clown Nose without Sword/04-Fall/Fall 01.png');

        for (let i = 1; i <= 9; i++) this.load.image(`crabby_idle_${i}`, `assets/enemies/Crabby/01-Idle/Idle 0${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`crabby_run_${i}`, `assets/enemies/Crabby/02-Run/Run 0${i}.png`);

        for (let i = 1; i <= 4; i++) this.load.image(`coin_${i}`, `assets/items/Gold Coin/0${i}.png`);

        for (let i = 1; i <= 9; i++) this.load.image(`flag_${i}`, `assets/environment/Objects/Flag/Flag 0${i}.png`);

        for (let i = 1; i <= 8; i++) this.load.image(`map_${i}`, `assets/items/Small Maps/Small Map 1/0${i}.png`);

        // Captain with Sword animations
        for (let i = 1; i <= 5; i++) this.load.image(`idle_sword_${i}`, `assets/player/Captain Clown Nose/Captain Clown Nose with Sword/09-Idle Sword/Idle Sword 0${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`run_sword_${i}`, `assets/player/Captain Clown Nose/Captain Clown Nose with Sword/10-Run Sword/Run Sword 0${i}.png`);
        for (let i = 1; i <= 3; i++) this.load.image(`jump_sword_${i}`, `assets/player/Captain Clown Nose/Captain Clown Nose with Sword/11-Jump Sword/Jump Sword 0${i}.png`);
        this.load.image('fall_sword_1', 'assets/player/Captain Clown Nose/Captain Clown Nose with Sword/12-Fall Sword/Fall Sword 01.png');
        for (let i = 1; i <= 3; i++) this.load.image(`attack_sword_${i}`, `assets/player/Captain Clown Nose/Captain Clown Nose with Sword/15-Attack 1/Attack 1 0${i}.png`);

        // Sword Effects
        for (let i = 1; i <= 3; i++) this.load.image(`sword_effect_${i}`, `assets/player/Captain Clown Nose/Sword Effects/24-Attack 1/Attack 1 0${i}.png`);

        // Spinning Sword Item (for Stage 2 unlock)
        for (let i = 1; i <= 4; i++) this.load.image(`sword_item_${i}`, `assets/player/Captain Clown Nose/Sword/22-Sword Spinning/Sword Spinning 0${i}.png`);

        // Spikes
        this.load.image('spikes', 'assets/environment/Objects/Spikes/Spikes.png');

        // Cannon
        this.load.image('cannon_idle', 'assets/Shooter Traps/Cannon/Cannon Idle/1.png');
        for (let i = 1; i <= 6; i++) this.load.image(`cannon_fire_${i}`, `assets/Shooter Traps/Cannon/Cannon Fire/${i}.png`);
        this.load.image('cannon_ball', 'assets/Shooter Traps/Cannon/Cannon Ball Idle/1.png');
        for (let i = 1; i <= 7; i++) this.load.image(`cannon_explosion_${i}`, `assets/Shooter Traps/Cannon/Cannon Ball Explosion/${i}.png`);

        // Breakables: Barrel
        this.load.image('barrel_idle', 'assets/Merchant Ship/Barrel/Idle/1.png');
        for (let i = 1; i <= 4; i++) this.load.image(`barrel_hit_${i}`, `assets/Merchant Ship/Barrel/Hit/${i}.png`);
        for (let i = 1; i <= 5; i++) this.load.image(`barrel_destroyed_${i}`, `assets/Merchant Ship/Barrel/Destroyed/${i}.png`);

        // Breakables: Box
        this.load.image('box_idle', 'assets/Merchant Ship/Box/Idle/1.png');
        for (let i = 1; i <= 4; i++) this.load.image(`box_hit_${i}`, `assets/Merchant Ship/Box/Hit/${i}.png`);
        for (let i = 1; i <= 5; i++) this.load.image(`box_destroyed_${i}`, `assets/Merchant Ship/Box/Destroyed/${i}.png`);

        // Gems
        for (let i = 1; i <= 4; i++) this.load.image(`blue_diamond_${i}`, `assets/Pirate Treasure/Blue Diamond/0${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`red_diamond_${i}`, `assets/Pirate Treasure/Red Diamond/0${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`green_diamond_${i}`, `assets/Pirate Treasure/Green Diamond/0${i}.png`);
        this.load.image('red_potion', 'assets/Pirate Treasure/Red Potion/01.png');

        // Fierce Tooth Enemy
        for (let i = 1; i <= 8; i++) this.load.image(`fierce_tooth_idle_${i}`, `assets/enemies/Fierce Tooth/01-Idle/Idle 0${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`fierce_tooth_run_${i}`, `assets/enemies/Fierce Tooth/02-Run/Run 0${i}.png`);
        for (let i = 1; i <= 3; i++) this.load.image(`fierce_tooth_anticipation_${i}`, `assets/enemies/Fierce Tooth/06-Anticipation/Anticipation 0${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`fierce_tooth_hit_${i}`, `assets/enemies/Fierce Tooth/08-Hit/Hit 0${i}.png`);

        // Gold Chest & Key
        this.load.image('chest_idle', 'assets/Merchant Ship/Chest/Idle/1.png');
        for (let i = 1; i <= 8; i++) this.load.image(`chest_unlocked_${i}`, `assets/Merchant Ship/Chest/Unlocked/${i}.png`);
        for (let i = 1; i <= 8; i++) this.load.image(`chest_key_${i}`, `assets/Merchant Ship/Chest Key/Idle/${i}.png`);
        this.load.image('golden_skull', 'assets/Pirate Treasure/Golden Skull/01.png');

        this.load.spritesheet('terrain', 'assets/environment/Terrain/Terrain (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('world_terrain', 'assets/tileset/world_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('bg_color', 'assets/environment/Background/BG Image.png');
        this.load.image('bg_clouds', 'assets/environment/Background/Big Clouds.png');

        // New character animations
        for (let i = 1; i <= 26; i++) this.load.image(`new_idle_${i}`, `assets/character/player_idle/${i}.png`);
        for (let i = 1; i <= 14; i++) this.load.image(`new_run_${i}`, `assets/character/player_run/${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`new_jump_${i}`, `assets/character/player_jump/${i}.png`);

        // New collectibles
        this.load.image('ancient_coin', 'assets/collection/Coin.png');
        this.load.image('master_key', 'assets/collection/Key.png');

        // Back Palm Trees
        for (let i = 1; i <= 4; i++) {
            this.load.image(`palm_back_regular_${i}`, `assets/environment/Back Palm Trees/Back Palm Tree Regular 0${i}.png`);
            this.load.image(`palm_back_left_${i}`, `assets/environment/Back Palm Trees/Back Palm Tree Left 0${i}.png`);
            this.load.image(`palm_back_right_${i}`, `assets/environment/Back Palm Trees/Back Palm Tree Right 0${i}.png`);
        }

        // Ship Helm
        for (let i = 1; i <= 6; i++) {
            this.load.image(`ship_helm_idle_${i}`, `assets/environment/Objects/Ship Helm/Ship Helm Idle 0${i}.png`);
        }

        // Walkable Front Palm Trees
        this.load.spritesheet('palm_trunk', 'assets/environment/Front Palm Trees/Front Palm Bottom and Grass (32x32).png', { frameWidth: 32, frameHeight: 32 });
        for (let i = 1; i <= 4; i++) {
            this.load.image(`palm_top_${i}`, `assets/environment/Front Palm Trees/Front Palm Tree Top 0${i}.png`);
        }

        this.load.image('ui_health_bar', 'assets/ui/Life Bars/Big Bars/1.png');
        this.load.image('ui_health_bar_mid', 'assets/ui/Life Bars/Big Bars/3.png');
        this.load.image('ui_health_bar_end', 'assets/ui/Life Bars/Big Bars/4.png');
        this.load.image('ui_health_color', 'assets/ui/Life Bars/Colors/1.png');

        this.load.image('ui_coin_banner', 'assets/ui/Small Banner/1.png');
        this.load.image('ui_coin_banner_mid', 'assets/ui/Small Banner/13.png');
        this.load.image('ui_coin_banner_end', 'assets/ui/Small Banner/2.png');

        // Popup UI Assets
        this.load.image('ui_board', 'assets/ui/Prefabs/6.png');
        this.load.image('ui_button', 'assets/ui/Prefabs/8.png');

        // Mobile Buttons Assets
        this.load.image('btn_jump', 'assets/ui/Mobile Buttons/Mobile Buttons/5.png');
        this.load.image('btn_attack', 'assets/ui/Mobile Buttons/Mobile Buttons/6.png');
        this.load.image('btn_fullscreen', 'assets/ui/Yellow Button/1.png');
        this.load.audio('backsound', 'assets/music/backsound.m4a');
    }

    create() {
        if (!this.scene.isActive('UIScene')) {
            this.scene.launch('UIScene');
        }

        // Play continuous background music
        if (!this.sound.get('backsound')) {
            const bgm = this.sound.add('backsound', { loop: true, volume: 0.4 });
            bgm.play();
        } else {
            const bgm = this.sound.get('backsound');
            if (!bgm.isPlaying) {
                bgm.play();
            }
        }

        // Only create animations if they don't exist
        if (!this.anims.exists('idle')) {
            // New character animations
            const newIdleFrames = [];
            for (let i = 1; i <= 26; i++) newIdleFrames.push({ key: `new_idle_${i}` });
            this.anims.create({ key: 'new_player_idle', frames: newIdleFrames, frameRate: 15, repeat: -1 });

            const newRunFrames = [];
            for (let i = 1; i <= 14; i++) newRunFrames.push({ key: `new_run_${i}` });
            this.anims.create({ key: 'new_player_run', frames: newRunFrames, frameRate: 15, repeat: -1 });

            const newJumpFrames = [];
            for (let i = 1; i <= 4; i++) newJumpFrames.push({ key: `new_jump_${i}` });
            this.anims.create({ key: 'new_player_jump', frames: newJumpFrames.slice(0, 3), frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'new_player_fall', frames: [{ key: 'new_jump_4' }], frameRate: 10, repeat: -1 });

            this.anims.create({ key: 'idle', frames: [{ key: 'idle_1' }, { key: 'idle_2' }, { key: 'idle_3' }, { key: 'idle_4' }, { key: 'idle_5' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'run', frames: [{ key: 'run_1' }, { key: 'run_2' }, { key: 'run_3' }, { key: 'run_4' }, { key: 'run_5' }, { key: 'run_6' }], frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'jump', frames: [{ key: 'jump_1' }, { key: 'jump_2' }, { key: 'jump_3' }], frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'fall', frames: [{ key: 'fall_1' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'crabby_idle', frames: [{ key: 'crabby_idle_1' }, { key: 'crabby_idle_2' }, { key: 'crabby_idle_3' }, { key: 'crabby_idle_4' }, { key: 'crabby_idle_5' }, { key: 'crabby_idle_6' }, { key: 'crabby_idle_7' }, { key: 'crabby_idle_8' }, { key: 'crabby_idle_9' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'crabby_run', frames: [{ key: 'crabby_run_1' }, { key: 'crabby_run_2' }, { key: 'crabby_run_3' }, { key: 'crabby_run_4' }, { key: 'crabby_run_5' }, { key: 'crabby_run_6' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'coin_anim', frames: [{ key: 'coin_1' }, { key: 'coin_2' }, { key: 'coin_3' }, { key: 'coin_4' }], frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'flag_anim', frames: [{ key: 'flag_1' }, { key: 'flag_2' }, { key: 'flag_3' }, { key: 'flag_4' }, { key: 'flag_5' }, { key: 'flag_6' }, { key: 'flag_7' }, { key: 'flag_8' }, { key: 'flag_9' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'map_anim', frames: [{ key: 'map_1' }, { key: 'map_2' }, { key: 'map_3' }, { key: 'map_4' }, { key: 'map_5' }, { key: 'map_6' }, { key: 'map_7' }, { key: 'map_8' }], frameRate: 8, repeat: -1 });

            // Captain with Sword animations
            this.anims.create({ key: 'idle_sword', frames: [{ key: 'idle_sword_1' }, { key: 'idle_sword_2' }, { key: 'idle_sword_3' }, { key: 'idle_sword_4' }, { key: 'idle_sword_5' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'run_sword', frames: [{ key: 'run_sword_1' }, { key: 'run_sword_2' }, { key: 'run_sword_3' }, { key: 'run_sword_4' }, { key: 'run_sword_5' }, { key: 'run_sword_6' }], frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'jump_sword', frames: [{ key: 'jump_sword_1' }, { key: 'jump_sword_2' }, { key: 'jump_sword_3' }], frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'fall_sword', frames: [{ key: 'fall_sword_1' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'attack_sword', frames: [{ key: 'attack_sword_1' }, { key: 'attack_sword_2' }, { key: 'attack_sword_3' }], frameRate: 15, repeat: 0 });

            // Sword effect and item animations
            this.anims.create({ key: 'sword_effect', frames: [{ key: 'sword_effect_1' }, { key: 'sword_effect_2' }, { key: 'sword_effect_3' }], frameRate: 15, repeat: 0 });
            this.anims.create({ key: 'sword_item_anim', frames: [{ key: 'sword_item_1' }, { key: 'sword_item_2' }, { key: 'sword_item_3' }, { key: 'sword_item_4' }], frameRate: 8, repeat: -1 });

            // Cannon animations
            this.anims.create({ key: 'cannon_fire', frames: [{ key: 'cannon_fire_1' }, { key: 'cannon_fire_2' }, { key: 'cannon_fire_3' }, { key: 'cannon_fire_4' }, { key: 'cannon_fire_5' }, { key: 'cannon_fire_6' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'cannon_explosion', frames: [{ key: 'cannon_explosion_1' }, { key: 'cannon_explosion_2' }, { key: 'cannon_explosion_3' }, { key: 'cannon_explosion_4' }, { key: 'cannon_explosion_5' }, { key: 'cannon_explosion_6' }, { key: 'cannon_explosion_7' }], frameRate: 12, repeat: 0 });

            // Breakable Box & Barrel animations
            this.anims.create({ key: 'barrel_hit', frames: [{ key: 'barrel_hit_1' }, { key: 'barrel_hit_2' }, { key: 'barrel_hit_3' }, { key: 'barrel_hit_4' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'barrel_destroyed', frames: [{ key: 'barrel_destroyed_1' }, { key: 'barrel_destroyed_2' }, { key: 'barrel_destroyed_3' }, { key: 'barrel_destroyed_4' }, { key: 'barrel_destroyed_5' }], frameRate: 12, repeat: 0 });

            this.anims.create({ key: 'box_hit', frames: [{ key: 'box_hit_1' }, { key: 'box_hit_2' }, { key: 'box_hit_3' }, { key: 'box_hit_4' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'box_destroyed', frames: [{ key: 'box_destroyed_1' }, { key: 'box_destroyed_2' }, { key: 'box_destroyed_3' }, { key: 'box_destroyed_4' }, { key: 'box_destroyed_5' }], frameRate: 12, repeat: 0 });

            // Gems animations
            this.anims.create({ key: 'blue_diamond_anim', frames: [{ key: 'blue_diamond_1' }, { key: 'blue_diamond_2' }, { key: 'blue_diamond_3' }, { key: 'blue_diamond_4' }], frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'red_diamond_anim', frames: [{ key: 'red_diamond_1' }, { key: 'red_diamond_2' }, { key: 'red_diamond_3' }, { key: 'red_diamond_4' }], frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'green_diamond_anim', frames: [{ key: 'green_diamond_1' }, { key: 'green_diamond_2' }, { key: 'green_diamond_3' }, { key: 'green_diamond_4' }], frameRate: 8, repeat: -1 });

            // Fierce Tooth animations
            this.anims.create({ key: 'fierce_tooth_idle', frames: [{ key: 'fierce_tooth_idle_1' }, { key: 'fierce_tooth_idle_2' }, { key: 'fierce_tooth_idle_3' }, { key: 'fierce_tooth_idle_4' }, { key: 'fierce_tooth_idle_5' }, { key: 'fierce_tooth_idle_6' }, { key: 'fierce_tooth_idle_7' }, { key: 'fierce_tooth_idle_8' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'fierce_tooth_run', frames: [{ key: 'fierce_tooth_run_1' }, { key: 'fierce_tooth_run_2' }, { key: 'fierce_tooth_run_3' }, { key: 'fierce_tooth_run_4' }, { key: 'fierce_tooth_run_5' }, { key: 'fierce_tooth_run_6' }], frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'fierce_tooth_anticipation', frames: [{ key: 'fierce_tooth_anticipation_1' }, { key: 'fierce_tooth_anticipation_2' }, { key: 'fierce_tooth_anticipation_3' }], frameRate: 8, repeat: 0 });
            this.anims.create({ key: 'fierce_tooth_hit', frames: [{ key: 'fierce_tooth_hit_1' }, { key: 'fierce_tooth_hit_2' }, { key: 'fierce_tooth_hit_3' }, { key: 'fierce_tooth_hit_4' }], frameRate: 12, repeat: 0 });

            // Chest & Key animations
            this.anims.create({ key: 'chest_key_idle', frames: [{ key: 'chest_key_1' }, { key: 'chest_key_2' }, { key: 'chest_key_3' }, { key: 'chest_key_4' }, { key: 'chest_key_5' }, { key: 'chest_key_6' }, { key: 'chest_key_7' }, { key: 'chest_key_8' }], frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'chest_unlocked', frames: [{ key: 'chest_unlocked_1' }, { key: 'chest_unlocked_2' }, { key: 'chest_unlocked_3' }, { key: 'chest_unlocked_4' }, { key: 'chest_unlocked_5' }, { key: 'chest_unlocked_6' }, { key: 'chest_unlocked_7' }, { key: 'chest_unlocked_8' }], frameRate: 12, repeat: 0 });

            // Back Palm Trees animations
            this.anims.create({
                key: 'palm_regular',
                frames: [
                    { key: 'palm_back_regular_1' },
                    { key: 'palm_back_regular_2' },
                    { key: 'palm_back_regular_3' },
                    { key: 'palm_back_regular_4' }
                ],
                frameRate: 6,
                repeat: -1
            });
            this.anims.create({
                key: 'palm_left',
                frames: [
                    { key: 'palm_back_left_1' },
                    { key: 'palm_back_left_2' },
                    { key: 'palm_back_left_3' },
                    { key: 'palm_back_left_4' }
                ],
                frameRate: 6,
                repeat: -1
            });
            this.anims.create({
                key: 'palm_right',
                frames: [
                    { key: 'palm_back_right_1' },
                    { key: 'palm_back_right_2' },
                    { key: 'palm_back_right_3' },
                    { key: 'palm_back_right_4' }
                ],
                frameRate: 6,
                repeat: -1
            });

            // Ship Helm animation
            this.anims.create({
                key: 'ship_helm',
                frames: [
                    { key: 'ship_helm_idle_1' },
                    { key: 'ship_helm_idle_2' },
                    { key: 'ship_helm_idle_3' },
                    { key: 'ship_helm_idle_4' },
                    { key: 'ship_helm_idle_5' },
                    { key: 'ship_helm_idle_6' }
                ],
                frameRate: 8,
                repeat: -1
            });

            // Walkable palm top animation
            this.anims.create({
                key: 'palm_top_anim',
                frames: [
                    { key: 'palm_top_1' },
                    { key: 'palm_top_2' },
                    { key: 'palm_top_3' },
                    { key: 'palm_top_4' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }

        // Expand world to 4800
        const worldWidth = 4800;

        const bgImg = this.add.image(worldWidth / 2, 300, 'bg_color').setScale(80, 10).setScrollFactor(0);
        bgImg.setDepth(-10);
        this.clouds = this.add.tileSprite(worldWidth / 2, 350, worldWidth, 120, 'bg_clouds').setScrollFactor(0.2, 0.1);
        this.clouds.setDepth(-9);

        // Warning Alert for ledges
        this.warningAlert = this.add.text(0, 0, '⚠️ AWAS JURANG!', {
            fontSize: '11px',
            fill: '#ff3333',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setVisible(false).setDepth(10);

        this.platforms = this.physics.add.staticGroup();
        this.spikes = this.physics.add.staticGroup();
        this.cannons = this.physics.add.staticGroup();

        // Helper to create spike
        const createSpike = (x, y) => {
            const spike = this.spikes.create(x, y, 'spikes');
            spike.body.setSize(32, 16);
            spike.body.setOffset(0, 16);
            return spike;
        };

        // Create floors with gaps based on level
        for (let i = 0; i < worldWidth; i += 32) {
            let isGap = false;
            if (this.currentLevel === 1) {
                isGap = (i > 600 && i < 700) ||
                    (i > 1400 && i < 1550) ||
                    (i > 2200 && i < 2400) ||
                    (i > 2800 && i < 3100) ||
                    (i > 3600 && i < 3900);
            } else if (this.currentLevel === 2) {
                isGap = (i > 450 && i < 650) ||
                    (i > 1100 && i < 1400) || // 300px gap - requires sprint
                    (i > 1900 && i < 2200) || // 300px gap - requires sprint
                    (i > 2700 && i < 3000) || // 300px gap - requires sprint
                    (i > 3500 && i < 3950);   // 450px gap - requires jumping across stepping stones
            } else { // Level 3 (Combat and traps)
                isGap = (i > 300 && i < 600) ||
                    (i > 1000 && i < 1300) ||
                    (i > 1700 && i < 2000) ||
                    (i > 2500 && i < 2900) ||
                    (i > 3400 && i < 3800);
            }
            if (isGap) {
                if (this.currentLevel >= 3 && i < 2400) {
                    createSpike(i + 16, 584);
                }
                continue;
            }
            if (this.currentLevel >= 6) {
                this.platforms.create(i + 16, 584, 'world_terrain', 1);
            } else {
                this.platforms.create(i + 16, 584, 'terrain', 1);
            }
        }

        // Left boundary wall
        for (let y = 584 - 32; y >= -32; y -= 32) {
            const wallTexture = this.currentLevel >= 6 ? 'world_terrain' : 'terrain';
            this.platforms.create(16, y, wallTexture, 18);
        }

        // Create groups
        this.coins = this.physics.add.group({ allowGravity: false, immovable: true });
        this.ancientCoins = this.physics.add.group({ allowGravity: false, immovable: true });
        this.enemies = this.physics.add.group();
        this.breakables = this.physics.add.group({ allowGravity: true, immovable: true });
        this.cannonBalls = this.physics.add.group({ allowGravity: false });
        this.loots = this.physics.add.group({ allowGravity: true });
        this.goldChests = this.physics.add.staticGroup();
        this.chestKeys = this.physics.add.group({ allowGravity: false, immovable: true });
        this.masterKeys = this.physics.add.group({ allowGravity: false, immovable: true });

        // Helper to create a walkable palm tree with solid leaves at the top
        const createWalkableTree = (x, y, trunkCount, coinCount = 0) => {
            const adjustedY = y + 40;
            for (let i = 0; i < trunkCount; i++) {
                const trunkY = adjustedY - 40 - (i * 80);
                const trunk = this.add.image(x, trunkY, 'palm_trunk', 3).setScale(2.5);
                trunk.setDepth(-5);
            }

            const topY = adjustedY - (trunkCount * 80) - 40;
            const topSprite = this.add.sprite(x, topY, 'palm_top_1');
            topSprite.setScale(2.5);
            topSprite.play('palm_top_anim');
            topSprite.setDepth(-5);

            const solidY = topY - 20;
            const platform = this.platforms.create(x, solidY, 'terrain', 1);
            platform.setVisible(false);
            platform.refreshBody();
            platform.body.setSize(90, 20);
            platform.body.setOffset(-29, 6);
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;

            // Spawn coins on top of the leaves
            for (let i = 0; i < coinCount; i++) {
                const coinX = x + (i - (coinCount - 1) / 2) * 24;
                const coin = this.coins.create(coinX, solidY - 22, 'coin_1');
                coin.play('coin_anim');
            }

            return { topSprite, platform };
        };

        // Helper to draw horizontal platforms
        const createPlatform = (x, y, width) => {
            for (let i = 0; i < width; i++) {
                let frameIndex = 1;
                if (i === 0) frameIndex = 0;
                else if (i === width - 1) frameIndex = 2;
                this.platforms.create(x + (i * 32), y, 'terrain', frameIndex);
            }
        };

        const createWorldPlatform = (x, y, width) => {
            for (let i = 0; i < width; i++) {
                let frameIndex = 1; // Middle tile
                if (i === 0) frameIndex = 0; // Left tile
                else if (i === width - 1) frameIndex = 2; // Right tile
                this.platforms.create(x + (i * 32), y, 'world_terrain', frameIndex);
            }
        };

        const addAncientCoinsToPlatform = (startX, y, count) => {
            for (let i = 0; i < count; i++) {
                const coin = this.ancientCoins.create(startX + (i * 32), y - 18, 'ancient_coin');
                coin.body.setSize(16, 16);
            }
        };

        const addCoinsToPlatform = (startX, y, count) => {
            for (let i = 0; i < count; i++) {
                const coin = this.coins.create(startX + (i * 32), y - 18, 'coin_1');
                coin.play('coin_anim');
            }
        };

        const createCrabby = (x, y) => {
            const crab = this.enemies.create(x, y, 'crabby_idle_1');
            crab.play('crabby_run');
            crab.setVelocityX(this.currentLevel === 2 ? -75 : -50);
            crab.body.setSize(24, 20);
            crab.body.setOffset(24, 10);
            crab.enemyType = 'crabby';
            crab.hp = 1;
            return crab;
        };

        const createFierceTooth = (x, y) => {
            const tooth = this.enemies.create(x, y, 'fierce_tooth_idle_1');
            tooth.play('fierce_tooth_run');
            tooth.setVelocityX(-60);
            tooth.body.setSize(24, 26);
            tooth.body.setOffset(16, 6);
            tooth.enemyType = 'fierce_tooth';
            tooth.hp = 2;
            tooth.isChasing = false;
            tooth.isAnticipating = false;
            return tooth;
        };

        // Cannon trap helper
        const createCannon = (x, y, direction) => {
            const cannon = this.cannons.create(x, y, 'cannon_idle');
            cannon.flipX = direction === 'right';
            cannon.shootTimer = this.time.addEvent({
                delay: 2500,
                callback: () => {
                    if (this.isGameOver || this.isLevelComplete) return;
                    cannon.play('cannon_fire');
                    this.time.delayedCall(400, () => {
                        if (this.isGameOver || this.isLevelComplete) return;
                        const ballX = cannon.x + (cannon.flipX ? 24 : -24);
                        const ballY = cannon.y - 2;
                        const ball = this.cannonBalls.create(ballX, ballY, 'cannon_ball');
                        ball.setVelocityX(cannon.flipX ? 200 : -200);
                        ball.body.setSize(10, 10);
                    });
                },
                loop: true
            });
            return cannon;
        };

        // Breakables helper
        const createBreakable = (x, y, type) => {
            const prop = this.breakables.create(x, y, `${type}_idle`);
            prop.body.allowGravity = true;
            prop.body.setImmovable(true);
            prop.hp = 2;
            prop.propType = type;

            prop.takeHit = () => {
                if (prop.hp <= 0) return;
                prop.hp--;
                if (prop.hp > 0) {
                    prop.play(`${type}_hit`);
                    prop.once('animationcomplete', () => {
                        prop.setTexture(`${type}_idle`);
                    });
                } else {
                    prop.body.enable = false;
                    prop.play(`${type}_destroyed`);
                    // Drop loot
                    this.time.delayedCall(300, () => {
                        this.spawnLoot(prop.x, prop.y);
                    });
                    prop.once('animationcomplete', () => {
                        prop.destroy();
                    });
                }
            };
            return prop;
        };

        // Create Checkpoint group
        this.checkpoints = this.physics.add.staticGroup();

        const createCheckpoint = (x, y) => {
            const cp = this.checkpoints.create(x, y, 'flag_1');
            if (this.checkpointX === x) {
                cp.setAlpha(1).clearTint();
                cp.play('flag_anim');
            } else {
                cp.setAlpha(0.5).setTint(0x5555ff);
            }
            return cp;
        };

        if (this.currentLevel === 1) {
            // Level 1 platforms
            createPlatform(250, 490, 3);
            createPlatform(400, 400, 2);
            createPlatform(550, 490, 4);
            createPlatform(750, 400, 3);
            createPlatform(950, 310, 3);
            createPlatform(1150, 400, 2);
            createPlatform(1350, 310, 3);
            createWalkableTree(1580 + 16, 568, 1, 1); // Replaced platform with walkable tree
            createPlatform(1700, 400, 6);
            createPlatform(1950, 310, 5);
            createPlatform(2500, 490, 1);
            createWalkableTree(2650 + 16, 568, 2, 1); // Replaced platform with walkable tree
            createPlatform(2800, 310, 1);
            createPlatform(3050, 450, 5);
            createPlatform(3300, 360, 5);
            createPlatform(3550, 450, 4);
            createPlatform(3850, 490, 6);

            // Level 1 enemies
            createCrabby(850, 450);
            createCrabby(1750, 350); // placed on platform (1700, 400)
            createCrabby(2000, 260); // placed on platform (1950, 310)
            createCrabby(3350, 310); // placed on platform (3300, 360)
            createCrabby(4100, 400);

            // Level 1 coins
            addCoinsToPlatform(250, 490, 3);
            addCoinsToPlatform(400, 400, 2);
            addCoinsToPlatform(550, 490, 4);
            addCoinsToPlatform(750, 400, 3);
            addCoinsToPlatform(950, 310, 3);
            addCoinsToPlatform(1150, 400, 2);
            addCoinsToPlatform(1350, 310, 3);
            addCoinsToPlatform(1700, 400, 6);
            addCoinsToPlatform(1950, 310, 5);
            addCoinsToPlatform(2500, 490, 1);
            addCoinsToPlatform(2800, 310, 1);
            addCoinsToPlatform(3050, 450, 3);
            addCoinsToPlatform(3300, 360, 5);

            // Level 1 Checkpoint at 1700
            createCheckpoint(1700, 337.5);

            // Level 1 Finish Line at 4000
            this.finishFlag = this.physics.add.sprite(4000, 427.5, 'flag_1');

            // Level 1 Sprint Map Unlocker at 3900
            this.sprintMap = this.physics.add.sprite(3900, 472, 'map_1');
            this.sprintMap.body.allowGravity = false;
            this.sprintMap.body.setImmovable(true);
            this.sprintMap.play('map_anim');
        } else if (this.currentLevel === 2) {
            // Level 2 (Harder layout) platforms
            createPlatform(200, 480, 2);
            createPlatform(380, 390, 4);
            createPlatform(550, 490, 2);
            createPlatform(750, 400, 5);
            createPlatform(980, 310, 4);
            createPlatform(1200, 420, 2);
            createPlatform(1500, 350, 5);
            createWalkableTree(1750 + 16, 568, 1, 1); // Replaced platform with walkable tree
            createPlatform(1850, 400, 5);
            createPlatform(2050, 300, 4);
            createPlatform(2300, 490, 1);
            createPlatform(2450, 400, 1);
            createPlatform(2600, 310, 1);
            createPlatform(2850, 420, 2);
            createPlatform(3100, 330, 5);
            createPlatform(3400, 450, 1);
            createWalkableTree(3550 + 16, 568, 2, 1); // Replaced platform with walkable tree
            createPlatform(3700, 300, 3);
            createPlatform(3850, 370, 1);
            createPlatform(4000, 450, 7);

            // Level 2 enemies (more challenging placements)
            createCrabby(380, 350);
            createCrabby(750, 360);
            createCrabby(1500, 300);
            createCrabby(1850, 350);
            createCrabby(3100, 280);
            createCrabby(4100, 400);
            createCrabby(4200, 400);

            // Level 2 coins (expanded to match new platform lengths)
            addCoinsToPlatform(200, 480, 2);
            addCoinsToPlatform(380, 390, 4);
            addCoinsToPlatform(550, 490, 2);
            addCoinsToPlatform(750, 400, 5);
            addCoinsToPlatform(980, 310, 4);
            addCoinsToPlatform(1200, 420, 2);
            addCoinsToPlatform(1500, 350, 5);
            addCoinsToPlatform(1850, 400, 5);
            addCoinsToPlatform(2050, 300, 4);
            addCoinsToPlatform(2600, 310, 1);
            addCoinsToPlatform(2850, 420, 2);
            addCoinsToPlatform(3100, 330, 5);
            addCoinsToPlatform(3700, 300, 3);
            addCoinsToPlatform(3850, 370, 1);
            addCoinsToPlatform(4000, 450, 6);

            // Level 2 Checkpoint at 1850
            createCheckpoint(1850, 337.5);

            // Level 2 Finish Line at 4100
            this.finishFlag = this.physics.add.sprite(4100, 387.5, 'flag_1');

            // Level 2 Sword Unlocker at 4000
            this.swordItem = this.physics.add.sprite(4000, 432, 'sword_item_1');
        } else if (this.currentLevel === 3) {
            // Level 3 (Combat and traps layout) platforms & elements
            createPlatform(200, 480, 2);
            createPlatform(400, 400, 2);
            // Breakable box and barrel at the start of level 3 for practice
            createBreakable(220, 500, 'box');
            createBreakable(260, 500, 'barrel');

            // Extra upper platforms to allow more exploration paths
            createPlatform(300, 300, 4);
            addCoinsToPlatform(300, 300, 4);

            createPlatform(700, 490, 5);
            createPlatform(900, 400, 3);

            // Extra upper platforms to allow more exploration paths
            createPlatform(900, 260, 3);
            addCoinsToPlatform(900, 260, 3);

            createPlatform(1150, 490, 2);
            createPlatform(1350, 400, 6);
            // Breakable barrel on 1350
            createBreakable(1400, 368, 'barrel');

            // Extra upper platforms to allow more exploration paths
            createPlatform(1350, 260, 4);
            addCoinsToPlatform(1350, 260, 4);

            createPlatform(1600, 310, 2);
            createPlatform(1850, 450, 3);
            // Breakable box on 1850
            createBreakable(1900, 418, 'box');

            createPlatform(2100, 360, 3);

            createPlatform(2400, 490, 1);
            createWalkableTree(2550 + 16, 568, 2, 1); // Replaced platform with walkable tree
            createPlatform(2700, 310, 1);
            createPlatform(2950, 450, 7);
            // Breakables on 2950
            createBreakable(3000, 418, 'barrel');
            createBreakable(3050, 418, 'box');

            createPlatform(3200, 360, 3);

            // Extra upper platforms to allow more exploration paths
            createPlatform(3200, 240, 4);
            addCoinsToPlatform(3200, 240, 4);

            createWalkableTree(3450 + 16, 568, 1, 1); // Replaced platform with walkable tree
            createPlatform(3600, 370, 1);
            createPlatform(3750, 450, 4);

            // Level 3 Checkpoint at 1850
            createCheckpoint(1850, 387.5);

            // Level 3 Finish Line at 4100 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4100, 521.5, 'flag_1');

            // Level 3 enemies (Crabbies patrolling platforms)
            createCrabby(750, 450);
            createCrabby(1400, 350);
            createCrabby(3050, 400);
            createCrabby(4100, 550);

            // Level 3 coins
            addCoinsToPlatform(200, 480, 2);
            addCoinsToPlatform(400, 400, 2);
            addCoinsToPlatform(700, 490, 5);
            addCoinsToPlatform(1150, 490, 2);
            addCoinsToPlatform(1350, 400, 6);
            addCoinsToPlatform(1600, 310, 2);
            addCoinsToPlatform(2950, 450, 7);
        } else if (this.currentLevel === 4) { // Stage 4: Chest & Key + Fierce Tooth
            // Level 4 platforms
            createPlatform(200, 480, 2);

            // Extra upper platforms to allow more exploration paths
            createPlatform(350, 280, 4);
            addCoinsToPlatform(350, 280, 4);

            createPlatform(450, 400, 3);
            createPlatform(750, 310, 4);
            createPlatform(1000, 420, 3);

            // Extra upper platforms to allow more exploration paths
            createPlatform(1000, 220, 4);
            addCoinsToPlatform(1000, 220, 4);

            createPlatform(1300, 330, 6);
            createWalkableTree(1600 + 32, 568, 1, 2); // Replaced platform with walkable tree

            // Extra upper platforms to allow more exploration paths
            createPlatform(1600, 250, 4);
            addCoinsToPlatform(1600, 250, 4);

            createPlatform(1850, 370, 3);
            createPlatform(2100, 280, 6);
            createWalkableTree(2400 + 32, 568, 1, 2); // Replaced platform with walkable tree

            // Extra upper platforms to allow more exploration paths
            createPlatform(2650, 230, 4);
            addCoinsToPlatform(2650, 230, 4);

            createPlatform(2650, 370, 5);
            createPlatform(2950, 480, 3);
            createPlatform(3200, 390, 6);
            createWalkableTree(3500 + 32, 568, 1, 2); // Replaced platform with walkable tree

            // Extra upper platforms to allow more exploration paths
            createPlatform(3700, 260, 4);
            addCoinsToPlatform(3700, 260, 4);

            createPlatform(3700, 400, 3);
            createPlatform(3900, 490, 5);
            createPlatform(4200, 450, 6);

            // Level 4 enemies
            createCrabby(800, 250);
            createFierceTooth(1350, 280);
            createFierceTooth(2180, 230); // Guarding key!
            createCrabby(2700, 320);
            createFierceTooth(3250, 340);
            createCrabby(4250, 400);

            // Level 4 coins
            addCoinsToPlatform(200, 480, 2);
            addCoinsToPlatform(450, 400, 3);
            addCoinsToPlatform(750, 310, 4);
            addCoinsToPlatform(1000, 420, 3);
            addCoinsToPlatform(1300, 330, 6);
            addCoinsToPlatform(1850, 370, 3);
            addCoinsToPlatform(2100, 280, 6);
            addCoinsToPlatform(2650, 370, 5);
            addCoinsToPlatform(2950, 480, 3);
            addCoinsToPlatform(3200, 390, 6);
            addCoinsToPlatform(3700, 400, 3);
            addCoinsToPlatform(3900, 490, 3);
            addCoinsToPlatform(4200, 450, 6);

            // Level 4 breakables
            createBreakable(1050, 388, 'barrel');
            createBreakable(1880, 338, 'box');
            createBreakable(2980, 448, 'barrel');
            createBreakable(3020, 448, 'box');

            // Level 4 Chest and Key
            this.chestKey = this.chestKeys.create(2180, 230, 'chest_key_1'); // shifted key slightly to center on platform
            this.chestKey.play('chest_key_idle');

            this.goldChest = this.goldChests.create(4000, 458, 'chest_idle');
            this.goldChest.body.setSize(30, 32);
            this.goldChest.refreshBody();

            // Level 4 Checkpoint at 1850
            createCheckpoint(1850, 310);

            // Level 4 Finish Line at 4400 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4400, 521.5, 'flag_1');
        } else if (this.currentLevel === 5) { // Stage 5: The Pirate Ship Finale
            // Gaps are: (i > 300 && i < 600) || (i > 1000 && i < 1300) || (i > 1700 && i < 2000) || (i > 2500 && i < 2900) || (i > 3400 && i < 3800)
            
            // Starting platform (deck cabin)
            createPlatform(200, 490, 3);
            
            // Bridge platform over Gap1 (300-600)
            createPlatform(350, 490, 2); // Bridge to cross Gap1
            
            // Upper deck structure
            createPlatform(500, 380, 5);
            addCoinsToPlatform(500, 380, 5);

            createPlatform(900, 420, 3);
            createBreakable(950, 388, 'box');
            
            createPlatform(1100, 310, 4);
            addCoinsToPlatform(1100, 310, 4);

            // Stepping planks over a large gap
            createPlatform(1550, 450, 1);
            createPlatform(1750, 380, 1);
            createPlatform(1950, 450, 2);
            
            // Checkpoint flag in the middle
            createCheckpoint(2000, 387.5); // platform height is 450 (450 - 62.5 = 387.5)
            
            // Upper rigging / mast platform
            createPlatform(1700, 230, 6);
            addCoinsToPlatform(1700, 230, 6);
            createWalkableTree(1800 + 16, 568, 2, 1); // Walkable tree as mast to climb to upper platform

            // Middle section ship deck
            createPlatform(2200, 310, 4);
            createFierceTooth(2250, 260);

            // Bridge platforms over Gap4 (2500-2900)
            createPlatform(2550, 480, 1); // Stepping stone for Gap4
            createPlatform(2700, 450, 1); // Stepping stone for Gap4

            // Double vertical cannons (left/right firing)
            createCannon(2650, 380, 'left');
            createCannon(2750, 360, 'right');

            createPlatform(2800, 420, 4);
            addCoinsToPlatform(2800, 420, 4);

            // Main mast climbing section
            createPlatform(3100, 300, 3);
            createWalkableTree(3150 + 16, 568, 3, 2); // Tall mast to climb to the treasure platform!

            // Bridge walkable tree over Gap5 (3400-3800)
            createWalkableTree(3500 + 16, 568, 2, 1); // Walkable tree to cross Gap5

            // Final treasure deck platform
            createPlatform(3650, 250, 6);
            addCoinsToPlatform(3650, 250, 6);
            createFierceTooth(3750, 200); // Guarding key at Y=250

            createPlatform(3700, 450, 5);
            
            // Key and Chest
            this.chestKey = this.chestKeys.create(3800, 200, 'chest_key_1');
            this.chestKey.play('chest_key_idle');

            this.goldChest = this.goldChests.create(4100, 418, 'chest_idle'); // platform at 450 (450 - 32 = 418)
            this.goldChest.body.setSize(30, 32);
            this.goldChest.refreshBody();

            // Enemies patrol
            createCrabby(850, 550);
            createCrabby(2850, 380);
            createCrabby(3800, 550);

            // Level 5 Finish Line at 4400 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4400, 521.5, 'flag_1');
        } else if (this.currentLevel === 6) { // Stage 6: Arrival at Uncharted Island
            // Gaps are: (i > 300 && i < 600) || (i > 1000 && i < 1300) || (i > 1700 && i < 2000) || (i > 2500 && i < 2900) || (i > 3400 && i < 3800)
            
            // World 2 terrain elements using createWorldPlatform
            createWorldPlatform(200, 480, 2);
            addAncientCoinsToPlatform(200, 480, 2);

            // Bridge platforms over Gap1 (300-600)
            createWorldPlatform(400, 490, 2); // Bridge to cross Gap1

            createWorldPlatform(600, 400, 3);
            createBreakable(650, 368, 'barrel');

            createWorldPlatform(750, 310, 4);
            addAncientCoinsToPlatform(750, 310, 4);

            createWorldPlatform(1000, 420, 3);
            createFierceTooth(1050, 370);

            // Rigging and climbing sections (trees acting as climbs)
            createWorldPlatform(1300, 330, 4);
            createWalkableTree(1450 + 16, 568, 2, 2); // Walkable tree to climb to upper platforms

            createWorldPlatform(1600, 250, 4);
            addAncientCoinsToPlatform(1600, 250, 4);

            createWorldPlatform(1850, 370, 3);
            
            // Checkpoint flag
            createCheckpoint(1850, 307.5); // platform height is 370 (370 - 62.5 = 307.5)

            // Heavy combat deck (Fierce Tooth and Crabby guarding)
            createWorldPlatform(2100, 280, 5);
            createFierceTooth(2200, 230); // Guards key!

            // Bridge platform over Gap4 (2500-2900)
            createWorldPlatform(2550, 490, 2); // Bridge to cross Gap4

            createWorldPlatform(2700, 370, 5);
            addAncientCoinsToPlatform(2700, 370, 5);

            createWorldPlatform(2950, 480, 3);
            createBreakable(3000, 448, 'box');

            createWorldPlatform(3200, 390, 4);
            createCrabby(3250, 340);

            // Bridge platform over Gap5 (3400-3800)
            createWorldPlatform(3500, 490, 2); // Bridge to cross Gap5

            createWorldPlatform(3700, 260, 4);
            addAncientCoinsToPlatform(3700, 260, 4);

            createWorldPlatform(3700, 400, 3);
            createWorldPlatform(3900, 490, 5);

            // Chest & Key placement
            this.chestKey = this.masterKeys.create(2200, 230, 'master_key'); // Place the Master Key!
            this.chestKey.body.setSize(24, 24);

            this.goldChest = this.goldChests.create(4000, 458, 'chest_idle'); // platform at 490 (490 - 32 = 458)
            this.goldChest.body.setSize(30, 32);
            this.goldChest.refreshBody();

            // Enemies patrol
            createCrabby(800, 550);
            createCrabby(2800, 550);
            createCrabby(4100, 550);

            // Level 6 Finish Line at 4400 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4400, 521.5, 'flag_1');
        } else if (this.currentLevel === 7) { // Stage 7: The Treacherous Canopy
            // World 2 terrain elements using createWorldPlatform
            // Gaps are: (i > 300 && i < 600) || (i > 1000 && i < 1300) || (i > 1700 && i < 2000) || (i > 2500 && i < 2900) || (i > 3400 && i < 3800)
            
            // Start platform
            createWorldPlatform(200, 490, 2);

            // Bridge platform over Gap1 (300-600)
            createWorldPlatform(350, 490, 2); // Bridge to cross Gap1 start

            // Series of trees above the gaps to cross
            // 300 to 600 gap (spikes at Y=584)
            createWalkableTree(500, 568, 3, 2); // Top is at Y=304
            addAncientCoinsToPlatform(485, 240, 2);

            createWorldPlatform(700, 380, 4);
            createCrabby(750, 330);

            // 1000 to 1300 gap (spikes at Y=584)
            createWalkableTree(1150, 568, 4, 3); // Top is at Y=224
            addAncientCoinsToPlatform(1135, 160, 2);

            // Cannon firing at the player near tree 1150
            createCannon(900, 260, 'right');

            createWorldPlatform(1350, 330, 4);
            createBreakable(1400, 298, 'barrel');

            // 1700 to 2000 gap (spikes at Y=584)
            createWalkableTree(1850, 568, 3, 2); // Top is at Y=304

            createWorldPlatform(2100, 310, 4);
            // Checkpoint flag on this middle deck
            createCheckpoint(2100, 247.5); // platform height is 310 (310 - 62.5 = 247.5)
            createFierceTooth(2200, 260);

            // 2500 to 2900 gap (bottomless pit!)
            createWalkableTree(2600, 568, 4, 0); // Top is at Y=224, holds the Master Key!
            // Cannon firing across this pit
            createCannon(2450, 260, 'right');

            createWorldPlatform(2950, 350, 4);
            createBreakable(3000, 318, 'box');

            createWalkableTree(3150, 568, 3, 2); // Top is at Y=304

            // 3400 to 3800 gap (bottomless pit!)
            createWalkableTree(3550, 568, 2, 2); // Top is at Y=384

            createWorldPlatform(3900, 450, 5);

            // Key and Chest
            this.chestKey = this.masterKeys.create(2600, 184, 'master_key'); // 224 - 40 = 184 (4 trunks top palm leaf)
            this.chestKey.body.setSize(24, 24);

            this.goldChest = this.goldChests.create(4100, 418, 'chest_idle'); // platform at 450 (450 - 32 = 418)
            this.goldChest.body.setSize(30, 32);
            this.goldChest.refreshBody();

            // Additional Crabby patrolling ground at the end
            createCrabby(4150, 550);

            // Level 7 Finish Line at 4400 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4400, 521.5, 'flag_1');
        } else if (this.currentLevel === 8) { // Stage 8: The Gauntlet of Traps
            // Gaps are: (i > 300 && i < 600) || (i > 1000 && i < 1300) || (i > 1700 && i < 2000) || (i > 2500 && i < 2900) || (i > 3400 && i < 3800)
            
            // Start platform
            createWorldPlatform(200, 490, 2);

            // Bridge platform over Gap1 (300-600)
            createWorldPlatform(350, 490, 2); // Bridge to cross Gap1

            // Box stack blocking the lower deck
            createBreakable(450, 552, 'box');
            createBreakable(450, 520, 'barrel');
            createSpike(520, 584); // Spike hidden right after the box stack!

            createWorldPlatform(700, 400, 4);
            addAncientCoinsToPlatform(700, 400, 4);

            // Double boxes blocking a cannon's fire
            createBreakable(850, 552, 'box');
            createBreakable(850, 520, 'box');
            // Cannon firing left
            createCannon(950, 550, 'left');

            createWorldPlatform(1050, 310, 3);
            
            // Platform with a barrel containing an Ancient Gold Coin
            createWorldPlatform(1350, 380, 4);
            // This barrel drops loot (Ancient Gold Coin) when destroyed!
            createBreakable(1400, 348, 'barrel');
            const coin = this.ancientCoins.create(1400, 300, 'ancient_coin');
            coin.body.setSize(16, 16);

            createWorldPlatform(1600, 450, 2);

            // Checkpoint flag on ground deck
            createCheckpoint(2000, 521.5); // ground level checkpoint

            // Vault platform with guarded box stack
            createWorldPlatform(2200, 310, 4);
            // Box stack guarding the Key
            createBreakable(2200, 278, 'box');
            createBreakable(2250, 278, 'box');
            
            // Key and hidden enemy behind the boxes
            this.chestKey = this.masterKeys.create(2300, 280, 'master_key');
            this.chestKey.body.setSize(24, 24);
            
            const ambusher = createFierceTooth(2350, 260); // Ambush player!
            ambusher.setVelocityX(-40);

            // Platforms & meriam
            // Bridge platform over Gap4 (2500-2900)
            createWorldPlatform(2550, 490, 2); // Bridge to cross Gap4

            createWorldPlatform(2700, 400, 3);
            addAncientCoinsToPlatform(2700, 400, 3);

            createWorldPlatform(3000, 300, 4);
            createCannon(2950, 266, 'right'); // Cannon firing right from platform

            // Tall stack of boxes blocking the final stretch
            createWorldPlatform(3200, 480, 2);
            createBreakable(3232, 448, 'box');
            createBreakable(3232, 416, 'box');
            createBreakable(3232, 384, 'box');

            // Bridge platform over Gap5 (3400-3800)
            createWorldPlatform(3500, 490, 2); // Bridge to cross Gap5
            createWorldPlatform(3600, 420, 2);
            createWorldPlatform(3800, 490, 5);

            // final gold chest stands on the ground
            this.goldChest = this.goldChests.create(4050, 552, 'chest_idle');
            this.goldChest.body.setSize(30, 32);
            this.goldChest.refreshBody();

            // Enemies patrol
            createCrabby(1450, 350);
            createCrabby(3850, 450);
            createCrabby(4150, 550);

            // Level 8 Finish Line at 4400 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4400, 521.5, 'flag_1');
        } else if (this.currentLevel === 9) { // Stage 9: The Guarded Vault
            // Gaps are: (i > 300 && i < 600) || (i > 1000 && i < 1300) || (i > 1700 && i < 2000) || (i > 2500 && i < 2900) || (i > 3400 && i < 3800)
            
            // Start platform
            createWorldPlatform(200, 490, 2);

            // Bridge platform over Gap1 (300-600)
            createWorldPlatform(400, 490, 2); // Bridge to cross Gap1

            // Left side multi-tier platform Labyrinth
            createWorldPlatform(500, 450, 4);
            addAncientCoinsToPlatform(500, 450, 4);

            createWorldPlatform(800, 310, 5);
            // Guarding enemy on tier 2 platform
            createFierceTooth(900, 260);

            createWorldPlatform(1100, 170, 4);
            addAncientCoinsToPlatform(1100, 170, 4);
            // Cannon firing left from top tier
            createCannon(1200, 136, 'left');

            createWorldPlatform(1500, 450, 3);
            createBreakable(1550, 418, 'barrel');

            // Checkpoint flag in the middle
            createCheckpoint(2000, 521.5); // ground level checkpoint

            // Vault Center multi-tier section (Kubah Tengah)
            createWorldPlatform(2200, 450, 4);
            createWorldPlatform(2200, 310, 4);
            
            // Top tier has key and guarding enemy
            createWorldPlatform(2200, 170, 4);
            createFierceTooth(2250, 120);

            // Master Key at Y = 120 on platform Y = 170
            this.chestKey = this.masterKeys.create(2200, 120, 'master_key');
            this.chestKey.body.setSize(24, 24);

            // Right side platforms
            createWorldPlatform(2800, 310, 5);
            // Guarding enemy on right tier 2 platform
            createFierceTooth(2950, 260);
            // Cannon firing right across the gap
            createCannon(2750, 276, 'right');

            createWorldPlatform(3300, 450, 4);
            addAncientCoinsToPlatform(3300, 450, 4);

            // Bridge platform over Gap5 (3400-3800)
            createWorldPlatform(3500, 490, 2); // Bridge to cross Gap5

            createWorldPlatform(3900, 450, 5);
            
            // final gold chest stands on the platform
            this.goldChest = this.goldChests.create(4000, 418, 'chest_idle');
            this.goldChest.body.setSize(30, 32);
            this.goldChest.refreshBody();

            // Enemies patrol on floor
            createCrabby(750, 550);
            createCrabby(1600, 550);
            createCrabby(3500, 550);

            // Level 9 Finish Line at 4400 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4400, 521.5, 'flag_1');
        } else { // Stage 10: The Ultimate Treasure Chamber (Grand Finale)
            // Gaps are: (i > 300 && i < 600) || (i > 1000 && i < 1300) || (i > 1700 && i < 2000) || (i > 2500 && i < 2900) || (i > 3400 && i < 3800)
            
            // Start platform
            createWorldPlatform(200, 490, 2);

            // Bridge platform over Gap1 (300-600)
            createWorldPlatform(350, 490, 2); // Bridge to cross Gap1

            // 1. Gauntlet section: breakables, spikes, and cannon
            createBreakable(450, 552, 'box');
            createBreakable(450, 520, 'box');
            createSpike(520, 584);

            createWorldPlatform(600, 400, 4);
            addAncientCoinsToPlatform(600, 400, 4);

            createBreakable(850, 552, 'box');
            createCannon(950, 550, 'left');

            // 2. Canopy climbing bridges (walkable trees over spikes)
            createWalkableTree(1350, 568, 3, 2); // Top is at Y=304
            createWalkableTree(1600, 568, 4, 3); // Top is at Y=224

            // Checkpoint flag on ground deck
            createCheckpoint(2000, 521.5);

            // 3. Vault center vertical labyrinth
            createWorldPlatform(2200, 450, 4);
            createWorldPlatform(2200, 310, 4);
            createWorldPlatform(2200, 170, 4);
            
            // Guarding enemy and Key in vault center
            createFierceTooth(2250, 120); // Guards key platform

            // Cannon firing across middle gap
            createCannon(2050, 276, 'right');
            createCannon(2800, 276, 'left');

            // 4. Master Key on high platform
            this.chestKey = this.masterKeys.create(2300, 120, 'master_key');
            this.chestKey.body.setSize(24, 24);

            // Right side platforms
            createWorldPlatform(3000, 350, 4);
            createWalkableTree(3250, 568, 3, 2); // Top is at Y=304

            // Bridge platform over Gap5 (3400-3800)
            createWorldPlatform(3500, 490, 2); // Bridge to cross Gap5
            
            // Extra manual spikes at final stretch
            createSpike(3600, 584);
            createSpike(3632, 584);
            createSpike(3664, 584);

            createWorldPlatform(3800, 450, 5);

            // final gold chest stands on the platform
            this.goldChest = this.goldChests.create(3950, 418, 'chest_idle');
            this.goldChest.body.setSize(30, 32);
            this.goldChest.refreshBody();

            // Enemies patrol
            createCrabby(650, 550);
            createCrabby(1800, 550);
            createCrabby(3850, 550);

            // Level 10 Finish Line at 4400 (stands on floor Y=584)
            this.finishFlag = this.physics.add.sprite(4400, 521.5, 'flag_1');
        }

        this.spawnDecorations();

        this.finishFlag.body.allowGravity = false;
        this.finishFlag.body.setImmovable(true);
        this.finishFlag.play('flag_anim');

        let startTexture = this.registry.get('swordUnlocked') === true ? 'idle_sword_1' : 'idle_1';
        if (this.currentLevel >= 6) {
            startTexture = 'new_idle_1';
        }
        this.player = this.physics.add.sprite(this.checkpointX, this.checkpointY, startTexture);
        this.player.setBounce(0.0);
        this.player.setMaxVelocity(250, 1000);
        this.player.setDragX(1200);
        if (this.currentLevel >= 6) {
            this.player.body.setSize(16, 24);
            this.player.body.setOffset(21, 17);
        } else {
            this.player.body.setSize(16, 22);
            this.player.body.setOffset(24, 8);
        }
        this.player.setCollideWorldBounds(true);
        this.player.isAttacking = false;

        // Physics Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.breakables, this.platforms);
        this.physics.add.collider(this.player, this.breakables);
        this.physics.add.collider(this.enemies, this.breakables);
        this.physics.add.collider(this.loots, this.platforms);
        this.physics.add.collider(this.player, this.goldChests, this.hitChest, null, this);

        // Overlaps & Hazards
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.ancientCoins, this.collectAncientCoin, null, this);
        this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.loots, this.collectLoot, null, this);
        this.physics.add.overlap(this.player, this.chestKeys, this.collectChestKey, null, this);
        this.physics.add.overlap(this.player, this.masterKeys, this.collectMasterKey, null, this);

        if (this.currentLevel === 1 && this.sprintMap) {
            this.physics.add.overlap(this.player, this.sprintMap, this.collectSprintMap, null, this);
        }

        if (this.currentLevel === 2 && this.swordItem) {
            this.swordItem.body.allowGravity = false;
            this.swordItem.body.setImmovable(true);
            this.swordItem.play('sword_item_anim');
            this.physics.add.overlap(this.player, this.swordItem, this.collectSwordItem, null, this);
        }

        this.physics.add.collider(this.player, this.spikes, (player, spike) => {
            if (!this.isTakingDamage) {
                this.isTakingDamage = true;
                this.takeDamage();
                player.setVelocityY(-400); // knockback up
                player.setVelocityX(player.x < spike.x ? -150 : 150);

                player.setTint(0xff0000);
                this.time.delayedCall(300, () => {
                    this.isTakingDamage = false;
                    player.clearTint();
                }, [], this);
            }
        }, null, this);

        this.physics.add.overlap(this.player, this.cannonBalls, (player, ball) => {
            ball.disableBody(true, true);
            this.takeDamage();
            // Spawn explosion
            const exp = this.add.sprite(ball.x, ball.y, 'cannon_explosion_1');
            exp.play('cannon_explosion');
            exp.on('animationcomplete', () => exp.destroy());
        }, null, this);

        this.physics.add.collider(this.cannonBalls, this.platforms, (ball, platform) => {
            ball.disableBody(true, true);
            // Spawn explosion
            const exp = this.add.sprite(ball.x, ball.y, 'cannon_explosion_1');
            exp.play('cannon_explosion');
            exp.on('animationcomplete', () => exp.destroy());
        }, null, this);

        this.physics.add.overlap(this.player, this.checkpoints, (player, checkpoint) => {
            if (this.checkpointX !== checkpoint.x) {
                this.checkpointX = checkpoint.x;
                this.checkpointY = checkpoint.y - 50;
                checkpoint.setAlpha(1).clearTint(); // Light up to show activated
                checkpoint.play('flag_anim');
            }
        }, null, this);

        this.physics.add.overlap(this.player, this.finishFlag, () => {
            if (!this.isLevelComplete) {
                this.isLevelComplete = true;
                this.physics.pause();
                this.player.setTint(0x00ff00);
                if (this.currentLevel === 10) {
                    this.events.emit('gameVictory');
                } else {
                    this.events.emit('levelComplete');
                }
            }
        }, null, this);

        this.cameras.main.setBounds(0, 0, worldWidth, 600);
        this.physics.world.setBounds(0, 0, worldWidth, 650, true, true, true, false);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(1.8);

        this.input.addPointer(2); // Enable multi-touch pointers

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({ up: 87, down: 83, left: 65, right: 68 });
        this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

        this.isTakingDamage = false;

        // Delay emitting to let UI scene start if it hasn't
        this.time.delayedCall(10, () => {
            this.events.emit('updateScore', this.score);
            this.events.emit('updateHealth', this.health);
        });
    }

    spawnDecorations() {
        this.decorations = this.add.group();

        const addPalmTree = (x, y, type = 'regular', scale = 2.5) => {
            const animKey = `palm_${type}`;
            const textureKey = `palm_back_${type}_1`;
            const tree = this.add.sprite(x, y, textureKey);
            tree.setOrigin(0.5, 1);
            tree.setScale(scale);
            tree.play(animKey);
            this.decorations.add(tree);
            tree.setDepth(-5);
            return tree;
        };

        const groundY = 568;

        if (this.currentLevel === 1) {
            addPalmTree(150, groundY, 'regular');
            addPalmTree(300, groundY, 'left');
            addPalmTree(500, groundY, 'right');
            addPalmTree(900, groundY, 'regular');
            addPalmTree(1300, groundY, 'left');
            addPalmTree(1700, 400 - 16, 'regular');
            addPalmTree(1950, 310 - 16, 'right');
            addPalmTree(2450, groundY, 'regular');
            addPalmTree(2800, 310 - 16, 'left');
            addPalmTree(3150, 450 - 16, 'regular');
            addPalmTree(3350, 360 - 16, 'right');
            addPalmTree(3650, groundY, 'regular');
            addPalmTree(4000, groundY, 'left');
        } else if (this.currentLevel === 2) {
            addPalmTree(100, groundY, 'left');
            addPalmTree(250, 480 - 16, 'regular');
            addPalmTree(450, 390 - 16, 'right');
            addPalmTree(750, 400 - 16, 'regular');
            addPalmTree(1050, 310 - 16, 'left');
            addPalmTree(1550, 350 - 16, 'regular');
            addPalmTree(1900, 400 - 16, 'right');
            addPalmTree(2400, groundY, 'regular');
            addPalmTree(2850, 420 - 16, 'left');
            addPalmTree(3200, 330 - 16, 'regular');
            addPalmTree(3750, 300 - 16, 'right');
            addPalmTree(4150, 450 - 16, 'regular');
        } else if (this.currentLevel === 3) {
            addPalmTree(100, groundY, 'right');
            addPalmTree(420, 400 - 16, 'regular');
            addPalmTree(750, 490 - 16, 'left');
            addPalmTree(1200, 490 - 16, 'regular');
            addPalmTree(1450, 400 - 16, 'right');
            addPalmTree(1620, 310 - 16, 'regular');
            addPalmTree(2150, 360 - 16, 'left');
            addPalmTree(2500, groundY, 'regular');
            addPalmTree(3000, 450 - 16, 'right');
            addPalmTree(3250, 360 - 16, 'regular');
            addPalmTree(3800, 450 - 16, 'left');
        } else {
            addPalmTree(100, groundY, 'regular');
            addPalmTree(220, 480 - 16, 'left');
            addPalmTree(500, 400 - 16, 'right');
            addPalmTree(800, 310 - 16, 'regular');
            addPalmTree(1050, 420 - 16, 'left');
            addPalmTree(1350, 330 - 16, 'regular');
            addPalmTree(1620, 450 - 16, 'right');
            addPalmTree(1900, 370 - 16, 'regular');
            addPalmTree(2150, 280 - 16, 'left');
            addPalmTree(2450, 450 - 16, 'regular');
            addPalmTree(2700, 370 - 16, 'right');
            addPalmTree(3000, 480 - 16, 'regular');
            addPalmTree(3250, 390 - 16, 'left');
            addPalmTree(3750, 400 - 16, 'regular');
            addPalmTree(3950, 490 - 16, 'right');
            addPalmTree(4250, 450 - 16, 'regular');
        }
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.score += 1;
        this.events.emit('updateScore', this.score);
    }

    collectAncientCoin(player, coin) {
        coin.disableBody(true, true);
        this.score += 100; // Mega Coin gives +100!
        this.events.emit('updateScore', this.score);

        // Show floating pop-up text
        const text = this.add.text(coin.x, coin.y - 15, '+100 Koin Kuno!', {
            fontSize: '14px', fill: '#00ff00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }

    collectMasterKey(player, key) {
        key.disableBody(true, true);
        this.hasKey = true;

        // Show floating pop-up text
        const text = this.add.text(player.x, player.y - 45, 'Kunci Master Didapatkan!', {
            fontSize: '14px', fill: '#ffff00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    collectSprintMap(player, map) {
        map.disableBody(true, true);
        this.registry.set('sprintUnlocked', true);

        // Show floating pop-up text in Indonesian
        const text = this.add.text(player.x, player.y - 45, 'Sprint Terbuka! (Tahan SHIFT)', {
            fontSize: '14px', fill: '#fff', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    collectSwordItem(player, sword) {
        sword.disableBody(true, true);
        this.registry.set('swordUnlocked', true);
        this.player.setTexture('idle_sword_1');
        this.player.play('idle_sword');

        // Show floating pop-up text in Indonesian
        const text = this.add.text(player.x, player.y - 45, 'Pedang Terbuka! (Tekan J untuk Serang)', {
            fontSize: '14px', fill: '#fff', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    spawnLoot(x, y) {
        const rand = Math.random();
        let lootType = '';
        let texture = '';
        let anim = '';
        let scoreValue = 0;
        let isPotion = false;

        if (rand < 0.40) {
            lootType = 'coin';
            texture = 'coin_1';
            anim = 'coin_anim';
            scoreValue = 1;
        } else if (rand < 0.60) {
            lootType = 'blue_diamond';
            texture = 'blue_diamond_1';
            anim = 'blue_diamond_anim';
            scoreValue = 10;
        } else if (rand < 0.80) {
            lootType = 'red_diamond';
            texture = 'red_diamond_1';
            anim = 'red_diamond_anim';
            scoreValue = 15;
        } else if (rand < 0.90) {
            lootType = 'green_diamond';
            texture = 'green_diamond_1';
            anim = 'green_diamond_anim';
            scoreValue = 20;
        } else {
            lootType = 'red_potion';
            texture = 'red_potion';
            isPotion = true;
        }

        const loot = this.loots.create(x, y - 10, texture);
        loot.setBounce(0.3);
        loot.setVelocityY(-200);
        loot.setVelocityX(Phaser.Math.Between(-50, 50));
        loot.lootType = lootType;
        loot.scoreValue = scoreValue;
        loot.isPotion = isPotion;

        if (anim) {
            loot.play(anim);
        }
    }

    collectLoot(player, loot) {
        loot.disableBody(true, true);
        if (loot.isPotion) {
            if (this.health < 5) {
                this.health += 1;
                this.events.emit('updateHealth', this.health);

                // Show floating text
                const text = this.add.text(player.x, player.y - 45, '+1 HP', {
                    fontSize: '14px', fill: '#00ff00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
                    stroke: '#000', strokeThickness: 3
                }).setOrigin(0.5);
                this.tweens.add({
                    targets: text,
                    y: text.y - 50,
                    alpha: 0,
                    duration: 1500,
                    onComplete: () => text.destroy()
                });
            }
        } else {
            this.score += loot.scoreValue;
            this.events.emit('updateScore', this.score);

            // Show floating text
            const text = this.add.text(player.x, player.y - 45, `+${loot.scoreValue}`, {
                fontSize: '14px', fill: '#ffff00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);
            this.tweens.add({
                targets: text,
                y: text.y - 50,
                alpha: 0,
                duration: 1500,
                onComplete: () => text.destroy()
            });
        }
    }

    collectChestKey(player, key) {
        key.disableBody(true, true);
        this.hasKey = true;

        // Show floating pop-up text
        const text = this.add.text(player.x, player.y - 45, 'Kunci Peti Didapatkan!', {
            fontSize: '14px', fill: '#ffff00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    hitChest(player, chest) {
        if (this.hasKey) {
            this.hasKey = false;
            chest.body.enable = false; // Disable physics collider so player can pass through
            chest.play('chest_unlocked');

            // Show floating text
            const text = this.add.text(chest.x, chest.y - 45, 'Peti Terbuka!', {
                fontSize: '14px', fill: '#00ff00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);

            this.tweens.add({
                targets: text,
                y: text.y - 50,
                alpha: 0,
                duration: 2000,
                onComplete: () => text.destroy()
            });

            // Spawn Golden Skull loot
            const skull = this.physics.add.sprite(chest.x, chest.y - 20, 'golden_skull');
            skull.setBounce(0.3);
            skull.setVelocityY(-200);
            this.physics.add.collider(skull, this.platforms);

            this.physics.add.overlap(this.player, skull, (player, item) => {
                item.disableBody(true, true);
                this.score += 50;
                this.events.emit('updateScore', this.score);

                // Show floating text
                const lootText = this.add.text(player.x, player.y - 45, '+50 (Golden Skull)', {
                    fontSize: '14px', fill: '#ffff00', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
                    stroke: '#000', strokeThickness: 3
                }).setOrigin(0.5);
                this.tweens.add({
                    targets: lootText,
                    y: lootText.y - 50,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => lootText.destroy()
                });
            }, null, this);

        } else {
            // Chest is locked, show help text but rate-limit it
            if (!this.lastChestMessageTime || this.time.now - this.lastChestMessageTime > 2000) {
                this.lastChestMessageTime = this.time.now;
                const text = this.add.text(chest.x, chest.y - 45, 'Peti Terkunci! Cari Kunci Emas!', {
                    fontSize: '12px', fill: '#ff3333', fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
                    stroke: '#000', strokeThickness: 3
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: text,
                    y: text.y - 40,
                    alpha: 0,
                    duration: 1500,
                    onComplete: () => text.destroy()
                });
            }
        }
    }

    hitEnemy(player, enemy) {
        if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
            if (enemy.enemyType === 'fierce_tooth') {
                if (!enemy.isHitCooldown) {
                    enemy.isHitCooldown = true;
                    enemy.hp--;
                    player.setVelocityY(-400); // Bounce player

                    // Flash red
                    enemy.setTint(0xff0000);
                    this.time.delayedCall(400, () => {
                        if (enemy.active) enemy.clearTint();
                        enemy.isHitCooldown = false;
                    });

                    if (enemy.hp <= 0) {
                        enemy.disableBody(true, true);
                        this.score += 15;
                        this.events.emit('updateScore', this.score);
                    } else {
                        enemy.play('fierce_tooth_hit', true);
                        enemy.once('animationcomplete-fierce_tooth_hit', () => {
                            if (enemy.active) {
                                enemy.play(enemy.isChasing ? 'fierce_tooth_run' : 'fierce_tooth_idle');
                            }
                        });
                    }
                }
            } else {
                enemy.disableBody(true, true);
                player.setVelocityY(-450);
                this.score += 5;
                this.events.emit('updateScore', this.score);
            }
        } else {
            if (!this.isTakingDamage) {
                this.isTakingDamage = true;
                this.takeDamage();
                player.setVelocity(0); // No knockback, freeze in place

                player.setTint(0xff0000);
                this.time.delayedCall(300, () => {
                    this.isTakingDamage = false;
                    player.clearTint();
                }, [], this);
            }
        }
    }

    takeDamage() {
        this.health -= 1;
        this.events.emit('updateHealth', this.health);
        if (this.health <= 0) {
            this.isGameOver = true;
            this.player.setTint(0x555555);
            this.physics.pause();
            this.events.emit('gameOver');
        }
    }

    respawnAtCheckpoint() {
        this.health = 3;
        this.isGameOver = false;
        this.player.clearTint();
        this.player.setPosition(this.checkpointX, this.checkpointY);
        this.player.setVelocity(0);
        this.physics.resume();
        this.events.emit('updateHealth', this.health);
    }

    update() {
        if (this.health <= 0 || this.isLevelComplete) return;

        // Extract mobile inputs from UIScene
        const uiScene = this.scene.get('UIScene');
        const joyX = (uiScene && uiScene.joystickInput) ? uiScene.joystickInput.x : 0;
        const mobileJump = uiScene ? uiScene.mobileJump === true : false;
        const mobileAttack = uiScene ? uiScene.mobileAttack === true : false;

        // Extract gamepad inputs if connected
        const pad = (this.input.gamepad && this.input.gamepad.total > 0) ? this.input.gamepad.getPad(0) : null;
        const padConnected = pad && pad.connected;
        const padX = padConnected ? (pad.leftStick ? pad.leftStick.x : (pad.axes[0] ? pad.axes[0].getValue() : 0)) : 0;
        const padLeft = padConnected ? (pad.left || padX < -0.15) : false;
        const padRight = padConnected ? (pad.right || padX > 0.15) : false;
        const padJump = padConnected ? ((pad.buttons[0] && pad.buttons[0].pressed) || false) : false;
        const padAttack = padConnected ? ((pad.buttons[2] && pad.buttons[2].pressed) || (pad.buttons[3] && pad.buttons[3].pressed) || false) : false;
        const padSprint = padConnected ? ((pad.buttons[5] && pad.buttons[5].pressed) || (pad.buttons[7] && pad.buttons[7].pressed) || false) : false;

        if (this.player.y > 650) {
            this.takeDamage();
            if (this.health > 0) {
                this.player.setPosition(this.checkpointX, this.checkpointY);
                this.player.setVelocity(0);
            }
        }

        const swordUnlocked = this.registry.get('swordUnlocked') === true;

        // Trigger sword attack
        if ((Phaser.Input.Keyboard.JustDown(this.keyJ) || mobileAttack || padAttack) && swordUnlocked && !this.player.isAttacking) {
            if (uiScene) uiScene.mobileAttack = false; // Consume the mobile attack button trigger
            this.player.isAttacking = true;
            this.player.setVelocity(0);
            this.player.setAccelerationX(0);

            const animPrefix = 'attack_sword';
            this.player.anims.play(animPrefix, true);

            // Spawn sword effect
            const effectX = this.player.x + (this.player.flipX ? -28 : 28);
            const effectY = this.player.y;
            const effect = this.add.sprite(effectX, effectY, 'sword_effect_1');
            effect.flipX = this.player.flipX;
            effect.play('sword_effect');
            effect.on('animationcomplete', () => {
                effect.destroy();
            });

            // Hit detection box
            const hitBoxX = this.player.x + (this.player.flipX ? -35 : 5);
            const hitBoxY = this.player.y - 10;
            const hitBoxWidth = 30;
            const hitBoxHeight = 25;

            // Check overlap with breakables
            this.breakables.getChildren().forEach(prop => {
                if (prop.active && Phaser.Geom.Intersects.RectangleToRectangle(
                    new Phaser.Geom.Rectangle(hitBoxX, hitBoxY, hitBoxWidth, hitBoxHeight),
                    prop.getBounds()
                )) {
                    prop.takeHit();
                }
            });

            // Check overlap with enemies
            this.enemies.getChildren().forEach(enemy => {
                if (enemy.active && Phaser.Geom.Intersects.RectangleToRectangle(
                    new Phaser.Geom.Rectangle(hitBoxX, hitBoxY, hitBoxWidth, hitBoxHeight),
                    enemy.getBounds()
                )) {
                    if (enemy.enemyType === 'fierce_tooth') {
                        if (!enemy.isHitCooldown) {
                            enemy.isHitCooldown = true;
                            enemy.hp--;

                            // Flash red tint
                            enemy.setTint(0xff0000);
                            this.time.delayedCall(400, () => {
                                if (enemy.active) enemy.clearTint();
                                enemy.isHitCooldown = false;
                            });

                            if (enemy.hp <= 0) {
                                enemy.disableBody(true, true);
                                this.score += 15; // More score for tougher enemy
                                this.events.emit('updateScore', this.score);
                            } else {
                                enemy.play('fierce_tooth_hit', true);
                                enemy.once('animationcomplete-fierce_tooth_hit', () => {
                                    if (enemy.active) {
                                        enemy.play(enemy.isChasing ? 'fierce_tooth_run' : 'fierce_tooth_idle');
                                    }
                                });
                            }
                        }
                    } else {
                        // Crabby takes 1 hit
                        enemy.disableBody(true, true);
                        this.score += 5;
                        this.events.emit('updateScore', this.score);
                    }
                }
            });

            this.player.once('animationcomplete-' + animPrefix, () => {
                this.player.isAttacking = false;
            });
        }

        if (this.player.isAttacking) return;

        const sprintUnlocked = this.registry.get('sprintUnlocked') === true;
        const isSprinting = sprintUnlocked && (
            (this.cursors.shift && this.cursors.shift.isDown) ||
            (Math.abs(joyX) > 0.8) ||
            (padConnected && (Math.abs(padX) > 0.8 || padSprint)) ||
            (uiScene && uiScene.mobileSprint === true)
        );
        const accel = isSprinting ? 1800 : 1200;
        const maxVelX = isSprinting ? 380 : 250;
        const jumpVelocity = -650;
        let isMoving = false;

        this.player.setMaxVelocity(maxVelX, 1000);

        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;

            if (enemy.enemyType === 'fierce_tooth') {
                const distX = Math.abs(enemy.x - this.player.x);
                const distY = Math.abs(enemy.y - this.player.y);

                if (enemy.isAnticipating) {
                    enemy.setVelocityX(0);
                    return;
                }

                if (distX < 200 && distY < 60 && this.player.y <= enemy.y + 50 && !enemy.isChasing) {
                    enemy.isAnticipating = true;
                    enemy.setVelocityX(0);
                    enemy.play('fierce_tooth_anticipation', true);
                    this.time.delayedCall(500, () => {
                        if (enemy.active) {
                            enemy.isAnticipating = false;
                            enemy.isChasing = true;
                        }
                    });
                    return;
                }

                if (enemy.isChasing) {
                    if (distX >= 250 || this.player.y > enemy.y + 50) {
                        enemy.isChasing = false;
                        enemy.setVelocityX(enemy.flipX ? 60 : -60);
                    } else {
                        const dir = this.player.x > enemy.x ? 1 : -1;
                        enemy.setVelocityX(dir * 180);
                        enemy.setFlipX(dir > 0);
                        enemy.play('fierce_tooth_run', true);
                        return; // Skip normal patrol logic while chasing
                    }
                }
            }

            const direction = enemy.body.velocity.x > 0 ? 1 : -1;
            const nextX = enemy.x + (direction * 15);
            const nextY = enemy.y + 20;

            let hasFloor = false;
            this.platforms.getChildren().forEach(platform => {
                if (platform.getBounds().contains(nextX, nextY)) {
                    hasFloor = true;
                }
            });

            if (!hasFloor || enemy.body.blocked.left || enemy.body.blocked.right) {
                enemy.setVelocityX(enemy.body.velocity.x * -1);
            }

            enemy.setFlipX(enemy.body.velocity.x > 0);
        });

        if (this.isTakingDamage) return;

        if (this.cursors.left.isDown || this.wasd.left.isDown || joyX < -0.15 || padLeft) {
            const currentXInput = joyX < -0.15 ? joyX : (padLeft ? (padX < -0.15 ? padX : -1.0) : -1.0);
            const targetAccel = accel * Math.abs(currentXInput) * -1;
            this.player.setAccelerationX(targetAccel);
            this.player.setFlipX(true);
            isMoving = true;
        }
        else if (this.cursors.right.isDown || this.wasd.right.isDown || joyX > 0.15 || padRight) {
            const currentXInput = joyX > 0.15 ? joyX : (padRight ? (padX > 0.15 ? padX : 1.0) : 1.0);
            const targetAccel = accel * Math.abs(currentXInput);
            this.player.setAccelerationX(targetAccel);
            this.player.setFlipX(false);
            isMoving = true;
        }
        else {
            this.player.setAccelerationX(0);
        }

        const isGrounded = this.player.body.blocked.down || this.player.body.touching.down;
        if ((this.cursors.up.isDown || this.wasd.up.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)) || mobileJump || padJump) && isGrounded) {
            if (uiScene) uiScene.mobileJump = false; // Reset mobile jump trigger
            this.player.setVelocityY(jumpVelocity);
        }

        let animIdle = swordUnlocked ? 'idle_sword' : 'idle';
        let animRun = swordUnlocked ? 'run_sword' : 'run';
        let animJump = swordUnlocked ? 'jump_sword' : 'jump';
        let animFall = swordUnlocked ? 'fall_sword' : 'fall';

        if (this.currentLevel >= 6) {
            animIdle = 'new_player_idle';
            animRun = 'new_player_run';
            animJump = 'new_player_jump';
            animFall = 'new_player_fall';
        }

        if (!isGrounded) {
            this.player.anims.timeScale = 1.0;
            if (this.player.body.velocity.y < 0) {
                this.player.anims.play(animJump, true);
            } else {
                this.player.anims.play(animFall, true);
            }
        } else {
            if (Math.abs(this.player.body.velocity.x) > 20) {
                this.player.anims.play(animRun, true);
                this.player.anims.timeScale = isSprinting ? 1.5 : 1.0;
            } else {
                this.player.anims.play(animIdle, true);
                this.player.anims.timeScale = 1.0;
            }
        }

        // Ledge / Abyss dynamic warning alert
        let showAlert = false;
        if (isGrounded && this.player.y < 500) {
            const direction = this.player.flipX ? -1 : 1;
            const checkX = this.player.x + (direction * 45);

            let hasFloorAhead = false;
            this.platforms.getChildren().forEach(platform => {
                if (platform.visible !== false) { // ignore invisible tree platforms
                    const bounds = platform.getBounds();
                    if (checkX >= bounds.left && checkX <= bounds.right && bounds.top > this.player.y) {
                        hasFloorAhead = true;
                    }
                }
            });

            if (!hasFloorAhead) {
                showAlert = true;
            }
        }

        if (showAlert) {
            this.warningAlert.setPosition(this.player.x, this.player.y - 35);
            this.warningAlert.setVisible(true);
        } else {
            this.warningAlert.setVisible(false);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1400 },
            debug: false
        }
    },
    input: {
        gamepad: true
    },
    scene: [GameScene, UIScene],
    pixelArt: true,
    backgroundColor: '#1a1a2e'
};

const game = new Phaser.Game(config);
