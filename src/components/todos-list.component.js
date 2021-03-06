import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Todo = props => (
  <tr>
    <td>{props.todo.todo_description}</td>
    <td>{props.todo.todo_responsible}</td>
    <td>{props.todo.todo_priority}</td>
    <td>
      <Link to={"/edit/" + props.todo._id}>Edit</Link>
      {/* <button onClick={e => props.delete(props.todo._id, props.update_state)} id={props.todo._id}>
        Delete
      </button> */}
      <button onClick={ () => 
        //   console.log(props.todo._id)
        props.delete(props.todo._id, props.updateState)
    //    axios
    //     .delete('http://localhost:4000/todos/'+props.todo._id)
    //     // .then(() => props.updateState())                    
    //     .catch(err => console.log(err))
    }
    >Delete</button>
    </td>
  </tr>
);

export default class TodosList extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.updateStateHandler = this.updateStateHandler.bind(this);
    this.state = { todos: [] };
  }

  componentDidMount() {
    axios
      .get("http://localhost:4000/todos/")
      .then(response => {
        this.setState({ todos: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  updateStateHandler = () => {
    axios
      .get("http://localhost:4000/todos/")
      .then(res => {
        this.setState({ todos: res.data });
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  handleDelete(id, update_state) {
    axios
      .delete("http://localhost:4000/todos/delete/" + id)
       .then(() => update_state())
      .then(response => {
        console.log("deleted message from frontend");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  todoList(delete_item, update_state, setState) {
    return this.state.todos.map(function(currentTodo, i) {
      return (
        <Todo
          todo={currentTodo}
          key={i}
          setState={setState}
          updateState={update_state}
          delete={delete_item}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h3>Todos List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Responsible</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.todoList(this.handleDelete, this.updateStateHandler, this.setState)}
          </tbody>
        </table>
      </div>
    );
  }
}
