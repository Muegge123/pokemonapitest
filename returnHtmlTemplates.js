// ################### returnHtmlTemplates.js == functions that simply return html-templates

function returnPokemonCardHTML(arrayOfPokemonToLoad, i, color) {
  return `<div id="pokemon-card${i}" class="pokemon-card" style="background-color: ${
    colors[`${color}`]
  };" onclick="renderPokemonDialog(${arrayOfPokemonToLoad[i]["id"] - 1})">
        <div class="pokemon-card-left">
          <h2 id="pokemon-name">${
            arrayOfPokemonToLoad[i]["species"]["name"]
          }</h2>
          <div class="pokemon-skills">
            <span class="pokemon-skill-span">${
              arrayOfPokemonToLoad[i]["types"]["0"]["type"]["name"]
            }</span>
            <span class="pokemon-skill-span">height: ${
              arrayOfPokemonToLoad[i]["height"]
            }</span>
          </div>
        </div>
        <div class="pokemon-card-right">
          <div class="pokemon-id">#${arrayOfPokemonToLoad[i]["id"]}</div>
          <div class="pokemon-img-container">
            <img
              class="pokemon-background-img"
              src="./img/pokeball.png"
              alt=""
            />
            <img
              id="pokemon-img"
              class="pokemon-img"
              src="${
                arrayOfPokemonToLoad[i]["sprites"]["other"]["official-artwork"][
                  "front_default"
                ]
              }"
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

// render evolution of Pokemon species
async function renderEvolution(indexOfPokemon) {
  toggleNavItems("evolution-nav", "dialog-content-inner-nav-active");
  let evolutionInfoContainer = document.getElementById("dialog-tab-container");
  evolutionInfoContainer.innerHTML = "";
  evolutionInfoContainer.innerHTML += `<h2>Evolution:</h2><div id="evolution-img-container"></div>`;
  let evolutionImgContainer = document.getElementById(
    "evolution-img-container"
  );
  // set url for species + id of pokemon ad fetch species data
  let evolutionDataAsJSON = await getEvolutionUrl(indexOfPokemon);
  // check first evolution
  evolutionImgContainer.innerHTML += getFirstEvolutionImg(evolutionDataAsJSON);
  // check second evolution
  evolutionImgContainer.innerHTML += getSecondEvolutionImg(evolutionDataAsJSON);
  // check third evolution
  evolutionImgContainer.innerHTML += getThirdEvolutionImg(evolutionDataAsJSON);
}

// helper --> set url for species + id of pokemon ad fetch species data
async function getEvolutionUrl(indexOfPokemon) {
  let urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${loadedPokemonArray[indexOfPokemon]["id"]}/`;
  let speciesData = await fetch(urlSpecies);
  let speciesDataAsJSON = await speciesData.json();
  // species data contains url for evolution_chain --> fetch evolution data
  let urlEvolutionChain = speciesDataAsJSON["evolution_chain"]["url"];
  let evolutionData = await fetch(urlEvolutionChain);
  let evolutionDataAsJSON = await evolutionData.json();
  return evolutionDataAsJSON;
}

// helper function to renderEvolution() --> renders first evolution img
function getFirstEvolutionImg(evolutionDataAsJSON) {
  try {
    let firstEvolutionImg = evolutionDataAsJSON["chain"]["species"]["url"];
    let idOfPokemonFirstEvo = firstEvolutionImg.slice(42).slice(0, -1);
    return `<div class="evoImgAndCaption"><h3>1. Stufe:</h3><img class="evolution-img" src="${
      loadedPokemonArray[idOfPokemonFirstEvo - 1]["sprites"]["other"][
        "official-artwork"
      ]["front_default"]
    }"></div>`;
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
    return `<div class="evoImgAndCaption"><h3>2. Stufe:</h3><img class="evolution-img" src="${
      loadedPokemonArray[idOfPokemonSecondEvo - 1]["sprites"]["other"][
        "official-artwork"
      ]["front_default"]
    }"></div>`;
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
    return `<div class="evoImgAndCaption"><h3>3. Stufe:</h3><img class="evolution-img" src="${
      loadedPokemonArray[idOfPokemonThirdEvo - 1]["sprites"]["other"][
        "official-artwork"
      ]["front_default"]
    }"></div>`;
  } catch (error) {
    return "";
  }
}

// render abilities in dialog
function renderAbilities(indexOfPokemon) {
  toggleNavItems("abilities-nav", "dialog-content-inner-nav-active");
  let abilities = loadedPokemonArray[indexOfPokemon]["abilities"];
  document.getElementById("dialog-tab-container").innerHTML = "";
  document.getElementById(
    "dialog-tab-container"
  ).innerHTML += `<h2>Abilities:</h2>`;
  for (let i = 0; i < abilities.length; i++) {
    document.getElementById(
      "dialog-tab-container"
    ).innerHTML += `<div class="single-move">${abilities[i]["ability"]["name"]}</div>`;
  }
}

// ##### options to render from pokemon api ==> not used on current pokemon card layout #####

/// render moves ==> optional / not used on current pokemon card
async function fetchMoves(indexOfPokemon) {
  let pokemonId = loadedPokemonArray[indexOfPokemon]["id"];
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const moves = data.moves.map((move) => move.move.name);
    moves.forEach((move) => {
      document.getElementById(
        "dialog-content-moves"
      ).innerHTML += `<div class="single-move">${move}</div>`;
    });
  } catch (error) {
    console.error("Error fetching moves:", error);
  }
}

/// dialog : render characteristics ==> optional / not used on current pokemon card
async function renderCharacteristics(indexOfPokemon) {
  let urlCharacteristics = "https://pokeapi.co/api/v2/characteristic/";
  let idOfPokemon = indexOfPokemon + 1;
  let responseCharacteristics = await fetch(urlCharacteristics + idOfPokemon);
  let characteristicsData = await responseCharacteristics.json();
  document.getElementById("dialog-content-characteristics").innerHTML =
    characteristicsData.descriptions[4].description;
}
