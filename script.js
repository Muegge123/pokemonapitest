let urlDitto = "https://pokeapi.co/api/v2/pokemon/ditto";
let loadedPokemonArray = [];
let currentPokemon;

function init() {
  loadPokemon();
}

async function loadPokemon() {
  //const url = `https://pokeapi.co/api/v2/pokemon/${i}`;

  for (let i = 1; i < 100; i++) {
    let resCurrentPokemon = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${i}`
    );
    let resCurrentPokemonAsJSON = await resCurrentPokemon.json();
    loadedPokemonArray.push(resCurrentPokemonAsJSON);
  }
  renderPokemonCard();
}

function renderPokemonCard() {
  document.getElementById("pokedex").innerHTML = "";
  for (let i = 0; i < loadedPokemonArray.length; i++) {
    document.getElementById("pokedex").innerHTML += returnPokemonCardHTML(i);
  }
}

// function to render dialog for pokemon
function renderPokemonDialog(indexOfPokemon) {
  // show dialog and remove d-none class from dialog-shadow-div
  removeClass("dialog-shadow", "d-none");
  renderBasicInfoDialog(indexOfPokemon);
  renderCharacteristics(indexOfPokemon);
  renderStats(indexOfPokemon);
  renderEvolution(indexOfPokemon);
  fetchMoves(indexOfPokemon);
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

// dialog : render characteristics
async function renderCharacteristics(indexOfPokemon) {
  let urlCharacteristics = "https://pokeapi.co/api/v2/characteristic/";
  let idOfPokemon = indexOfPokemon + 1;
  let responseCharacteristics = await fetch(urlCharacteristics + idOfPokemon);
  let characteristicsData = await responseCharacteristics.json();
  console.log(`characteristicsData == ${characteristicsData}`);
  console.log(characteristicsData.descriptions[4].description);
  document.getElementById("dialog-content-characteristics").innerHTML =
    characteristicsData.descriptions[4].description;
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

/// test
async function fetchMoves(indexOfPokemon) {
  let pokemonId = loadedPokemonArray[indexOfPokemon]["id"];
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    const moves = data.moves.map((move) => move.move.name);
    console.log(moves);
    document.getElementById("dialog-content-moves").innerHTML =
      moves.join(", ");
    // moves.forEach((move) => {
    //   document.getElementById(
    //     "dialog-content-moves"
    //   ).innerHTML += `<div>${move}</div>`;
    // });
  } catch (error) {
    console.error("Error fetching moves:", error);
  }
}

// async function fetchEvolutions(indexOfPokemon) {
//   const pokemonId = indexOfPokemon;
//   const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     // Die URL zur Evolution Chain abrufen
//     const evolutionChainUrl = data.evolution_chain.url;
//     const evolutionChainResponse = await fetch(evolutionChainUrl);
//     const evolutionChainData = await evolutionChainResponse.json();

//     // Funktion zur Rekursiven Verarbeitung der Evolutionskette
//     function processEvolutions(evolutionDetails) {
//       const evolutionStages = [evolutionDetails.species.name];
//       if (evolutionDetails.evolves_to.length > 0) {
//         evolutionDetails.evolves_to.forEach((evolution) => {
//           evolutionStages.push(...processEvolutions(evolution));
//         });
//       }
//       return evolutionStages;
//     }

//     const evolutionStages = processEvolutions(evolutionChainData.chain);
//     console.log(evolutionStages);
//   } catch (error) {
//     console.error("Error fetching evolutions:", error);
//   }
// }
