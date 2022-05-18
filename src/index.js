import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//class Square extends React.Component {
  //constructor(props){
    //super(props); //need to always call super when defining
                  //a constructor of a subclass
                  //in React, all React component classes
                  //that have a constructor should start with
                  //a super(props)
    //this.state = {
      //value: null,
    //};
  //}
function Square(props){ //new line added
  //render() { //onClick={() => this.props.onClick()} vvv
    return (
      <button className="square" onClick={props.onClick}> 
        {props.value}
      </button>
    );
  }
//}

/*To collect data from multiple children, or to have 
two child components communicate with each other, 
you need to declare the shared state in their 
parent component instead. The parent component 
can pass the state back down to the children by 
using props; this keeps the child components in sync 
with each other and with the parent component.*/ 
class Board extends React.Component {
 
 // When a Square is clicked, the onClick function provided by the Board is called. Here’s a review of how this is achieved:

 // The onClick prop on the built-in DOM <button> component tells React to set up a click event listener.
 // When the button is clicked, React will call the onClick event handler that is defined in Square’s render() method.
 // This event handler calls this.props.onClick(). The Square’s onClick prop was specified by the Board.
 // Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls the Board’s handleClick(i) when clicked.

//changing code again to lift state up from Board to Game (so game can store history)
//Delete the constructor in Board.
//Replace this.state.squares[i] with this.props.squares[i] in Board’s renderSquare.
//Replace this.handleClick(i) with this.props.onClick(i) in Board’s renderSquare.
/* handleClick(i) {
  const squares = this.state.squares.slice();
  if (calculateWinner(squares) || squares[i]) {
    return;
  }
  squares[i] = this.state.xIsNext ? 'X' : 'O';
  this.setState({
    squares: squares,
    xIsNext: !this.state.xIsNext,
  });
}*/

  renderSquare(i) {
    return (<Square value={this.props.squares[i]}
           onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
