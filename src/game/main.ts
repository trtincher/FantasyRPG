import { Boot } from './scenes/Boot';
import { TitleScene } from './scenes/TitleScene';
import { CharacterCreationScene } from './scenes/CharacterCreationScene';
import { WorldScene } from './scenes/WorldScene';
import { BattleScene } from './scenes/BattleScene';
import { VictoryScene } from './scenes/VictoryScene';
import { AUTO, Game, Scale } from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './utils/Constants';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        min: {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
        },
        snap: {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
        },
    },
    scene: [
        Boot,
        TitleScene,
        CharacterCreationScene,
        WorldScene,
        BattleScene,
        VictoryScene,
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
