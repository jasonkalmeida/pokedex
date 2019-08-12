import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './App.scss';

function SearchBar(props){
  const [suggest, setSuggest] = useState([]);
  const listPoke = suggest.map((sug, index) =>
    <li className="suggestItem" onClick={(event)=> props.updateCurrent(event.target.innerHTML.charAt(0).toUpperCase() + event.target.innerHTML.slice(1).toLowerCase())} key={index}>{sug}</li>
  );

  useEffect(() => {
    let tempSug = findSug(props.currentSearch, props.pokeNames);
    //console.log(tempSug);
    setSuggest(tempSug);
  }, [props.currentSearch, props.pokeNames]);


  return(
    <div className="searchBar">
      <input className="searchInput" type="text" value={props.currentSearch} onChange={(event) => props.updateCurrent(event.target.value)} placeholder="Search Pokédex..."></input>
      {
        suggest.length > 0 && props.currentPoke == null &&
          <ul id="suggestList">
            {listPoke}
          </ul>
      }
    </div>
  )
}

function findSug(word, names){
  /*for(let name in names){
    console.log(name);
  }*/

  var matches = [];
  if(word.length !== 0)
  {
    names.forEach((name) => {
      //console.log(name);
      if(name.indexOf(word.toLowerCase()) === 0 && name.length !== word.length){
        matches.push(name);
      }
    });
  }

  return matches;
}

function Dashboard(props){

  if(props.currentPoke != null)
  {
    return(
      <div className = "dashBoard">
        <h1>{props.currentPoke['name'].charAt(0).toUpperCase() + props.currentPoke['name'].slice(1).toLowerCase()}</h1>
        <img alt={props.currentPoke['name'].charAt(0).toUpperCase() + props.currentPoke['name'].slice(1).toLowerCase()} src={props.currentPoke['sprites']['front_default']}></img>
      </div>
    );
  }
  else {
    return(
      null
    );
  }

}

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [pokeNames, setNames] = useState(null)
  //ADD EASTER EGGS
  useEffect(() => {
    //console.log("In here");
    fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151')
      .then(res=>res.json())
      .then(data=>{
        var holdNames = []
        for(let item of data.results){
          holdNames.push(item['name']);
        }
        setNames(holdNames);
        setPokemon(data.results);
      });

  }, []);


  const [currentPoke, setCurrentPoke] = useState(null);
  const [currentSearch, setCurrentSearch] = useState('');

  useEffect(() => {

    if(pokeNames !== null && pokeNames.indexOf(currentSearch.toLowerCase()) !== -1){
      //setCurrentPoke(currentSearch.charAt(0).toUpperCase() + currentSearch.slice(1).toLowerCase());
      //console.log("Found a pokemon");
      let id = pokeNames.indexOf(currentSearch.toLowerCase()) + 1;
      fetch('https://pokeapi.co/api/v2/pokemon/' + id)
        .then(res=>res.json())
        .then(data=>setCurrentPoke(data));

    } else {
      setCurrentPoke(null);
    }

  }, [currentSearch, pokeNames]);



  if(! pokemon){
    return(
      <h1>Loading</h1>
    );
  }

  return (
    <div className="App">
      <SearchBar currentPoke={currentPoke} pokeNames ={pokeNames} currentSearch={currentSearch} updateCurrent={(newSearch) => setCurrentSearch(newSearch)} />
      <Dashboard currentPoke={currentPoke} />
    </div>
  );
}

export default App;
