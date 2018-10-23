import React, { Component } from 'react';
import MemoryTile from './MemoryTile';

class MemoryBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      numTiles: 6,
      started: false
    }
    this.createBoard = this.createBoard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //Create starting board state
  componentWillMount() {
    this.createBoard(this.state.numTiles);
  }

  //Accept an even number and create a random board of tiles with matching pairs
  createBoard(val) {
    let numberTiles = val;
    let newTiles = [];
    let randomNumbers = [];

    //Create pairs of random numbers and push pairs to random number array
    for (let h = 0; h < numberTiles / 2; h++) {
      let randNumber = Math.floor(Math.random() * 100);
      randomNumbers.push(randNumber);
      randomNumbers.push(randNumber);
    }

    //Assign each tile in the array an index, a value where every two tiles is a pair, and a default value
    for (let i = 0; i < numberTiles; i++)
    {
      newTiles.push({index: i, value: randomNumbers[i], marked: false});
    }

    //Shuffle array using Fisher-Yates Shuffle
    let currentIndex = newTiles.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = newTiles[currentIndex];
      newTiles[currentIndex] = newTiles[randomIndex];
      newTiles[randomIndex] = temporaryValue;
    }

    this.setState({
        tiles: newTiles,
        numTiles: numberTiles,
    });
  }

  handleClick(val) {
    let currentTiles = this.state.tiles;
    for (let i = 0; i < currentTiles.length; i++) {
      if (currentTiles[i].index == val) {
        currentTiles[i].marked = !currentTiles[i].marked;
        this.setState({
          tiles: currentTiles
        });
        return;
      }
    }
  }

  startGame() {
    this.setState({
      started: true
    });
  }

  render() {
    let gameStarted = this.state.started;
    let clickMethod = this.handleClick;
    if (gameStarted) {
    return (
      <div className="MemoryBoard">
      {this.state.tiles.map(function(item, i) {
        return <MemoryTile index={item.index} value={item.value} marked={item.marked} handleClick={clickMethod} />;
      })}
      </div>
    );}
    else {
      return (
        <div>
        <button onClick={this.startGame}>Start New Game</button>
        </div>
      )
    }
  }
}

export default MemoryBoard;
