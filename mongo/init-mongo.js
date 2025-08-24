db = db.getSiblingDB("mibase"); 
db.createCollection("usuarios");

db.usuarios.insertMany([
  { nombre: "Camilo", rol: "admin" },
  { nombre: "Ana", rol: "user" }
]);
