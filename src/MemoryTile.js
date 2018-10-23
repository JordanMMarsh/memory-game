import React, { Component } from 'react';

class MemoryTile extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  //If card hasn't already been clicked, send it to parent as a click event
  handleClick() {
    if (!this.props.marked) {
      this.props.handleClick(this.props.index);
    }
  }

  render() {
    let isMarked = "";
    if (this.props.marked) isMarked = "M";
    return (
      <div className="MemoryTile" onClick={this.handleClick}>
        <p>{this.props.value} {isMarked}</p>
      </div>
    );
  }
}

export default MemoryTile;
