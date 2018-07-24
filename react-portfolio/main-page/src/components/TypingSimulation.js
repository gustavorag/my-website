import React, { Component } from 'react';

class TypingSimulation extends Component{

  constructor(props){
    super(props);

    this.state = {
      typingSpeed: this.props.fast ? 10 : 300,
      lineSpeed: this.props.fast ? 300 : 800,
      paragraphs: [],
    }

    this.typeNewParagraph = this.typeNewParagraph.bind(this);
    this.typeParagraphsFromInput = this.typeParagraphsFromInput.bind(this);

  }

  componentDidMount(){

    if(this.props.noSimulation){
      // If it is flag as no simulation then the text is written right alway
      this.setState({paragraphs: this.props.input})
      if(this.props.onTypingEnd){
        this.props.onTypingEnd();
      }
    }else{
      //Otherwise, it will by written as it would be tyting.
      this.typeParagraphsFromInput(0);
    }

  }

  typeNewParagraph(str, index){

    var paragraphs = this.state.paragraphs;

    if(str.length > 0){

      var actualP = paragraphs[index];
      if(!actualP){
        actualP = "";
      }

      paragraphs[index] = actualP + str.substring(0,1);

      setTimeout(()=>{
        this.typeNewParagraph(str.substring(1,str.length), index);
      },Math.floor((Math.random() * this.state.typingSpeed)+50))

      this.setState({paragraphs: paragraphs})

    }else{
      if(index < this.props.input.length-1){
        setTimeout(()=>{
          this.typeParagraphsFromInput(index+1)
        },Math.floor((Math.random() * this.state.lineSpeed)+100))

      }else{
        if(this.props.onTypingEnd){
          this.props.onTypingEnd();
        }
      }
    }
  }

  typeParagraphsFromInput(index){
    if(this.props.input && this.props.input.length > 0){
      this.typeNewParagraph(this.props.input[index],index);
    }
  }

  render(){

    return(
      <div>
        {
          this.state.paragraphs.map((str, index) => {
            return index === this.state.paragraphs.length -1 ?
            (<p>{str} <span className="blink-cursor"></span> </p>) : (<p>{str}</p>)
          })
        }
      </div>
    )
  }

}

export default TypingSimulation;
