// Importar dependencias
const express = require('express');
const axios = require('axios');

// Cria uma instancia no app Express
const app = express();
const port = 4000;

// Defini as configuracoes da API do GitHub
const apiUrl = 'https://api.github.com/orgs/takenet/repos';
const language = 'C#';
const accessToken = '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';

// Rota para obter os repositorios em C# mais antigos da take
app.get('/repositories', async (req, res) => {
  try {
    // Realizar a requisição para a API do GitHub
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Filtra os repositórios na liguagem que eu desejo e tambem com a data de criacao
    const repositories = response.data;
    const csharpRepositories = repositories
      .filter(repo => repo.language === language)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(0, 5);

    // Adiciona o link de cada repositório
    const repositoriesWithLinks = csharpRepositories.map(repo => ({
      ...repo,
      link: repo.html_url
    }));

    // Retornar os repositorios filtrados e com links como resposta JSON
    res.json(repositoriesWithLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar os repositórios no GitHub' });
  }
});

// Inicio o servidor pra testar em casa mesmo
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
