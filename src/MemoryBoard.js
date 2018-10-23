import React, { Component } from 'react';
import MemoryTile from './MemoryTile';

class MemoryBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      numTiles: 4, //default tiles
      started: false, //has game started
      startingMessage: "Match the pairs to win!",
      score: 0,
      firstCard: "",
      firstCardIndex: "",
      secondCard: "",
      secondCardIndex: "",
      matches: 0
    }
    this.createBoard = this.createBoard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.gameWin = this.gameWin.bind(this);
    this.timer = null;
  }

  //Create starting board state
  componentWillMount() {
    this.createBoard(this.state.numTiles);
  }

  startGame() {
    this.setState({
      started: true,
      tiles: [],
      score: 0,
      firstCard: "",
      firstCardIndex: "",
      secondCard: "",
      secondCardIndex: "",
      matches: 0
    });
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

//Check if two cards have been chosen, then decide if they are a match and what to do after
componentDidUpdate() {
  if (this.state.firstCard != "" && this.state.secondCard != "") {
    let firstCard = this.state.firstCard;
    let firstCardIndex = this.state.firstCardIndex;
    let secondCard = this.state.secondCard;
    let secondCardIndex = this.state.secondCardIndex;
    let currentTiles = this.state.tiles;
    let currentScore = this.state.score;
    let matches = this.state.matches;
    let totalMatches = this.state.numTiles / 2;
    //if a match
    if (currentTiles[firstCardIndex].value == currentTiles[secondCardIndex].value) {
      currentScore += 10;
      matches++;
    }
    else {
      currentTiles[firstCardIndex].marked = false;
      currentTiles[secondCardIndex].marked = false;
    }
    //if you have won, call game win on delay
    if (totalMatches == matches) {
      this.timer = setTimeout(() => this.gameWin(), 1000);
    }
    else {
      //haven't won, reset selected cards after a delay
      this.timer = setTimeout(() => this.resetCards(currentTiles, currentScore, matches), 1000);
    }
  }
}

gameWin() {
  this.setState({
    started: false,
    startingMessage: "You won! Congrats!"
  });
  }


  //Called after X seconds from handleClick to allow user to see selection before resetting
  resetCards(currentTiles, currentScore, matches) {
    this.setState({
      tiles: currentTiles,
      firstCard: "",
      firstCardIndex: "",
      secondCard: "",
      secondCardIndex: "",
      score: currentScore,
      matches: matches
    });
    clearInterval(this.timer);
  }

  render() {
    let clickMethod = this.handleClick;
    if (this.state.started) {
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
        <h2>{this.state.startingMessage}</h2>
        <button onClick={this.startGame}>Start New Game</button>
        </div>
      )
    }
  }
}

export default MemoryBoard;
