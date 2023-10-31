SELECT * FROM netflix.actors;

SELECT * FROM netflix.actors ORDER BY birthday ASC ;

SELECT *
FROM netflix.actors
WHERE birthday >= 1950 OR birthday <= 1960;

SELECT name , lastname FROM netflix.actors WHERE country="Estados Unidos";


