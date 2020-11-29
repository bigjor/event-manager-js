import api from '../services/api/API.js'

const TOKEN = 'a6e7e4d29410ce97c6619ecb524da682'
const BASE = 'https://api.themoviedb.org/3'
const PATH = `/movie/popular?api_key=${TOKEN}&language=es-ES&page=1`

export function apiTestExec() {
    let testAPI = api.create({ baseURL: BASE })
    testAPI.get(PATH)
        .then(result => window.log('API TEST: PASSED', 'green'))
        .catch(result => window.log('API TEST: FAILED', 'red'))
}