const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware para leer datos JSON
app.use(express.json());
// Lee el archivo JSON
function leerData() {
  const data = fs.readFileSync('countries.json', 'utf-8');
  return JSON.parse(data);
}

// Escribe en el archivo JSON
function escribirData(data) {
  fs.writeFileSync('countries.json', JSON.stringify(data, null, 2));
}

// Ruta para obtener todos los países
app.get('/paises', (req, res) => {
  const paises = leerData();
  const idioma = req.query.idioma;
  if (idioma) {
    const filtrados = paises.filter(p => p.idioma.includes(idioma));
    return res.json(filtrados);
  }
  res.json(paises);
});

// Ruta para obtener un país específico por nombre
app.get('/paises/:nombre', (req, res) => {
  const paises = leerData();
  const pais = paises.find(p => p.pais.toLowerCase() === req.params.nombre.toLowerCase());
  if (pais) {
    res.json(pais);
  } else {
    res.status(404).json({ message: 'País no encontrado' });
  }
});

// Ruta para añadir un nuevo país
app.post('/paises', (req, res) => {
  const paises = leerData();
  const nuevoPais = req.body;
  paises.push(nuevoPais);
  escribirData(paises);
  res.status(201).json(nuevoPais);
});

// Ruta para eliminar un país por nombre
app.delete('/paises/:nombre', (req, res) => {
  let paises = leerData();
  const nombre = req.params.nombre.toLowerCase();
  const indice = paises.findIndex(p => p.pais.toLowerCase() === nombre);

  if (indice !== -1) {
    const eliminado = paises.splice(indice, 1);
    escribirData(paises);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: 'País no encontrado' });
  }
});

// Inicializa el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
