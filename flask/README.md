 API de Estudiantes con Flask y Docker

Este proyecto implementa una API en **Flask** que expone información de estudiantes almacenada en un archivo `students.json`.  
La aplicación corre dentro de un contenedor **Docker** y permite consultar todos los estudiantes con sus respectivas materias.

---

## Características

- API desarrollada con **Flask (Python 3.9)**  
- Contenerización con **Docker**  
- Lectura dinámica de un archivo JSON montado como volumen  
- Endpoint disponible:
  - `GET /students` → devuelve la lista completa de estudiantes

---

## Estructura del proyecto

├── Dockerfile

├── app.py

├── data/

│ └── students.json

└── README.md

---

## Instalación y uso

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/flask-students.git
   cd flask-students

2. Generar el archivo **students.json** (ejemplo ya incluido en **data/**).

3. Construir la imagen Docker:
    ```bash
    docker build -t flask:v1 .

4. Ejecutar el contenedor montando el archivo JSON:
    ```bash
    docker run -d -p 5000:5000 -v $(pwd)/data:/app/data flask:v1

---

## Prueba funcionalidad
Ingresar en la consola el siguiente comando:
    
    curl localhost:5000/students | jq

O ingresa en el navegador a la url localhost:5000/students

---

Autor: Camilo Ramirez

