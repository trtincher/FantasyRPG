import { Boot } from './scenes/Boot';
import { TitleScene } from './scenes/TitleScene';
import { CharacterCreationScene } from './scenes/CharacterCreationScene';
import { WorldScene } from './scenes/WorldScene';
import { BattleScene } from './scenes/BattleScene';
import { AUTO, Game } from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, ZOOM } from './utils/Constants';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    pixelArt: true,
    roundPixels: true,
    zoom: ZOOM,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scene: [
        Boot,
        TitleScene,
        CharacterCreationScene,
        WorldScene,
        BattleScene,
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
