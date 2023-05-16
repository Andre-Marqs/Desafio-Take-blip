const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/repositorios', async (req, res) => {
  try {
    //requisição à API do GitHub
    const response = await axios.get('https://api.github.com/orgs/takenet/repos');

    // Filtra os repositórios em C#
    const csharpRepos = response.data.filter(repo => repo.language === 'C#');

    // Ordena os repositórios pelo mais antigo
    const sortedRepos = csharpRepos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Retorna apenas os 5 repositórios mais antigos
    const oldestRepos = sortedRepos.slice(0, 5);

    // Retorna a resposta em formato JSON
    res.json(oldestRepos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
