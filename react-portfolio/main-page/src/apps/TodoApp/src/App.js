/*
Author Gustavo Rocha de Ameida Guimaraes
*/
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//Importing Components and Utils
import TasksInput from './TasksInput';
import TodoList from './TodoList';

//Main Class. It holds components and controls data in memory.
//The items which are created by users are held in this.state.todoItems (Array)
class App extends Component {

  constructor(props){
    super(props);

    this.keyCounter = 0;
    this.state = {
      todoItems:[], //Responsable for hold to-do tasks
    }

    this.addNewItem = this.addNewItem.bind(this);
    this.getNewKey = this.getNewKey.bind(this);
    this.removeItemFromList = this.removeItemFromList.bind(this);
  }

  //This method handles the event of a click in add task button (This button exists inside TasksInput component)
  addNewItem(items){

    var newItems = [];

    //Item my be an Array of task items
    if(Array.isArray(items)){
      // console.log("it is an Array")
      newItems = items.map((item)=>{
        //if an key ins not provide, a default key is generated.
        if(!item.key){
          item.key = this.getNewKey(item);
        }
        return item;
      });
      // or item may be a single task item.
    }else if(	"object" === typeof items){
      // console.log("it is an Item")
      if(!items.key){
        //if an key ins not provide, a default key is generated.
        items.key = this.getNewKey(items);
      }
      newItems.push(items);
    }
    this.setState({todoItems:this.state.todoItems.concat(newItems)});
  }

  getNewKey(item){
    return item.title+"-"+(this.keyCounter++);
  }

  //This method handles the event of removing an item from to-do list (Event fired by TodoList component)
  removeItemFromList(itemKey){
    this.setState({
      todoItems: this.state.todoItems.filter((item) =>{
        return item.key !== itemKey;
      })
    });
  }

  render() {
    return (
      <div className="TodoApp">
        <div className="TodoApp-header">
          <h2>To Do App</h2>
        </div>
        <div className="TodoApp-content">
          <TasksInput onSubmitItem={(item) => this.addNewItem(item)}/>
          <TodoList items={this.state.todoItems} onItemRemove={this.removeItemFromList}/>
        </div>
      </div>
    );
  }
}

export default App;
