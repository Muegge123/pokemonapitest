let urlDitto = "https://pokeapi.co/api/v2/pokemon/ditto";
let loadedPokemonArray = [];
let currentPokemon;

// colors from: https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3
const colors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

let numberPokemonLoaded = 1;

function init() {
  loadPokemon(1);
}

async function loadPokemon(nextNumberToLoad) {
  const url = `https://pokeapi.co/api/v2/pokemon/`;

  for (let i = nextNumberToLoad; i < nextNumberToLoad + 21; i++) {
    // pokemon data
    let resCurrentPokemon = await fetch(`${url}${i}`);
    let resCurrentPokemonAsJSON = await resCurrentPokemon.json();
    loadedPokemonArray.push(resCurrentPokemonAsJSON);
  }
  renderPokemonCard();
  numberPokemonLoaded = numberPokemonLoaded + 21;
}

// button "load more" function
function loadMorePokemon() {
  loadPokemon(numberPokemonLoaded);
}

// render pokemon cards (color of cards = compare type.name of pokemon with colors-array from github-list)
function renderPokemonCard() {
  document.getElementById("pokedex").innerHTML = "";
  for (let i = 0; i < loadedPokemonArray.length; i++) {
    let color = loadedPokemonArray[i]["types"][0]["type"]["name"];
    document.getElementById("pokedex").innerHTML += returnPokemonCardHTML(
      i,
      color
    );
  }
}

// function to render dialog for pokemon
function renderPokemonDialog(indexOfPokemon) {
  // show dialog and remove d-none class from dialog-shadow-div
  setBackgroundColorDialog(indexOfPokemon);
  removeClass("dialog-shadow", "d-none");
  renderBasicInfoDialog(indexOfPokemon);
  renderStats(indexOfPokemon);
  renderEvolution(indexOfPokemon);
  renderAbilities(indexOfPokemon);
}

// sets the right background-color for dialog/pokemon
function setBackgroundColorDialog(indexOfPokemon) {
  let color = loadedPokemonArray[indexOfPokemon]["types"][0]["type"]["name"];
  console.log(color);
  console.log(colors[`${color}`]);
  let backgroundColor = colors[`${color}`];
  document.getElementById("dialog").style.backgroundColor = backgroundColor;
}

// dialog : function renders basic Infos of Pokemon Dialog
function renderBasicInfoDialog(indexOfPokemon) {
  // render basic info of pokemon and display in dialog
  document.getElementById("dialog-navi").innerHTML = "";
  document.getElementById("dialog-navi").innerHTML +=
    returnDialogNaviHTML(indexOfPokemon);
  // render name of Pokemon
  document.getElementById("dialog-pokemon-name").textContent =
    loadedPokemonArray[indexOfPokemon]["species"]["name"];
  // render img of Pokemon
  document.getElementById("pokemon-single-img").src =
    loadedPokemonArray[indexOfPokemon]["sprites"]["other"]["official-artwork"][
      "front_default"
    ];
  // render ID of pokemon
  document.getElementById(
    "dialog-pokemon-id"
  ).textContent = `#${loadedPokemonArray[indexOfPokemon]["id"]}`;
}

// dialog : render stats
function renderStats(indexOfPokemon) {
  document.getElementById("dialog-content-data").innerHTML = "";
  for (let i = 0; i < loadedPokemonArray[indexOfPokemon]["stats"].length; i++) {
    document.getElementById(
      "dialog-content-data"
    ).innerHTML += `<div>${loadedPokemonArray[indexOfPokemon]["stats"][i]["stat"]["name"]}: ${loadedPokemonArray[indexOfPokemon]["stats"][i]["base_stat"]}</div>`;
  }
}

