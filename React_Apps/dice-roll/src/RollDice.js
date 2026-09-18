import React, { Component } from "react";
import Die from './Die.js';
import './RollDice.css';

class RollDice extends Component {

    static defaultProps = {
        sides: ['one', 'two', 'three', 'four', 'five', 'six']
    }

    constructor(props) {
        super(props);
        this.state = { die1: 'one', die2: 'one', isRolling: false };
        this.rollDice = this.rollDice.bind(this);
    }

    rollDice = () => {

        const newDie1 = this.props.sides[
            Math.floor(Math.random() * this.props.sides.length)
        ];
        const newDie2 = this.props.sides[
            Math.floor(Math.random() * this.props.sides.length)
        ];
        this.setState({ isRolling: true });
        
        setTimeout(() => {
            this.setState({ die1: newDie1, die2: newDie2 });
        }, 750);

        setTimeout(() => {
            this.setState({ isRolling: false });
        }, 1000);
    }

    render() {
        return (
            <div className="RollDice">
                <div>
                    <Die face={this.state.die1} shake={this.state.isRolling} />
                    <Die face={this.state.die2} shake={this.state.isRolling} />
                </div>
                <div className="RollDice">
                    <button disabled={this.state.isRolling} onClick={this.rollDice}>
                        {this.state.isRolling ? "Rolling..." : "Roll Dice"}
                    </button>
                </div>
            </div>
        )
    }
}

function countResponseTimeRegressions(responseTimes) {
    let sum = 0;
    let count = 0;

    if(responseTimes.length === 0 || responseTimes.length === 1) {
        return 0;
    }

    for(let i = 1; i < responseTimes.length; i++) {
        if(responseTimes[i] > (sum / i)) {
            count++;
        }
        sum += responseTimes[i];{

    }
    return count;
}

export default RollDice;