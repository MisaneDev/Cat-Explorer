import axios from 'axios';

// Usando The Cat API para busca externa (Projeto 1)
const externalApi = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
});

export default externalApi;