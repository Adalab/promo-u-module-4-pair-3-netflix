const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: '25mb' }));

// Lista de películas (puedes reemplazar esto con tus propios datos)
const movies = [
  {
    id: '1',
    title: 'Gambita de dama',
    genre: 'Drama',
    image: '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/images/gambito-de-dama.jpg'
  },
  {
    id: '2',
    title: 'Friends',
    genre: 'Comedia',
    image: '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/images/friends.jpg'
  }
];
// Ruta para obtener la lista de películas
server.get('/movies', async (req, res) => {
  const conn = await getConnection();
  const orderBy = req.query.orderBy || 'asc'; 
  let queryMovies = `SELECT * FROM Movies ORDER BY title ${orderBy.toUpperCase()}`;
 
  if(req.query.genre){
    const genreFilterParam  = req.query.genre;
    queryMovies = `SELECT * FROM Movies WHERE genre = '${genreFilterParam }'`;
  }


  const [results, fields] = await conn.query(queryMovies);
  conn.end();
  res.json({
    success: true,
    movies:  results
  });
  
});

async function getConnection() {
  //crear y configurar la conexión.
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3993yasmin',
    database: 'Netflix',
  });
  connection.connect();
return connection;
}
// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
//endpoint



/*

//ENDPOINT PARA CREAR ALUMNAS
app.post('/api/alumnas', async (req, res)=>{
});

//SERVIDOR DE ESTATICOS
const pathServerStatic = './public_html';
app.use(express.static(pathServerStatic)); 

*/
