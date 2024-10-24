import apiKey from "../scripts/rapid-api-key.js";
const scoresDiv = document.getElementById("scores");
const loadingDiv = document.getElementById("loading");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

async function fetchNBAScores() {
  const today = new Date();
  const gameDate = formatDate(today);
  const url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAScoresOnly?gameDate=${gameDate}&topPerformers=true&lineups=true`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com",
      "x-rapidapi-key": `${apiKey}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    loadingDiv.style.display = "none";
    displayScores(data.body);
    fetchNBASchedule();
  } catch (error) {
    scoresDiv.innerHTML =
      "<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>";
    console.error("Erro:", error);
  }
}

async function fetchNBASchedule() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const gameDate = formatDate(tomorrow);
  const url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAGamesForDate?gameDate=${gameDate}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com",
      "x-rapidapi-key": "29bc1b8e77mshbb549f1b4fa1ff7p1b822fjsn6c7e8b83dbca",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
  } catch (error) {
    console.error("Erro ao carregar a programação:", error);
  }
}

function displayScores(games) {
  if (!games || Object.keys(games).length === 0) {
    scoresDiv.innerHTML = "<p>Nenhum jogo encontrado para esta data.</p>";
    return;
  }

  fetch(`../scripts/times.json`)
    .then((response) => response.json())
    .then((data) => {
      const teamsLogos = {};
      const teamColors = {}; // Objeto para armazenar as cores primárias dos times
      data.forEach((team) => {
        teamsLogos[team.Key] = team.WikipediaLogoUrl;
        teamColors[team.Key] = `#${team.PrimaryColor}`; // Armazena a cor primária
      });

      for (const gameID in games) {
        const game = games[gameID];
        const gameDiv = document.createElement("div");
        gameDiv.classList.add("game");

        const homeTeam = game.home || "Desconhecido";
        const awayTeam = game.away || "Desconhecido";
        const homePts = game.homePts || "0";
        const awayPts = game.awayPts || "0";
        const status =
          game.gameStatus === "Not Started Yet"
            ? "Aguardando Início"
            : game.gameStatus; // Atualizado para usar o status real
        let statusColor; // Declare a variável para a cor do status

        if (status === "Aguardando Início") {
          statusColor = "#FFFF"; // Cor branca para "Aguardando Início"
        } else if (status === "Live") {
          statusColor = "red"; // Cor vermelha para "Live"
        }

        gameDiv.innerHTML = `
    <div class="score">
        <div class="team-container">
            <div class="detail">
                <img src="${teamsLogos[awayTeam]}" alt="${awayTeam}" class="team-logo">
                <span class="team-name">${awayTeam}</span>
            </div>
            <span class="points">${awayPts}</span>
            <span style="font-size: 1.8vw;">VS</span>
            <span class="points">${homePts}</span>
            <div class="detail">
                <img src="${teamsLogos[homeTeam]}" alt="${homeTeam}" class="team-logo">
                <span class="team-name">${homeTeam}</span>
            </div>
        </div>
        <div class="status-container">
            <span style="color: ${statusColor};">${status}</span> <!-- Corrigido para fechar a aspa -->
        </div>
    </div>
`;

        scoresDiv.appendChild(gameDiv);

        const primaryColorHome = teamColors[homeTeam]
          ?.toUpperCase()
          .replace("#", "");
        const primaryColorAway = teamColors[awayTeam]
          ?.toUpperCase()
          .replace("#", "");

        gameDiv.addEventListener("mouseover", function () {
          gameDiv.style.cursor = "pointer";
          const primaryColorWithOpacityHome = `${primaryColorHome}99`; // 60% de opacidade
          const primaryColorWithOpacityAway = `${primaryColorAway}99`; // 60% de opacidade
          gameDiv.style.backgroundImage = `linear-gradient(90deg, #${primaryColorWithOpacityAway}, #${primaryColorWithOpacityHome})`;
          gameDiv.style.color = "#fff"; // Texto branco
          gameDiv.style.transition =
            "background-image 1s ease-in, color 1s ease-in"; // Transição suave
        });

        gameDiv.addEventListener("mouseleave", function () {
          gameDiv.style.cursor = "pointer";
          gameDiv.style.backgroundImage = ""; // Remove o gradiente
          gameDiv.style.backgroundColor = "#575757d8"; // Cor padrão de fundo
          gameDiv.style.color = "#fff"; // Texto padrão
          gameDiv.style.transition =
            "background-color 1s ease-in, color 1s ease-in"; // Transição suave
        });
      }
    });
}

fetchNBAScores();
