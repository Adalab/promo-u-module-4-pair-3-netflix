// login
const getMoviesFromApi = (selectedGenre) => {
  console.log('Se están pidiendo las películas de la app con género:', selectedGenre);

  // Agrega el parámetro "genre" a la URL utilizando query params
  const apiUrl = `//localhost:4000/movies/?genre=${selectedGenre}`;
  
  return fetch(apiUrl, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      return data;
    });
};
const objToExport = {
  getMoviesFromApi: getMoviesFromApi
};
export default objToExport;

