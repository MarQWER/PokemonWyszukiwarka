const guzik = document.querySelector("#search");
const karta = document.querySelector("#pokeContainer")

const POKEMON_TYPE_ICONS = {
  normal: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/normal.svg",
  fire: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/fire.svg",
  water: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/water.svg",
  grass: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/grass.svg",
  electric: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/electric.svg",
  ice: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/ice.svg",
  fighting: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/fighting.svg",
  poison: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/poison.svg",
  ground: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/ground.svg",
  flying: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/flying.svg",
  psychic: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/psychic.svg",
  bug: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/bug.svg",
  rock: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/rock.svg",
  ghost: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/ghost.svg",
  dark: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/dark.svg",
  dragon: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/dragon.svg",
  steel: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/steel.svg",
  fairy: "https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/fairy.svg"
};

const colors = {
  "bug": "#A6B91A",
  "dark": "#705746",
  "dragon": "#6F35FC",
  "electric": "#F7D02C",
  "fairy": "#D685AD",
  "fighting": "#C22E28",
  "fire": "#EE8130",
  "flying": "#A98FF3",
  "ghost": "#735797",
  "grass": "#7AC74C",
  "ground": "#E2BF65",
  "ice": "#96D9D6",
  "normal": "#A8A77A",
  "poison": "#A33EA1",
  "psychic": "#F95587",
  "rock": "#B6A136",
  "steel": "#B7B7CE",
  "water": "#6390F0",
}

const GENDER_RATIO = {
  "-1": "none",
  "0": "100",
  "1": "87.5",
  "2": "75",
  "4": "50",
  "6": "25",
  "7": "12.5",
  "8": "0"
}

async function FetchData() {
  try {
    const pokeName = document.querySelector("#pokeSearch").value.toLowerCase();
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokeName}`
    );

    if (!response.ok) {
      throw new Error("Wystąpił Błąd");
    }

    const data = await response.json();

    //Fetch Species
    const pokeId = data.id;
    const responseSpecies = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokeId}/`
    );

    if (!responseSpecies.ok) {
      throw new Error("Wystąpił błąd w fetchowaniu informacji o gatunku")
    }

    const speciesData = await responseSpecies.json();
    const sprite = data.sprites.other.home.front_default;
    const imgElement = document.querySelector("#pokemonSprite");
    const pokecolor = colors[data.types["0"].type.name];

    const POKESTATS = {
      0: "HP",
      1: "Attack",
      2: "Defense",
      3: "Sp. Attack",
      4: "Sp. Defense",
      5: "Speed",
    }

    const pokename = data.species.name[0].toUpperCase() + data.species.name.slice(1);

    karta.style.borderColor = pokecolor;
    //nazwa poksa i kolor nazwy
    document.querySelector("#pokename").innerHTML = pokename;
    document.querySelector("#pokename").style.textShadow = `
    1px 1px 1px ${pokecolor},
    -1px 1px 1px ${pokecolor},
    -1px -1px 1px ${pokecolor},
    1px -1px 1px ${pokecolor} `;

    //typy

    //wyczysc poprzednie
    document.querySelector("#type1").src = "";
    document.querySelector("#type2").src = "";
    document.querySelector("#type2").style.display = "none";
    //nadaj nowe
    const firstType = POKEMON_TYPE_ICONS[data.types["0"].type.name];
    const secondType = POKEMON_TYPE_ICONS[data.types?.["1"]?.type?.name];
    document.querySelector("#type1").src = firstType;
    document.querySelector("#type1").style.display = "block";
    if (secondType) {
      document.querySelector("#type2").src = secondType;
      document.querySelector("#type2").style.display = "block";
    }


    //statystyki giga skomplikowane sam tego nie cumam
    showStats(data)
    function showStats(data) {
      const container = document.getElementById("stats-container");
      container.innerHTML = "";

      data.stats.forEach(stat => {
        const name = stat.stat.name;
        const value = stat.base_stat;

        let colorClass = "mid";
        if (value < 60) colorClass = "low";
        if (value > 100) colorClass = "high";

        const width = Math.min((value / 200) * 100, 100);

        const row = document.createElement("div");
        row.className = "stats-row";

        row.innerHTML = `
      <div class="stat-name">${name.replace("-", " ")}</div>
      <div class="stat-bar">
        <div class="stat-bar-inner ${colorClass}" style="width: ${width}%"></div>
      </div>
      <div class="stat-value">${value}</div>
    `;

        container.appendChild(row);
      });

      const total = data.stats.reduce((s, a) => s + a.base_stat, 0);

      const totalRow = document.createElement("div");
      totalRow.className = "stats-row";
      totalRow.innerHTML = `
    <div class="stat-name">total</div>
    <div></div>
    <div class="stat-value" style="font-weight:700">${total}</div>
    <div></div>
  `;
      container.appendChild(totalRow);
    }

    //ustawienie obrazka
    imgElement.src = sprite;
    imgElement.style.display = "block";

    document.querySelector("#info").style.display = "flex";
    document.querySelector("#nogender").style.display = "none";

    //płeć procent
    const baseBarMale = `
      float:left; background: #3355FF; border-top-left-radius: 20px; border-bottom-left-radius: 20px; height: 10px; width: 48.5%; border: 0.5px solid black; overflow: hidden; border-right-width: 0; display: block
    `
    const baseBarFemale = `
      float:left; background: #ff77dd; border-top-right-radius: 20px; border-bottom-right-radius: 20px; height: 10px; width: 48.5%; border: 0.5px solid black; overflow: hidden; border-left-width: 0; display: block
    `
    const pokegender = speciesData.gender_rate;
    const male = document.querySelector("#male");
    const female = document.querySelector("#female");
    male.style = baseBarMale;
    female.style = baseBarFemale;
    if (pokegender != -1) {
      if (pokegender == 0) {
        male.style.width = "100%";
        male.style.borderRadius = "20px";
        female.style.display = "none";
      }
      else if (pokegender == 8) {
        female.style.width = "100%";
        female.style.borderRadius = "20px";
        male.style.display = "none";
      }
      else {
        male.style.width = GENDER_RATIO[pokegender] - 2.5 + "%";
        female.style.width = 100 - parseFloat(male.style.width) - 2.5 + "%";
      }
    }
    else {
      male.style.display = "none";
      female.style.display = "none";
      document.querySelector("#nogender").style.display = "block";
    }


    //Egg Group
    const eggGroup1 = speciesData.egg_groups?.[0]?.name[0].toUpperCase() + speciesData.egg_groups?.[0]?.name.slice(1);
    const eggGroup2 = speciesData.egg_groups?.[1]?.name[0].toUpperCase() + speciesData.egg_groups?.[1]?.name.slice(1);
    const eggDisplay1 = document.querySelector("#egg_group1");
    const eggDisplay2 = document.querySelector("#egg_group2");
    eggDisplay2.innerHTML = "";
    if (eggGroup1) {
      eggDisplay1.innerHTML = eggGroup1;
    }
    if (eggGroup2) {
      eggDisplay2.innerHTML = eggGroup2;
    }


  } catch (error) {
    console.error(error);
  }
}

guzik.addEventListener("click", FetchData);
