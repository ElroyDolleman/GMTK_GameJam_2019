/// <reference path="scenes/game_scene.ts"/>

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 720,
    backgroundColor: '#e9f4fc',
    parent: 'GMTK Game Jam 2019',
    title: "GMTK Game Jam 2019",
    version: "0.0.1",
    disableContextMenu: true,
    scene: [ GameScene ]
};

var game = new Phaser.Game(config);