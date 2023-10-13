// ################### returnHtmlTemplates.js == functions that simply return html-templates

function returnPokemonCardHTML(i, color) {
  return `<div id="pokemon-card${i}" class="pokemon-card" style="background-color: ${
    colors[`${color}`]
  };" onclick="renderPokemonDialog(${i})">
        <div class="pokemon-card-left">
          <h2 id="pokemon-name">${loadedPokemonArray[i]["species"]["name"]}</h2>
          <div class="pokemon-skills">
            <span class="pokemon-skill-span">${
              loadedPokemonArray[i]["types"]["0"]["type"]["name"]
            }</span>
            <span class="pokemon-skill-span">height: ${
              loadedPokemonArray[i]["height"]
            }</span>
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
              src="${
                loadedPokemonArray[i]["sprites"]["other"]["official-artwork"][
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
