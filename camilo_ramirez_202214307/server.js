/*const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("¡Hola desde un contenedor Docker con Node.js!");
});

app.get("/time", (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const hora = new Date().toLocaleTimeString("es-CO", {
        timeZone: "America/Bogota",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    res.send(`IP del cliente: ${ip} <br> Hora local: ${hora}`);
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});*/

const express = require("express");
const os = require("os");
const app = express();
const port = 3000;

// Obtiene la IPv4 del contenedor (prioriza eth0)
function getContainerIPv4() {
  const nets = os.networkInterfaces();

  // 1) Intentar con eth0 (lo típico en Docker)
  if (nets.eth0) {
    const eth0 = nets.eth0.find(i => i.family === "IPv4" && !i.internal);
    if (eth0) return eth0.address;
  }

  // 2) Si no hay eth0, tomar la primera IPv4 no interna disponible
  for (const name of Object.keys(nets)) {
    const found = nets[name].find(i => i.family === "IPv4" && !i.internal);
    if (found) return found.address;
  }
  return "desconocida";
}

app.get("/", (req, res) => {
  res.send("¡Hola desde un contenedor Docker con Node.js!");
});

app.get("/time", (req, res) => {
  const containerIp = getContainerIPv4();
  const hora = new Date().toLocaleTimeString("es-CO", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  res.send(`IP del contenedor: ${containerIp} <br> Hora (Bogotá): ${hora}`);
});

// (Opcional) Ruta de diagnóstico para comparar IPs
app.get("/whoami", (req, res) => {
  res.json({
    clientIP: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    localAddressForConn: req.socket.localAddress, // IP local usada por el socket
    containerIP: getContainerIPv4()
  });
});

// Asegúrate de escuchar en 0.0.0.0 dentro del contenedor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
  console.log(`IP del contenedor (estimada): ${getContainerIPv4()}`);
});
