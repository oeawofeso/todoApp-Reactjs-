import React, { Component } from "react";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
import "./my-task-list.css";

class MyTaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: "",
      tasklist: []
    };
  }

  // on load get the task list
  componentDidMount = () => {
    this.getTasks();
  };

  //Handles event listeners in regards to buttons user decides to click and will provide the appropriate function/response
  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // add task to the list
  onSubmit = () => {
    // check is task is empty string
    if (this.state.task) {
      // get the task list from the local storage
      let tasklist = JSON.parse(localStorage.getItem("tasklist"));

      // task list is null means empty
      // create an empty list
      if (tasklist == null) {
        tasklist = [];
      }

      // create task object
      // default status is false meaning it was not completed yet
      let task = {
        task: `? ${this.state.task}`,
        status: false
      };

      // add the task to the task list
      tasklist.push(task);

      // save the task list in the local storage
      localStorage.setItem("tasklist", JSON.stringify(tasklist));

      // clear the form
      this.setState({ task: "" });

      // refresh the tasks
      this.getTasks();
    }
  };

  //Empties list using the splice method, and re-assigns the empty array back into the locak storage
  emptyList = () => {
    //Get tasklist from
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));
    //Empties list
    tasklist.splice(0, tasklist.length);
    // save the updated task list
    localStorage.setItem("tasklist", JSON.stringify(tasklist));
    // refresh the task list
    this.getTasks();        
  };

  // get all the tasks
  getTasks = () => {
    // get the task list from the local storage
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));

    // check if task list is empty
    if (tasklist) {
      // sort all the tasks on the basis of status
      // completed task will move down
      tasklist = tasklist.sort((a, b) => {
        if (a.status) {
          return 1;
        } else if (b.status) {
          return -1;
        }
        return 0;
      });

      // save the task list in the local storage
      localStorage.setItem("tasklist", JSON.stringify(tasklist));

      // set the tasklist to the state
      this.setState({
        // default color
        // Incomplete: yellow
        // complete: green
        tasklist: tasklist.map((item, index) => {
          let color = "red";
          let cardBackground = { background: "whitesmoke" };
          let taskComplete = { textDecoration: "none" };

          if (item.status) {
            color = "green";
            cardBackground.background = "beige";
            taskComplete["textDecoration"] = "line-through";
          }
          return (
            <Card key={index} color={color} fluid style={cardBackground}>
              <Card.Content>
                <Card.Header textAlign="left" style={taskComplete}>
                  <div style={{ wordWrap: "break-word" }}>{item.task}</div>
                </Card.Header>

                <Card.Meta textAlign="right">
                  <Icon
                    link
                    name="check circle"
                    color="green"
                    onClick={() => this.updateTask(index)}
                  />
                  <span style={{ paddingRight: 10 }}>Done</span>
                  <Icon
                    link
                    name="undo"
                    color="yellow"
                    onClick={() => this.undoTask(index)}
                  />
                  <span style={{ paddingRight: 10 }}>Undo</span>
                  <Icon
                    link
                    name="delete"
                    color="red"
                    onClick={() => this.deleteTask(index)}
                  />
                  <span style={{ paddingRight: 10 }}>Delete</span>
                </Card.Meta>
              </Card.Content>
            </Card>
          );
        })
      });
    }
  };

  // update the task status to true
  updateTask = index => {
    // get the task list from the local storage
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));
    // change status to true
    tasklist[index].status = true;
    // save the updated task list
    localStorage.setItem("tasklist", JSON.stringify(tasklist));
    // refresh the task list
    this.getTasks();
  };

  // undone the task status from true to false
  undoTask = index => {
    // get the task list from the local storage
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));
    // change status to false
    tasklist[index].status = false;
    // save the updated task list
    localStorage.setItem("tasklist", JSON.stringify(tasklist));
    // refresh the task list
    this.getTasks();
  };

  // delete the task from the task list
  deleteTask = index => {
    // get the task list from the local storage
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));
    // remove the task from the task list
    tasklist.splice(index, 1);
    // save the updated task list
    localStorage.setItem("tasklist", JSON.stringify(tasklist));
    // refresh the task list
    this.getTasks();
  };

  render() {
    let color = null;
    return (
      <div>
        <div>
          <Header as="h1">
            <div className="app-header">My To Do List</div>{" "}
          </Header>

          <div className="empty-header">
            <Icon
              link
              name="trash"
              color="red"
              onClick={() => this.emptyList()}
              />
            <span style={{ paddingRight: 20, color: "black",  }}>Empty To Do List</span>   
          </div>
        </div>

        <div className="app-form">
          <Form onSubmit={this.onSubmit}>
            <Input
              type="text"
              name="task"
              onChange={this.onChange}
              value={this.state.task}
              fluid
              placeholder="Enter task..."
            />
          </Form>
        </div>
        <div>
          <Card.Group>{this.state.tasklist}</Card.Group>
        </div>
      </div>
    );
  }
}

export default MyTaskList;