import React, { Component } from 'react';

class TodoListItem extends Component {

  constructor(props){
    super(props);

    this.state = {
      showDesc: false,
    }
    // Bindings
    this.showHideDesc = this.showHideDesc.bind(this);
  }

  showHideDesc(){
    this.setState({showDesc: !this.state.showDesc});
  }

  render(){
    return (
      <li>
        <input type="checkbox" onChange={()=>{this.props.onUncheckItem(this.props.item.key)}} checked />
        <div className="Task-content">
          <p className="Task-title" >{this.props.item.title}</p>
          <span className={this.state.showDesc ? 'Turn-arrow-down' : ''} onClick={this.showHideDesc}>❯</span>
          <p className={"Task-desc"+(this.state.showDesc ? '' : ' hidden')}>{this.props.item.desc}</p>
        </div>
      </li>
    )
  }
}

export default TodoListItem;
