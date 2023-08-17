// ################### returnHtmlTemplates.js == functions that simply return html-templates

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
