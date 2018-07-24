import React, { Component } from 'react';

//Importing componets
import GameAssets from './GameAssets';
import Chooser from './Chooser';
import Switch from './Switch';

const DEFAULT_PLAYER_NAME = "Player";
const DEFAULT_BOT_NAME = "Bot Doe";
const LABEL_ROLL_DICES = "LETS ROCK, PAPER & SCISSOR ROLL";

const PLAYER_WINS_TURN = "You Win this turn. Here is 1 point.";
const PLAYER_LOSES_TURN = "You Lose this turn. "+DEFAULT_BOT_NAME+" gets 1 point.";
const DRAW_TURN = "It was a DRAW!";

const PLAYER_WINS_GAME = "You Win";
const PLAYER_LOSES_GAME = "You Lose";

class GameInterface extends Component {


  constructor(props){

    super(props);

    this.playerChooserRef = React.createRef();
    this.cpuChooserRef = React.createRef();

    this.handleOptionSelection = this.handleOptionSelection.bind(this);
    this.createResultModal = this.createResultModal.bind(this);

  }

  handleOptionSelection(option, isPlayer){
    if(isPlayer){
      this.props.gameApi.setPlayerChoice(option);
    }else{
      this.props.gameApi.setCpuChoice(option);
      this.props.gameApi.endTurn();
    }
  }

  createResultModal(){

    var isEndGame = this.props.gameState.status === GameAssets.gameStatus.gameEnd;

    var modalTitle = DRAW_TURN;
    var resultImage = GameAssets.imagesAsset.draw;
    var pointsImage = null;

    if(this.props.gameState.winner === "player"){
      modalTitle = isEndGame ? PLAYER_WINS_GAME : PLAYER_WINS_TURN;
      resultImage =  isEndGame ? GameAssets.imagesAsset.winner : GameAssets.imagesAsset.win;
      pointsImage = (<img src={GameAssets.imagesAsset.one}></img>);
    }else if(this.props.gameState.winner === "cpu"){
      modalTitle = isEndGame ? PLAYER_LOSES_GAME : PLAYER_LOSES_TURN;
      resultImage =  isEndGame ? GameAssets.imagesAsset.sad : GameAssets.imagesAsset.robot;
      pointsImage = (<img src={GameAssets.imagesAsset.one}></img>);
    }

    var resultModal =
    (
      <div id="turn-result" className="result-modal">
        <div className="result-modal-content">
          {isEndGame ? null : (<span className="close-result-modal" onClick={this.props.gameApi.startNewTurn}>X</span>)}
          <h2 className="title">{modalTitle}</h2>
          <div>
            <img src={resultImage}></img>
            { isEndGame ?
              (
                <div className="play-again" onClick={this.props.gameApi.resetGame}>
                  <h3>Play Again</h3>
                  <img src={GameAssets.imagesAsset.gamepad}></img>
                </div>
              )
              :
              (
                pointsImage
              )
            }
          </div>
        </div>
      </div>
    )
    return resultModal;
  }

  render() {

    var imgButtonClasses = "img-button confirm-button";

    var randomConfig = this.props.gameState.status === GameAssets.gameStatus.rolling ? this.props.gameConfig.randomConfig : null;

    var showModal = this.props.gameState.status === GameAssets.gameStatus.gameEnd || this.props.gameState.status === GameAssets.gameStatus.turnEnd ;
    var resultModal = showModal ?  this.createResultModal() : null;

    return (

      <div className="game">

        <h1>
          <span className="title-rock">Rock, </span>
          <span className="title-paper">Paper </span>
          <span>and </span>
          <span className="title-scissor">Scissor</span>
        </h1>


        <div id="game-components-box">

          <Chooser playerName={DEFAULT_PLAYER_NAME}
            onChangeOption={(option, player)=>{
              this.handleOptionSelection(option, player);
            }}
            initialIndex={this.props.gameConfig.initialOption}
            isPlayer={true}
            score={this.props.score.player} />

            <div id="controls-box">
              <div id="options">
                <Switch label="Audio" isOn={true} onChangeValue={this.props.gameApi.setAudioOnOff}/>
                <div id="restart-button" onClick={this.handlerButtonReset}>
                  <label>Restart</label><img src={GameAssets.imagesAsset.restart}></img>
                </div>
              </div>
              <div id="roll-button" onClick={this.props.gameApi.resolveTurn} disabled={this.props.gameState.status === GameAssets.gameStatus.rolling ? true:false}>
                <p>{LABEL_ROLL_DICES}</p>
                <img className={imgButtonClasses}  src={GameAssets.imagesAsset.confirm} alt="confirm" />
              </div>
            </div>

            <Chooser playerName={DEFAULT_BOT_NAME}
              onChangeOption={(option, player)=>{
                this.handleOptionSelection(option, player);
              }}
              initialIndex={this.props.gameConfig.initialOption}
              isPlayer={false}
              score={this.props.score.cpu}
              randomConfig={randomConfig}/>
            </div>

            {
              showModal ? resultModal : null
            }

            <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
          </div>
        );
      }
    }

    export default GameInterface;
