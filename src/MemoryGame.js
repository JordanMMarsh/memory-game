import React, { Component } from 'react';
import MemoryBoard from './MemoryBoard';

class MemoryGame extends Component {
  render() {
    return (
      <div className="MemoryGame">
      <h2>Memory Game</h2>
      <MemoryBoard />
      </div>
    );
  }
}

export default MemoryGame;
