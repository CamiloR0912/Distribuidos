require('dotenv').config();
const express = require('express');
const neo4j = require('neo4j-driver');

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

// ======================
// Conexión a Neo4j
// ======================
const driver = neo4j.driver(
  process.env.NEO4J_URI, // 👉 viene del .env (ej: bolt://neo4j:7687)
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// ======================
// Rutas
// ======================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '✅ API funcionando con Neo4j' });
});

// Personas paginadas
// Ejemplo: GET /people?page=2
app.get('/people', async (req, res) => {
  const session = driver.session();
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const query = `
      MATCH (p:Person)-[:LIVES_IN]->(c:City)
      RETURN p {.*, city: c.name } AS person
      SKIP $skip LIMIT $limit
    `;

    const result = await session.run(query, {
      skip: neo4j.int(skip),
      limit: neo4j.int(limit)
    });

    const people = result.records.map(r => r.get('person'));

    res.json({
      page,
      perPage: limit,
      results: people
    });

  } catch (error) {
    console.error('❌ Error al obtener personas:', error);
    res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
  } finally {
    await session.close();
  }
});

// Ciudades paginadas
// Ejemplo: GET /cities?page=1
app.get('/cities', async (req, res) => {
  const session = driver.session();
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const query = `
      MATCH (c:City)
      RETURN c {.*} AS city
      SKIP $skip LIMIT $limit
    `;

    const result = await session.run(query, {
      skip: neo4j.int(skip),
      limit: neo4j.int(limit)
    });
    const cities = result.records.map(r => r.get('city'));

    res.json({
      page,
      perPage: limit,
      results: cities
    });

  } catch (error) {
    console.error('❌ Error al obtener ciudades:', error);
    res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
  } finally {
    await session.close();
  }
});

// ======================
// Iniciar servidor
// ======================
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
