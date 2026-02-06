import StartGame from './game/main';

document.addEventListener('DOMContentLoaded', () => {

    const game = StartGame('game-container');
    (window as any).__PHASER_GAME__ = game;

});