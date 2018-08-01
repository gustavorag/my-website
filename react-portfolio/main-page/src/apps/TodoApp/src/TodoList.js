import React, { Component } from 'react';
import TodoListItem from './TodoListItem';
/*
Author: Gustavo Rocha de Almeida Guimaraes
Component to handler Items in a list.
Item must contemple the followin format to be accepted:
{
title: String - Title of the task. Also the value displayed in the list
desc: String - Description of the task
key: String - Unique key
}
*/
class TodoList extends Component{

  constructor(props){

    super(props);
    this.keyCounter = 0;

    this.state = {
      title: "To Do",
      items: this.props.items
    }

    //Bindings
    this.handleUncheckItem = this.handleUncheckItem.bind(this);

  }

  handleUncheckItem(itemKey){
    this.props.onItemRemove(itemKey);
  }


  render(){

    var listItems = this.props.items.length <= 0 ?
    (<p>No tasks</p>)
    :
    (
      this.props.items.map((item) => {
        return(
          <TodoListItem key={item.key} item={item} onUncheckItem={this.handleUncheckItem} />
        );
      })
    );
    return(
      <div className="Todo-list">
        <p>{this.state.title}</p>
        <ul>
          {listItems}
        </ul>
      </div>
    )

  }

}

export default TodoList;
