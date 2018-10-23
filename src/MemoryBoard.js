import React, { Component } from 'react';
import MemoryTile from './MemoryTile';

class MemoryBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      numTiles: 12, //default tiles
      started: false, //has game started
      marked: false, //true when a card is already marked for matching
      score: 0,
      firstCard: "",
      firstCardIndex: "",
      secondCard: "",
      secondCardIndex: ""
    }
    this.createBoard = this.createBoard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.timer = null;
  }

  //Create starting board state
  componentWillMount() {
    this.createBoard(this.state.numTiles);
  }

  startGame() {
    this.setState({
      started: true
    });
  }

  //Accept an even number and create a random board of tiles with matching pairs
  createBoard(val) {
    let numberTiles = val;
    let newTiles = [];
    let randomNumbers = [];

    //Create pairs of random numbers and push pairs to random number array
    for (let h = 0; h < numberTiles / 2; h++) {
      let randNumber = Math.floor(Math.random() * 100);
      while (randomNumbers.indexOf(randNumber) != -1) {
        randNumber = Math.floor(Math.random() * 100);
      }
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

  //val = index of tile pressed
  handleClick(val) {
    let currentTiles = this.state.tiles;
    if (this.state.firstCard == "") {
      for (let i = 0; i < currentTiles.length; i++) {
        if (currentTiles[i].index == val) {
          //set tile to marked, update state with current tile for later use
          currentTiles[i].marked = !currentTiles[i].marked;
          this.setState({
            tiles: currentTiles,
            marked: true,
            firstCard: currentTiles[i],
            firstCardIndex: i
          });
          return;
        }
      }
    }
    else if(this.state.secondCard == "") {
      for (let i = 0; i < currentTiles.length; i++) {
        if (currentTiles[i].index == val) {
          //set tile to marked, update state with current tile for later use
          currentTiles[i].marked = !currentTiles[i].marked;
          this.setState({
            tiles: currentTiles,
            marked: true,
            secondCard: currentTiles[i],
            secondCardIndex: i
          });
          return;
        }
      }
    }
}

componentDidUpdate() {
  if (this.state.firstCard != "" && this.state.secondCard != "") {
    let firstCard = this.state.firstCard;
    let firstCardIndex = this.state.firstCardIndex;
    let secondCard = this.state.secondCard;
    let secondCardIndex = this.state.secondCardIndex;
    let currentTiles = this.state.tiles;
    let currentScore = this.state.score;
    if (currentTiles[firstCardIndex].value == currentTiles[secondCardIndex].value) {
      currentScore += 10;
    }
    else {
      currentTiles[firstCardIndex].marked = false;
      currentTiles[secondCardIndex].marked = false;
    }
    this.timer = setTimeout(() => this.resetCards(currentTiles, currentScore), 1000);
  }
}


  //Called after X seconds from handleClick to allow user to see selection before resetting
  resetCards(currentTiles, currentScore) {
    this.setState({
      tiles: currentTiles,
      marked: false,
      firstCard: "",
      firstCardIndex: "",
      secondCard: "",
      secondCardIndex: "",
      score: currentScore
    });
    clearInterval(this.timer);
  }

  render() {
    let gameStarted = this.state.started;
    let clickMethod = this.handleClick;
    if (gameStarted) {
    return (
      <div>
      <h2>Score: {this.state.score}</h2><br />
      <div className="MemoryBoard">
      {this.state.tiles.map(function(item, i) {
        return <MemoryTile index={item.index} value={item.value} marked={item.marked} handleClick={clickMethod} />;
      })}
      </div></div>
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
