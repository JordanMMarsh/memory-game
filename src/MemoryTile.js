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
    return (
      <div className={this.props.marked ? 'flip-container flip' : 'flip-container'}  onClick={this.handleClick}>
	     <div className="flipper">
		     <div className="front">
         <img className="cardBack" src={this.props.backImage} alt="Back of playing card" />
		     </div>
		     <div className="back">
         <div>
          <img className="cardFront" src={this.props.frontImage} alt="Front of playing card" />
         </div>
		     </div>
	     </div>
      </div>

    );
  }
}

export default MemoryTile;
