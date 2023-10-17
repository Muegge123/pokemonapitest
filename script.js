// let urlDitto = "https://pokeapi.co/api/v2/pokemon/ditto";
let loadedPokemonArray = [];
let currentPokemon;
let myChart;

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

// variable for loading-info dialog (true = show dialog)
let isLoading;

function init() {
  loadPokemon(1);
  rotateLogo();
}

async function loadPokemon(nextNumberToLoad) {
  // start loading-info while loading
  toggleClass("loading-info-shadow", "d-none");
  isLoading = true;
  const url = `https://pokeapi.co/api/v2/pokemon/`;

  for (let i = nextNumberToLoad; i < nextNumberToLoad + 21; i++) {
    // pokemon data
    let resCurrentPokemon = await fetch(`${url}${i}`);
    let resCurrentPokemonAsJSON = await resCurrentPokemon.json();
    await loadedPokemonArray.push(resCurrentPokemonAsJSON);
  }
  await renderPokemonCard(loadedPokemonArray);
  numberPokemonLoaded = numberPokemonLoaded + 21;
  // isLoading = false;
  toggleClass("loading-info-shadow", "d-none");
}

// button "load more" function
function loadMorePokemon() {
  loadPokemon(numberPokemonLoaded);
  // clear search input
  document.getElementById("search-pokemon").value = "";
}

// animate pokemon logo while loading more pokemon
function rotateLogo() {
  if (isLoading) {
    let degree = 0;
    const rotateElement = document.getElementById("loading-info-img");

    function rotate() {
      degree += 15;
      rotateElement.style.transform = `rotate(${degree}deg)`;

      if (degree < 360) {
        setTimeout(rotate, 300);
      } else {
        degree = 0;
        setTimeout(rotate, 300);
      }
    }

    rotate();
  }
}

// render pokemon cards (color of cards = compare type.name of pokemon with colors-array from github-list)
function renderPokemonCard(arrayOfPokemonToLoad) {
  document.getElementById("pokedex").innerHTML = "";
  for (let i = 0; i < arrayOfPokemonToLoad.length; i++) {
    let color = arrayOfPokemonToLoad[i]["types"][0]["type"]["name"];
    document.getElementById("pokedex").innerHTML += returnPokemonCardHTML(
      arrayOfPokemonToLoad,
      i,
      color
    );
  }
}

// function to search for pokemon via input
function search(input) {
  const filtered = loadedPokemonArray.filter((element) => {
    for (const value of Object.values(element)) {
      if (value.toString().toLowerCase().includes(input.value.toLowerCase()))
        return true;
    }
  });

  renderPokemonCard(filtered);
}

// function to render dialog for pokemon
function renderPokemonDialog(indexOfPokemon) {
  if (indexOfPokemon == loadedPokemonArray.length) {
    loadMorePokemon();
  } else {
    setBackgroundColorDialog(indexOfPokemon);
    removeClass("dialog-shadow", "d-none");
    renderBasicInfoDialog(indexOfPokemon);
    renderTabNav(indexOfPokemon);
    renderStats(indexOfPokemon);
  }
}

// sets the right background-color for dialog/pokemon
function setBackgroundColorDialog(indexOfPokemon) {
  let color = loadedPokemonArray[indexOfPokemon]["types"][0]["type"]["name"];
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

// render tab-box in pokemon dialog
function renderTabNav(indexOfPokemon) {
  let tabNav = document.getElementById("dialog-content-inner-nav");
  tabNav.innerHTML = "";
  tabNav.innerHTML += `<div onclick="renderStats(${indexOfPokemon})" id="stats-nav" class="nav-item">stats</div>`;
  tabNav.innerHTML += `<div onclick="renderEvolution(${indexOfPokemon})" id="evolution-nav" class="nav-item">evolution</div>`;
  tabNav.innerHTML += `<div onclick="renderAbilities(${indexOfPokemon})" id="abilities-nav" class="nav-item">abilities</div>`;
}

// tab-box in pokemon dialog --> set nav-item activ / deactivate other nav-items
function toggleNavItems(navItemToActivate, classToToggle) {
  removeClass("stats-nav", "dialog-content-inner-nav-active");
  removeClass("evolution-nav", "dialog-content-inner-nav-active");
  removeClass("abilities-nav", "dialog-content-inner-nav-active");

  toggleClass(navItemToActivate, classToToggle);
}

// dialog : render stats
function renderStats(indexOfPokemon) {
  toggleNavItems("stats-nav", "dialog-content-inner-nav-active");
  let statsLabels = [];
  let statsData = [];
  document.getElementById("dialog-tab-container").innerHTML = "";
  document.getElementById("dialog-tab-container").innerHTML = `<div>
              <h2>Stats:</h2>
              <canvas id="myChart"></canvas>
            </div>`;
  for (let i = 0; i < loadedPokemonArray[indexOfPokemon]["stats"].length; i++) {
    statsLabels.push(
      loadedPokemonArray[indexOfPokemon]["stats"][i]["stat"]["name"]
    );
    statsData.push(loadedPokemonArray[indexOfPokemon]["stats"][i]["base_stat"]);
  }
  checkChartAndRender(statsLabels, statsData);
}

// check if chart exits and destroy existing chart / generate new chart
function checkChartAndRender(statsLabels, statsData) {
  if (myChart) {
    myChart.destroy();
    renderChart(statsLabels, statsData);
  } else {
    renderChart(statsLabels, statsData);
  }
}

// generate chart
// >>> chart options:
let chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// >>> chart function
function renderChart(statsLabels, statsData) {
  const ctx = document.getElementById("myChart");
  myChart = new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: statsLabels,
      datasets: [
        {
          label: "stats",
          data: statsData,
          borderWidth: 1,
        },
      ],
    },
    options: chartOptions,
  });
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
