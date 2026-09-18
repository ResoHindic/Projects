import React, {Component} from "react";
import './Pokecard.css';

// const POKE_API = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const fancyPokeApi = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";

const imageId = (id) => id.toString().padStart(3, '0');

class Pokecard extends Component {

    render() {
        let imageSrc = `${fancyPokeApi}${imageId(this.props.id)}.png`;
        console.log(imageSrc);

        return (
            <div className="Pokecard">
                <h1 className="Pokecard-title">{this.props.name}</h1>
                <div className="Pokecard-image">
                    <img src={imageSrc} alt={this.props.name} />
                </div>
                <div className="Pokecard-data">Type: {this.props.type}</div>
                <div className="Pokecard-data">EXP: {this.props.exp}</div>
            </div>
        );
    }
}

export default Pokecard;