import apiKey from "../scripts/api-key.js";
document.addEventListener('DOMContentLoaded', function() {
    const teamsList = document.getElementById('teamsList');
    teamsList.innerHTML = '<p>Carregando times...</p>';

    // Fazendo a requisição para obter os times
    fetch(`https://api.sportsdata.io/v3/nba/scores/json/teams?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        teamsList.innerHTML = '';

        if (data.length === 0) {
            teamsList.innerHTML = '<p>Nenhum time encontrado.</p>';
        } else {
            data.forEach(team => {
                const teamItem = document.createElement('div');
                teamItem.className = 'team-item';
                teamItem.innerHTML = `
                    <img class="team-logo" src="${team.WikipediaLogoUrl}" alt="${team.FullName}">
                    <p><strong>Conferência:</strong> ${team.Conference}</p>
                    <p><strong>Divisão:</strong> ${team.Division}</p>
                    <p><strong>Cidade:</strong> ${team.City}</p>
                    <p><strong>Nome:</strong> ${team.Name}</p>
                    <p><strong>Nome Completo:</strong> ${team.City} ${team.Name}</p>
                    <p><strong>Abreviação:</strong> ${team.Key}</p>
                `;

                // Chama a API de jogadores
                fetch(`https://api.sportsdata.io/v3/nba/scores/json/PlayersBasic/${team.Key}?key=${apiKey}`)
                .then(response => response.json())
                .then(players => {
                    const playersList = document.createElement('div');
                    playersList.className = 'players-list';

                    // Define a cor primária do time
                    const primaryColor = `#${team.PrimaryColor}` || '#333'; // Padrão caso não exista

                    players.forEach(player => {
                        const playerItem = document.createElement('a');
                        playerItem.className = 'player-item';
                        playerItem.innerHTML = `
                            <h5>${player.FirstName} ${player.LastName}</h5>
                        `;
                        const normalizedPrimaryColor = primaryColor.toUpperCase().replace('#', '');
                        // Adiciona os eventos de hover para mudar a cor ao passar o mouse
                        playerItem.addEventListener('mouseover', function() {
                            playerItem.style.cursor = 'pointer';
                            if (normalizedPrimaryColor === 'FFF21F') {
                                playerItem.style.backgroundColor = `#${normalizedPrimaryColor}`;
                                playerItem.style.color = '#000000'; // Texto preto
                                playerItem.style.transition = '0.5s';
                                
                            } else {
                                playerItem.style.backgroundColor = `#${normalizedPrimaryColor}`;
                                
                                playerItem.style.transition = '0.5s';
                            }
                            
                        });
                      // Adiciona evento de clique ao nome do jogador
                      playerItem.addEventListener('click', function() {
                        // Redireciona para a página Jogadores.html passando as informações do jogador pela URL
                        const playerDetailsUrl = `Jogadores.html?PlayerID=${player.PlayerID}&FirstName=${player.FirstName}&LastName=${player.LastName}&Jersey=${player.Jersey}&Position=${player.Position}`;
                        window.location.href = playerDetailsUrl;
                    });
                    


                        playerItem.addEventListener('mouseout', function() {
                            playerItem.style.backgroundColor = ''; 
                            playerItem.style.transition = `0.5s`
                            playerItem.style.color = '#ffffff'; // Texto padrão ou branco para cores escuras
                        });

                        playersList.appendChild(playerItem);

                    });

                    teamItem.appendChild(playersList);
                    teamsList.appendChild(teamItem);
                })
                .catch(error => {
                    console.error('Erro ao carregar jogadores:', error);
                });
            });
        }
    })
});