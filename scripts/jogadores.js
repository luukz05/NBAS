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
            // Exibir todas as informações e estatísticas do jogador na página
            displayPlayerStats(data.body[0]); // Acessando o primeiro objeto do array no corpo da resposta
        })
        .catch(error => {
            console.error('Erro:', error);
            playerInfoDiv.innerHTML += `<p>Erro ao obter estatísticas do jogador.</p>`;
        });
    }

    // Função para exibir todas as estatísticas e informações do jogador
    function displayPlayerStats(data) {
        // Verifique se há dados para o jogador e exiba todas as estatísticas
        if (data) {
            const stats = data.stats; // Acessando as estatísticas do jogador
            const injury = data.injury || {}; // Tratamento para informações de lesão

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
                <p>Link ESPN: <a href="${data.espnLink}" target="_blank">${data.espnLink}</a></p>
                <p>Link NBA: <a href="${data.nbaComLink}" target="_blank">${data.nbaComLink}</a></p>
                <p>Posição: ${data.pos}</p>
                <p>ID do Jogador na ESPN: ${data.espnID}</p>
                <p>ID do Jogador na NBA.com: ${data.nbaComID}</p>
                <p>Lesão: ${injury.description || 'Nenhuma lesão recente'}</p>
                <p>Data da Lesão: ${injury.injDate || 'N/A'}</p>
                <p>Previsão de Retorno: ${injury.injReturnDate || 'N/A'}</p>
                <h2>Estatísticas</h2>
                <p>Jogos Jogados: ${stats.gamesPlayed}</p>
                <p>Minutos por jogo: ${stats.mins}</p>
                <p>Pontos: ${stats.pts}</p>
                <p>Assistências: ${stats.ast}</p>
                <p>Rebotes: ${stats.reb}</p>
                <p>Rebotes Ofensivos: ${stats.OffReb}</p>
                <p>Rebotes Defensivos: ${stats.DefReb}</p>
                <p>Bolas Roubadas: ${stats.stl}</p>
                <p>Tocos: ${stats.blk}</p>
                <p>Arremessos de Quadra Tentados: ${stats.fga}</p>
                <p>Arremessos de Quadra Convertidos: ${stats.fgm}</p>
                <p>Porcentagem de Arremessos de Quadra: ${stats.fgp}%</p>
                <p>Arremessos de 3 Pontos Tentados: ${stats.tptfga}</p>
                <p>Arremessos de 3 Pontos Convertidos: ${stats.tptfgm}</p>
                <p>Porcentagem de 3 Pontos: ${stats.tptfgp}%</p>
                <p>Arremessos Livres Tentados: ${stats.fta}</p>
                <p>Arremessos Livres Convertidos: ${stats.ftm}</p>
                <p>Porcentagem de Lance Livre: ${stats.ftp}%</p>
                <p>Turnovers: ${stats.TOV}</p>
                <p>Eficiência de Arremessos: ${stats.effectiveShootingPercentage}%</p>
                <p>True Shooting: ${stats.trueShootingPercentage}%</p>
            `;
        } else {
            playerInfoDiv.innerHTML += `<p>Não foram encontradas estatísticas para o jogador.</p>`;
        }
    }

    // Chama a função para buscar as estatísticas do jogador usando o primeiro e último nome
    fetchPlayerStats(playerDetails.FirstName, playerDetails.LastName);
});
