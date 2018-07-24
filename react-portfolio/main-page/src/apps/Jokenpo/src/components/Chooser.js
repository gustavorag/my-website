import React, { Component } from 'react';
import GameAssets from './GameAssets'

const ACTION_INCREMENT = "increment";
const ACTION_DECREMENT = "decrement";

class Chooser extends Component {

  constructor(props){

    super(props);

    this.isRandonizing = false;

    this.state = {
      actualIndex: this.props.initialIndex,
      randomClassName: '',
    }

    this.changeSelection = this.changeSelection.bind(this);
    this.startCpuSelection = this.startCpuSelection.bind(this);
    this.randomizeCpuSelection = this.randomizeCpuSelection.bind(this);
    this.returnChoice = this.returnChoice.bind(this);

  }

  changeSelection(action, e){
    if(!this.props.isPlayer){
      e.preventDefault();
      return false;
    }
    var newIndex = this.state.actualIndex;

    if(action === ACTION_INCREMENT){
      newIndex = ((newIndex -1) + GameAssets.playersOptions.length);
    }else{
      newIndex = newIndex+1;
    }
    newIndex = newIndex %GameAssets.playersOptions.length;
    this.setState({actualIndex:newIndex});
    this.returnChoice(newIndex);

  }

  startCpuSelection(){

    var totalRandoms = Math.floor(this.props.randomConfig.randomTotalTime / this.props.randomConfig.waitTime);
    this.randomizeCpuSelection(this.props.randomConfig.waitTime, totalRandoms);

  }

  randomizeCpuSelection(waitTime, totalRandoms){

    if(totalRandoms > 0){
      var minOption = 0;
      var maxOption = 3;
      var randomIndex = Math.floor(Math.random() * (maxOption - minOption) ) + minOption;
      var randomClassName = this.state.randomClassName === '' ? 'randomizing' : '';

      this.isRandonizing = true;
      this.setState({
        actualIndex:randomIndex,
        randomClassName: randomClassName,
      });


      setTimeout(() => {this.randomizeCpuSelection(waitTime, --totalRandoms)}, waitTime);

    }else{
      this.isRandonizing = false;
      this.returnChoice(this.state.actualIndex);
    }


  }

  componentDidUpdate(){
    if(this.props.randomConfig && this.isRandonizing === false){
      this.startCpuSelection();
    }
  }

  returnChoice(index){
    this.props.onChangeOption(GameAssets.playersOptions[index], this.props.isPlayer);
  }

  render() {
    var that = this;

    var optionClassName = GameAssets.playersOptions[this.state.actualIndex].className+" "+(this.state.randomClassName);

    return (
      <div className="chooser-box">
        <div className="selector">

          <p className="player-score">{this.props.playerName} <span className="score">{this.props.score}</span></p>

          <img className={"arrow-up img-button"+(this.props.isPlayer ? "" : " disabled")} src={GameAssets.imagesAsset.arrowButton}
            onClick={function(e){that.changeSelection(ACTION_INCREMENT,e)}} alt="arrow-up" />

          <div className={optionClassName}>
            <img src={GameAssets.playersOptions[this.state.actualIndex].img} alt={GameAssets.playersOptions[this.state.actualIndex].value} />
          </div>

          <img className={"arrow-down img-button"+(this.props.isPlayer ? "" : " disabled")} src={GameAssets.imagesAsset.arrowButton}
            onClick={function(e){that.changeSelection(ACTION_DECREMENT,e)}} alt="arrow-down" />
        </div>
      </div>
    );
  }
}

// <ReactPlayer url={this.state.audioToPlay} playing controls={false}/>

export default Chooser;
