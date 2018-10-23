import React, { Component } from 'react';

class MemoryTile extends Component {
  render() {
    let isMarked = "";
    if (this.props.marked) isMarked = "M";
    return (
      <div className="MemoryTile" onClick={() => this.props.handleClick(this.props.index)}>
        <p>{this.props.value} {isMarked}</p>
      </div>
    );
  }
}

export default MemoryTile;

/*{this.state.tiles.map(function(item, i) {
  return <MemoryTile index={item[i].index} value={item[i].value} marked={item[i].marked} handleClick={this.handleClick} />;
})}*/
