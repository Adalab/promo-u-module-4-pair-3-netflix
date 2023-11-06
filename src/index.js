const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');




const server = express();
server.use(cors());
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.use(express.json({ limit: '25mb' }));

const movies = [
  {
    id: '1',
    title: 'Gambito de dama',
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

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'naiara-2019',
    database: 'Netflix',
  });
  return connection;
}

server.get('/movies', async (req, res) => {
  const conn = await getConnection();
  const orderBy = req.query.orderBy || 'asc';
  let queryMovies = `SELECT * FROM Movies ORDER BY title ${orderBy.toUpperCase()}`;

  if (req.query.genre) {
    const genreFilterParam = req.query.genre;
    queryMovies = `SELECT * FROM Movies WHERE genre = '${genreFilterParam}'`;
  }

  try {
    const [results, fields] = await conn.query(queryMovies);
    conn.end();
    res.json({
      success: true,
      movies: results,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

server.get('/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const conn = await getConnection();
    const [results, fields] = await conn.query('SELECT * FROM Movies WHERE idMovies = ?', [movieId]);
    conn.end();

    if (results.length > 0) {
      const foundMovie = results[0];
      console.log('Found Movie:', foundMovie);

      res.render('movie', foundMovie);
    } else {
      res.json({
        success: false,
        message: 'Movie not found',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});


