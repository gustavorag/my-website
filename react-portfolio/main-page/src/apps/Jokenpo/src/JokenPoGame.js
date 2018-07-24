import React, { Component } from 'react';
import './App.css';

//Importing assets
import GameAssets from './components/GameAssets';

//Importing modules
import GameInterface from './components/GameInterface';
// import AudioPlayer from './components/AudioPlayer';

const DEFAULT_POINTS_TO_WIN = 2;


class JokenPoGame extends Component {

  constructor(props){
    super(props);

    //Bindings
    this.processTurnWinner = this.processTurnWinner.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.playAudio = this.playAudio.bind(this);

    this.state = this.getStartingState();

    this.turnChoices = {
      playerChoice: GameAssets.playersOptions[this.state.gameConfig.initialOption],
      cpuChoice: GameAssets.playersOptions[this.state.gameConfig.initialOption],
    }

    this.gameStateApi = {
      setPointsToWin: (points)=> {
        this.setState({pointsToWin: points})
      },
      setAudioOnOff: (isOn)=> {
        this.setState({audioOn: isOn})
      },
      playAudio: (audioSource)=>{
        this.playAudio(audioSource);
      },
      setPlayerChoice: (playerChoice)=> {
        this.turnChoices.playerChoice = playerChoice;
        this.playAudio(playerChoice.audio);
      },
      setCpuChoice: (cpuChoice)=> {
        this.turnChoices.cpuChoice = cpuChoice;
      },
      resolveTurn: ()=>{
        this.playAudio(GameAssets.audiosAsset.audioProcessing);
        this.setState({gameState:{status: GameAssets.gameStatus.rolling, winner: null}})
      },
      endTurn: ()=>{
        this.processTurnWinner();
      },
      startNewTurn: ()=>{
        this.setState({gameState:{status: GameAssets.gameStatus.playing, winner: null}})
      },
      resetGame: ()=>{
        this.resetGame();
      },
    }
  }

  playAudio(audioSource){
    if(this.state.audioOn){
      this.setState({audioToPlay: audioSource})
    }
  }

  processTurnWinner(){

    console.log("Processing", this.turnChoices)

    var playerWins =  false;
    var gameEnd = false;
    var audioToPlay = null;

    //Winner === null means DRAW. If the "If clause" is executed, it means that there is a winner for the turn
    var newState = {
      gameState: {
        status: GameAssets.gameStatus.turnEnd,
        winner: null
      }
    };

    audioToPlay = GameAssets.audiosAsset.audioDraw;

    //No Draw
    if(this.turnChoices.playerChoice !== this.turnChoices.cpuChoice){

      if((this.turnChoices.playerChoice.value === "paper" && this.turnChoices.cpuChoice.value === "rock")
      ||(this.turnChoices.playerChoice.value === "rock" && this.turnChoices.cpuChoice.value === "scissor")
      ||(this.turnChoices.playerChoice.value === "scissor" && this.turnChoices.cpuChoice.value === "paper")){
        playerWins = true;
      }
      if(playerWins){
        newState.playerScore = ++this.state.playerScore;
        newState.gameState.winner = "player";
        audioToPlay = GameAssets.audiosAsset.audioWinTurn;
        if(newState.playerScore >= this.state.pointsToWin){
          newState.gameState.status = GameAssets.gameStatus.gameEnd;
          audioToPlay = GameAssets.audiosAsset.audioWinGame;
        }
      }else{
        newState.cpuScore = ++this.state.cpuScore;
        newState.gameState.winner = "cpu";
        audioToPlay = GameAssets.audiosAsset.audioLoseTurn;
        if(newState.cpuScore >= this.state.pointsToWin){
          newState.gameState.status = GameAssets.gameStatus.gameEnd;
          audioToPlay = GameAssets.audiosAsset.audioLoseGame;
        }
      }

    }

    console.log("newState", newState)
    this.setState(newState);
    this.playAudio(audioToPlay);
  }

  resetGame(){
    //TODO - something else to do?
    this.setState(this.getStartingState());
  }

  getStartingState(){
    return {
      pointsToWin: DEFAULT_POINTS_TO_WIN,
      audioOn: true,
      gameConfig:{
        //randomTotalTime counts the total time until final choice
        //waitTime counts the time between each intermade choise
        randomConfig:{randomTotalTime: 5000, waitTime: 500},
        initialOption: 0,
      },
      playerScore: 0,
      cpuScore: 0,
      gameState: {status: GameAssets.gameStatus.playing, winner: null},
      audioToPlay: null,
    }
  }

  render() {
    return (
      <div id="game">
        <GameInterface
          gameApi={this.gameStateApi}
          gameConfig={this.state.gameConfig}
          score={{player: this.state.playerScore, cpu: this.state.cpuScore}}
          gameState={this.state.gameState}/>
        <audio src={this.state.audioToPlay} autoPlay></audio>
      </div>
    );
  }
}

export default JokenPoGame;