// render evolution of Pokemon species
async function renderEvolution(indexOfPokemon) {
  let evolutionInfoContainer = document.getElementById("dialog-content-evo");
  evolutionInfoContainer.innerHTML = "";
  // set url for species + id of pokemon ad fetch species data
  let urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${loadedPokemonArray[indexOfPokemon]["id"]}/`;
  let speciesData = await fetch(urlSpecies);
  let speciesDataAsJSON = await speciesData.json();
  // species data contains url for evolution_chain --> fetch evolution data
  let urlEvolutionChain = speciesDataAsJSON["evolution_chain"]["url"];
  let evolutionData = await fetch(urlEvolutionChain);
  let evolutionDataAsJSON = await evolutionData.json();
  // check first evolution
  evolutionInfoContainer.innerHTML += getFirstEvolutionImg(evolutionDataAsJSON);
  // check second evolution
  evolutionInfoContainer.innerHTML +=
    getSecondEvolutionImg(evolutionDataAsJSON);
  // check third evolution
  evolutionInfoContainer.innerHTML += getThirdEvolutionImg(evolutionDataAsJSON);
}

// helper function to renderEvolution() --> renders first evolution img
function getFirstEvolutionImg(evolutionDataAsJSON) {
  try {
    let firstEvolutionImg = evolutionDataAsJSON["chain"]["species"]["url"];
    let idOfPokemonFirstEvo = firstEvolutionImg.slice(42).slice(0, -1);
    return `<img class="evolution-img" src="${
      loadedPokemonArray[idOfPokemonFirstEvo - 1]["sprites"]["other"][
        "official-artwork"
      ]["front_default"]
    }">`;
  } catch (error) {
    return "";
  }
}

// helper function to renderEvolution() --> renders second evolution img
function getSecondEvolutionImg(evolutionDataAsJSON) {
  try {
    let secondEvolutionImg =
      evolutionDataAsJSON["chain"]["evolves_to"][0]["species"]["url"];
    let idOfPokemonSecondEvo = secondEvolutionImg.slice(42).slice(0, -1);
    return `<img class="evolution-img" src="${
      loadedPokemonArray[idOfPokemonSecondEvo - 1]["sprites"]["other"][
        "official-artwork"
      ]["front_default"]
    }">`;
  } catch (error) {
    return "";
  }
}

// helper function to renderEvolution() --> renders third evolution img
function getThirdEvolutionImg(evolutionDataAsJSON) {
  try {
    let thirdEvolutionImg =
      evolutionDataAsJSON["chain"]["evolves_to"][0]["evolves_to"][0]["species"][
        "url"
      ];
    let idOfPokemonThirdEvo = thirdEvolutionImg.slice(42).slice(0, -1);
    return `<img class="evolution-img" src="${
      loadedPokemonArray[idOfPokemonThirdEvo - 1]["sprites"]["other"][
        "official-artwork"
      ]["front_default"]
    }">`;
  } catch (error) {
    return "";
  }
}

// render abilities
function renderAbilities(indexOfPokemon) {
  // let abilities =  loadedPokemonArray[indexOfPokemon]["abilities"][0]["ability"]["name"]
  let abilities = loadedPokemonArray[indexOfPokemon]["abilities"];
  document.getElementById("dialog-content-moves").innerHTML = "";
  for (let i = 0; i < abilities.length; i++) {
    console.log(abilities[i]["ability"]["name"]);
    document.getElementById(
      "dialog-content-moves"
    ).innerHTML += `<div class="single-move">${abilities[i]["ability"]["name"]}</div>`;
  }
}

// function to close dialog by clicking outside dialog
function closeDialog() {
  toggleClass("dialog-shadow", "d-none");
}

// ##### multi helper functions #####
// toggle class from classlist
function toggleClass(elementID, classToRemove) {
  document.getElementById(elementID).classList.toggle(classToRemove);
}

// add class from classlist
function addClass(elementID, classToRemove) {
  document.getElementById(elementID).classList.add(classToRemove);
}

// remove class from classlist
function removeClass(elementID, classToRemove) {
  document.getElementById(elementID).classList.remove(classToRemove);
}

// ##### options to render from pokemon api ==> not used on current pokemon card layout #####
/// render moves ==> optional / not used on current pokemon card
async function fetchMoves(indexOfPokemon) {
  let pokemonId = loadedPokemonArray[indexOfPokemon]["id"];
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    // console.log(data);
    const moves = data.moves.map((move) => move.move.name);
    // console.log(moves);
    // document.getElementById("dialog-content-moves").innerHTML =
    // moves.join(", ");
    // console.log(moves);
    moves.forEach((move) => {
      document.getElementById(
        "dialog-content-moves"
      ).innerHTML += `<div class="single-move">${move}</div>`;
    });
  } catch (error) {
    console.error("Error fetching moves:", error);
  }
}

// dialog : render characteristics ==> optional / not used on current pokemon card
async function renderCharacteristics(indexOfPokemon) {
  let urlCharacteristics = "https://pokeapi.co/api/v2/characteristic/";
  let idOfPokemon = indexOfPokemon + 1;
  let responseCharacteristics = await fetch(urlCharacteristics + idOfPokemon);
  let characteristicsData = await responseCharacteristics.json();
  document.getElementById("dialog-content-characteristics").innerHTML =
    characteristicsData.descriptions[4].description;
}
