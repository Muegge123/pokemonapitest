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
  // console.log(loadedPokemonArray);
  // console.log(loadedPokemonArray[1]["id"]);
  // console.log(loadedPokemonArray[1]["stats"][2]);
  // console.log(loadedPokemonArray[4]["stats"].length);

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
  renderStats(indexOfPokemon);
  renderEvolution(indexOfPokemon);
}

// function renders basic Infos of Pokemon Dialog
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
  console.log(`urlEvolutionChain: ${urlEvolutionChain}`);
  let evolutionData = await fetch(urlEvolutionChain);
  let evolutionDataAsJSON = await evolutionData.json();
  // check first evolution
  try {
    let firstEvolution = evolutionDataAsJSON["chain"]["species"]["name"];
    console.log(`firstEvolution: ${firstEvolution}`);
    evolutionInfoContainer.innerHTML += `<div>${firstEvolution}</div>`;
    let firstEvolutionImg = evolutionDataAsJSON["chain"]["species"]["url"];
    console.log(`url komplett ${firstEvolutionImg}`);
    console.log(`url sliced ${firstEvolutionImg.slice(42).slice(0, -1)}`);
  } catch (error) {
    evolutionInfoContainer.innerHTML += "";
  }
  // check second evolution
  try {
    let secondEvolution =
      evolutionDataAsJSON["chain"]["evolves_to"][0]["species"]["name"];
    console.log(`secondEvolution: ${secondEvolution}`);
    evolutionInfoContainer.innerHTML += `<div>${secondEvolution}<div>`;
  } catch (error) {
    evolutionInfoContainer.innerHTML += "";
  }
  // check third evolution (without try)
  // let thirdEvolution =
  //   evolutionDataAsJSON["chain"]["evolves_to"][0]["evolves_to"][0]["species"][
  //     "name"
  //   ];
  // console.log(`secondEvolution: ${thirdEvolution}`);

  // check third evolution (with try)
  let thirdEvolution;
  try {
    thirdEvolution =
      evolutionDataAsJSON["chain"]["evolves_to"][0]["evolves_to"][0]["species"][
        "name"
      ];
    console.log(`thirdEvolution: ${thirdEvolution}`);
    evolutionInfoContainer.innerHTML += `<div>${thirdEvolution}</div>`;
  } catch (error) {
    evolutionInfoContainer.innerHTML += "";
  }

  // set innerHTML and add first-, second-, third-evolution
  //   document.getElementById("dialog-content-evo").innerHTML = "";
  //   document.getElementById("dialog-content-evo").innerHTML = `
  // <div>${firstEvolution}</div><div>${secondEvolution}<div>${thirdEvolution}</div>`;
}

// function to close dialog by clicking outside dialog
function closeDialog() {
  toggleClass("dialog-shadow", "d-none");
}

// ##### multi helper functions
// add class from classlist
function addClass(elementID, classToRemove) {
  document.getElementById(elementID).classList.add(classToRemove);
}

// toggle class from classlist
function toggleClass(elementID, classToRemove) {
  document.getElementById(elementID).classList.toggle(classToRemove);
}

// remove class from classlist
function removeClass(elementID, classToRemove) {
  document.getElementById(elementID).classList.remove(classToRemove);
}

function returnPokemonCardHTML(i) {
  return `<div id="pokemon-card${i}" class="pokemon-card" onclick="renderPokemonDialog(${i})">
        <div class="pokemon-card-left">
          <h2 id="pokemon-name">${loadedPokemonArray[i]["species"]["name"]}</h2>
          <div class="pokemon-skills">
            <span class="pokemon-skill-span">fire</span>
            <span class="pokemon-skill-span">fire</span>
          </div>
        </div>
        <div class="pokemon-card-right">
          <div class="pokemon-id">#${loadedPokemonArray[i]["id"]}</div>
          <div class="pokemon-img-container">
            <img
              class="pokemon-background-img"
              src="./img/pokeball.png"
              alt=""
            />
            <img
              id="pokemon-img"
              class="pokemon-img"
              src="${loadedPokemonArray[i]["sprites"]["other"]["official-artwork"]["front_default"]}"
              alt=""
            />
          </div>
        </div>
      </div>
  `;
}

// function to return header HTML of dialog for single pokemon
function returnDialogNaviHTML(idOfRenderedPokemon) {
  return `<img onclick="renderPokemonDialog(${
    idOfRenderedPokemon - 1
  })" id="previous-icon" src="./img/left-long-solid.svg" alt="" />
  <img onclick="closeDialog()" id="close-icon" src="./img/circle-xmark-solid.svg" alt="" />
  <img onclick="renderPokemonDialog(${
    idOfRenderedPokemon + 1
  })" id="next-icon" src="./img/left-long-solid.svg" alt="" />`;
}

/// test

async function fetchMoves(indexOfPokemon) {
  console.log("fetchMoves-function");
  let pokemonId = loadedPokemonArray[indexOfPokemon]["id"];
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    const moves = data.moves.map((move) => move.move.name);
    // console.log(moves);
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
