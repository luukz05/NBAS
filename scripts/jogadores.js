document.addEventListener('DOMContentLoaded', function() {
    // Função para obter os parâmetros da URL
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            PlayerID: params.get('PlayerID'),
            FirstName: params.get('FirstName'),
            LastName: params.get('LastName'),
            Jersey: params.get('Jersey'),
            Position: params.get('Position'),
        };
    }

    const playerDetails = getQueryParams();
    
    // Exibe os dados do jogador na página
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = `
        <h1>${playerDetails.FirstName} ${playerDetails.LastName}</h1>
        <p>Posição: ${playerDetails.Position}</p>
        <p>Número: ${playerDetails.Jersey}</p>
        <p>ID do Jogador: ${playerDetails.PlayerID}</p>
    `;

    // Função para obter informações do jogador da API
    function fetchPlayerStats(firstName, lastName) {
        const playerName = `${firstName} ${lastName}`; // Concatenando primeiro e último nome
        fetch(`https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerInfo?playerName=${encodeURIComponent(playerName)}&statsToGet=averages`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com',
                'x-rapidapi-key': '29bc1b8e77mshbb549f1b4fa1ff7p1b822fjsn6c7e8b83dbca' // Não exponha esta chave em produção
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição à API');
            }
            return response.json();
        })
        .then(data => {
            // Exibir estatísticas do jogador na página
            displayPlayerStats(data.body[0]); // Acessando o primeiro objeto do array no corpo da resposta
        })
        .catch(error => {
            console.error('Erro:', error);
            playerInfoDiv.innerHTML += `<p>Erro ao obter estatísticas do jogador.</p>`;
        });
    }

    // Função para exibir as estatísticas do jogador
    function displayPlayerStats(data) {
        // Verifique se há dados para o jogador e exiba as estatísticas
        if (data) {
            const stats = data.stats; // Acessando as estatísticas do jogador

            playerInfoDiv.innerHTML += `
                <h2>Informações do Jogador</h2>
                <img src="${data.nbaComHeadshot}" alt="${data.espnName} Headshot" style="width: 150px; height: auto;">
                <p>Nome: ${data.longName}</p>
                <p>Equipe: ${data.team}</p>
                <p>Data de Nascimento: ${data.bDay}</p>
                <p>Altura: ${data.height}</p>
                <p>Peso: ${data.weight} lbs</p>
                <p>Experiência: ${data.exp} anos</p>
                <p>Último Jogo: ${data.lastGamePlayed}</p>
                <p><a href="${data.espnLink}" target="_blank">Link ESPN</a></p>
                <h2>Estatísticas Médias</h2>
                <p>Pontos: ${stats.pts}</p>
                <p>Assistências: ${stats.ast}</p>
                <p>Rebotes: ${stats.reb}</p>
                <p>Minutos por jogo: ${stats.mins}</p>
                <p>Jogos Jogados: ${stats.gamesPlayed}</p>
                <!-- Adicione mais estatísticas conforme necessário -->
            `;
        } else {
            playerInfoDiv.innerHTML += `<p>Não foram encontradas estatísticas para o jogador.</p>`;
        }
    }

    // Chama a função para buscar as estatísticas do jogador usando o primeiro e último nome
    fetchPlayerStats(playerDetails.FirstName, playerDetails.LastName);
});
