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
  console.log(loadedPokemonArray[1]["id"]);
  console.log(loadedPokemonArray[1]["stats"][2]);
  console.log(loadedPokemonArray[4]["stats"].length);

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

// ##### multi helper functions
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
          
  <img onclick="renderPokemonDialog(${
    idOfRenderedPokemon + 1
  })" id="next-icon" src="./img/left-long-solid.svg" alt="" />`;
}
