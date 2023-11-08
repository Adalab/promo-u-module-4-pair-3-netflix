const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const server = express();
server.use(cors());
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.use(express.json({ limit: '25mb' }));

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3993yasmin',
    database: 'Netflix',
  });
  connection.connect ();
  return connection;
}

const generateToken = (payload) => {
  const token = jwt.sign(payload, "secreto", { expiresIn: "12h" });
  return token;
};
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

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

//Proceso de login
//usuario y la contraseña
server.post('/sign-up', async (req, res) => {
  const { email, password } = req.body;

  // Verifica si el email y la contraseña fueron proporcionados
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar un email y una contraseña',
    });
  }

  try {
    const conn = await getConnection();

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea la nueva entrada en la base de datos
    const [result] = await conn.query('INSERT INTO users (email, hashed_password) VALUES (?, ?)', [email, hashedPassword]);
    conn.end();

    const newUserId = result.insertId;

    // Genera el token JWT
    const token = generateToken({ userId: newUserId });

    res.json({
      success: true,
      userId: newUserId,
      token,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

//servidor de estáticos
//servidor de estáticos
const pathServerStatic = "./public_html";
server.use(express.static(pathServerStatic));


});

