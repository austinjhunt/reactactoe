import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            x_is_next: true,
            step_number: 0, // initialize what step we are on
        }
    }
    jumpTo(step){
        this.setState({
            step_number: step,
            x_is_next: (step % 2) === 0, // x is next if step number is even
        });
    }
    handleClick(i) {
        /*
        This ensures that if we “go back in time” and then make a new move from that point,
         we throw away all the “future” history that would now become incorrect.
         */
        const game_history = this.state.history.slice(0, this.state.step_number + 1 );
        const current = game_history[game_history.length - 1]; // current is last element of history
        // if someone has already won, or if the square is already filled
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            alert('ignoring that click...');
            return ;
        }

        // update i'th square to X if x is next, else O
        squares[i] = this.state.x_is_next ? 'X' : 'O';
        // add to history
        this.setState({
            // unlike the array push() method, concat() mdoesn't mutate original array,
            // so it is better
            history: game_history.concat([{
                squares: squares
            }]),
            step_number: game_history.length, // This ensures we don’t get stuck showing the same move after a new one has been made.
            x_is_next: !this.state.x_is_next, // if x just went, o should go next
        });

    }


    render() {
        const history = this.state.history;
        const current = history[this.state.step_number]; //  render the currently selected move according to step number
        const winner = calculateWinner(current.squares); // see if there is a winner for the game
        let status;
        if (winner){
            status = 'Winner: ' + winner;
        }
        else {
            status = 'Next player: ' + (this.state.x_is_next ? 'X': 'O');
        }


        const moves = history.map((step, move) => {
            // if move is not null/ is true, set description to go to that move number
            // otherwise set description to go to game start
            const description = move ?
                'Go to move #' + move :
                'Go to game start';
            /*
            It’s strongly recommended that you assign proper keys whenever you
            build dynamic lists. If you don’t have an appropriate key,
            you may want to consider restructuring your data so that you do.
            Explicitly passing key={i} silences the warning but has the
            same problems as array indices and is not recommended in most cases.
            Keys do not need to be globally unique; they only need to
            be unique between components and their siblings
            */

            /*
            In the tic-tac-toe game’s history, each past move has a unique ID
             associated with it: it’s the sequential number of the move.
             The moves are never re-ordered, deleted, or inserted in the middle,
              so it’s safe to use the move index as a key.
              In the Game component’s render method, we can add the key as
              <li key={move}> and React’s warning about keys should disappear:
            */
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {description}
                    </button>
                </li>
            )
        })
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

/*
To collect data from multiple children, or to have two child
components communicate with each other, you need to declare
the shared state in their parent component instead. The parent
component can pass the state back down to the children by
using props; this keeps the child components in sync with
each other and with the parent component.
*/
class Board extends React.Component {

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
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
        /* Each Square will now receive a value prop that will either be
        'X', 'O', or null for empty squares.*/
    }
}


/* refactor square to be a function component instead of a class component */
// class Square extends React.Component {
//     render() {
//         /*
//         when a square is clicked, the onclick function
//         provided by Board (the parent shared by all squares) is called
//         Since the Board passed onClick={() => this.handleClick(i)} to Square,
//         the Square calls this.handleClick(i) when clicked.
//         */
//         return (
//             <button
//                 className="square"
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         )
//     }
// }

function Square(props){
    return (
        <button
            className="square"
            onClick={ props.onClick }
        >
            {props.value}
        </button>
    );
    /*
        When we modified the Square to be a function component,
        we also changed onClick={() => this.props.onClick()}
        to a shorter onClick={props.onClick} (note the lack of
        parentheses on both sides).
    */

}

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]; // all the possible ways to win
    for (let i = 0; i < lines.length; i ++) {
        const [a,b,c] = lines[i];
        // if it's not null anymore (it's filled) and all three squares have same content
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

// ========================================
// render the game
ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
