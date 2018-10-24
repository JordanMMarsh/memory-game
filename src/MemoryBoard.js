import React, { Component } from 'react';
import MemoryTile from './MemoryTile';

class MemoryBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      numTiles: 8, //default tiles
      started: false, //has game started
      startingMessage: "Match the pairs to win!",
      score: 0,
      firstCard: "",
      firstCardIndex: "",
      secondCard: "",
      secondCardIndex: "",
      matches: 0,
      value: "",
      cardImages: ["../images/AC.png","../images/2C.png","../images/3C.png","../images/4C.png","../images/5C.png","../images/6C.png","../images/7C.png","../images/8C.png","../images/9C.png","../images/10C.png","../images/JC.png","../images/QC.png","../images/KC.png","../images/AS.png","../images/2S.png","../images/3S.png","../images/4S.png","../images/5S.png","../images/6S.png","../images/7S.png","../images/8S.png","../images/9S.png","../images/10S.png","../images/JS.png",
      "../images/QS.png","../images/KS.png","../images/AD.png","../images/2D.png","../images/3D.png","../images/4D.png","../images/5D.png","../images/6D.png","../images/7D.png","../images/8D.png","../images/9D.png","../images/10D.png","../images/JD.png","../images/QD.png","../images/KD.png","../images/AH.png","../images/2H.png","../images/3H.png","../images/4H.png","../images/5H.png","../images/6H.png","../images/7H.png","../images/8H.png","../images/9H.png","../images/10H.png",
      "../images/JH.png","../images/QH.png","../images/KH.png"],
      cardBack: ["../images/purple_back.png","../images/blue_back.png","../images/gray_back.png","../images/red_back.png","../images/yellow_back.png"],
      backIndex: 0
    }
    this.createBoard = this.createBoard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.gameWin = this.gameWin.bind(this);
    this.timer = null;
  }

handleChange() {
    let checked = this.state.value;
    if (this.state.value != "checked") checked = "checked";
    else checked = "";
    this.setState({
      value: checked
    });
  }

startGame(e) {
    e.preventDefault();
    let isChecked = this.state.value;
    let numTiles = this.state.numTiles;
    if (isChecked == "checked") numTiles *= 2;
    this.setState({
        tiles: [],
        numTiles: numTiles,
        score: 0,
        firstCard: "",
        firstCardIndex: "",
        secondCard: "",
        secondCardIndex: "",
        matches: 0
      });
      this.createBoard(numTiles);
}

  //Accept an even number and create a random board of tiles with matching pairs
  createBoard(val) {
    let numberTiles = val;
    let newTiles = [];
    let randomNumbers = [];

    let cardBack = Math.floor(Math.random() * (this.state.cardBack.length - 1 + 1))
    //Create pairs of random numbers and push pairs to random number array
    for (let h = 0; h < numberTiles / 2; h++) {
      let randNumber = Math.floor(Math.random()*(this.state.cardImages.length-1+1));
      while (randomNumbers.indexOf(randNumber) != -1) {
        randNumber = Math.floor(Math.random()*(this.state.cardImages.length-1+1));
      }
      randomNumbers.push(randNumber);
      randomNumbers.push(randNumber);
    }

    //Assign each tile in the array an index, a value where every two tiles is a pair, and a default value
    for (let i = 0; i < numberTiles; i++)
    {
      newTiles.push({index: i, value: randomNumbers[i], marked: false, cardBack: cardBack});
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
        started: true,
        tiles: newTiles,
        numTiles: numberTiles,
        backIndex: cardBack
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
      this.timer = setTimeout(() => this.gameWin(), 2000);
    }
    else {
      //haven't won, reset selected cards after a delay
      this.timer = setTimeout(() => this.resetCards(currentTiles, currentScore, matches), 2000);
    }
  }
}

gameWin() {
  if (this.state.started) {
    this.setState({
      started: false,
      startingMessage: "You won! Congrats!"
    });
    clearInterval(this.timer);
    }
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
    let cardImages = this.state.cardImages;
    let cardBack = this.state.cardBack;
    if (this.state.started) {
    return (
      <div>
      <h2>Score: {this.state.score}</h2><br />
      <div className="MemoryBoard">
      {this.state.tiles.map(function(item, i) {
        return <MemoryTile index={item.index} value={item.value} marked={item.marked} handleClick={clickMethod} frontImage={cardImages[item.value]} backImage={cardBack[item.cardBack]}/>;
      })}
      </div></div>
    );}
    else {
      return (
        <div>
        <form onSubmit={this.startGame}>
        <h2>{this.state.startingMessage}</h2><br/>
        <p>Hard Mode:</p>
        <label className="switch">
        <input type="checkbox" onChange={this.handleChange} checked={this.state.value}/>
        <span className="slider round"></span>
        </label><br /><br />
        <input id="buttonSubmit" type="submit" value="Start Game" />
        </form>
        </div>
      )
    }
  }
}

export default MemoryBoard;
