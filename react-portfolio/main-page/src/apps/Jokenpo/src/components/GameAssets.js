
//Importing assets
import confirm from '../imgs/dices.png';
import paper from '../imgs/paper.png';
import rock from '../imgs/rock.png';
import scissor from '../imgs/scissor.png';
import winner from '../imgs/winner.png';
import win from '../imgs/win.png';
import draw from '../imgs/draw.png';
import one from '../imgs/one.png';
import robot from '../imgs/robot.png';
import sad from '../imgs/sad.png';
import gamepad from '../imgs/gamepad-console.png';
import restart from '../imgs/restart.png';
import arrowButton from '../imgs/keyboard-arrow-button.svg';

import audioScissor from '../sound/scissor_01.mp3';
import audioPaper from '../sound/paper_01.mp3';
import audioRock from '../sound/rock_02.mp3';
import audioProcessing from '../sound/processing.mp3';
import audioWinTurn from '../sound/win.mp3';
import audioWinGame from '../sound/winGame.mp3';
import audioLoseTurn from '../sound/lose2.mp3';
import audioLoseGame from '../sound/loseGame.mp3';
import audioDraw from '../sound/draw.mp3';

export default {
  gameStatus:{
    playing: "PLAYING",
    rolling: "ROLLING",
    turnEnd: "TURN_ENDS",
    gameEnd: "GAME_ENDS",
  },
  playersOptions: [
    {img: paper, audio:audioPaper, value: "paper", className: "option paper"},
    {img: rock, audio:audioRock, value: "rock", className: "option rock"},
    {img: scissor, audio:audioScissor, value: "scissor", className: "option scissor"}
  ],
  imagesAsset:{
    confirm: confirm,
    paper: paper,
    rock: rock,
    scissor: scissor,
    winner: winner,
    win: win,
    draw: draw,
    one: one,
    robot: robot,
    sad: sad,
    gamepad: gamepad,
    restart: restart,
    arrowButton: arrowButton,
  },
  audiosAsset:{
    audioScissor:  audioScissor ,
    audioPaper: audioPaper,
    audioRock: audioRock,
    audioProcessing: audioProcessing,
    audioWinTurn: audioWinTurn,
    audioWinGame: audioWinGame,
    audioLoseTurn: audioLoseTurn,
    audioLoseGame: audioLoseGame,
    audioDraw: audioDraw,

  }
}
