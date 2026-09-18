import React, {Component} from "react";
import Pokecard from "./Pokecard.js";
import './Pokedex.css';

class Pokedex extends Component {
        
        render() {
            let title;
            if (this.props.isWinner) {
                title = <h2 className="Pokedex-winner">Winner!</h2>;
            } else {
                title = <h2 className="Pokedex-loser">Loser!</h2>;
            }
            return (
                <div className="Pokedex Pokedex-hand">
                    {title}
                    <h4>Total Experiance: {this.props.exp}</h4>
                    <div className="Pokedex-cards-container">
                        {this.props.pokemonList.map(card => (
                            <Pokecard id={card.id} name={card.name} type={card.type} exp={card.base_experience} />
                        ))}
                    </div>
                </div>
            )
        }
}

export default Pokedex;