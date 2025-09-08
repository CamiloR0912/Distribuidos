from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# URL de conexión: postgresql://usuario:contraseña@host:puerto/nombre_db
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@db:5432/students_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Modelo de la tabla
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    carrera = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {"id": self.id, "nombre": self.nombre, "edad": self.edad, "carrera": self.carrera}

# Rutas
@app.route("/students", methods=["GET"])
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students])

@app.route("/student/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": f"No se encontró el estudiante con id {student_id}"}), 404
    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": f"Estudiante con id {student_id} eliminado correctamente"})

@app.route("/student/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": f"No se encontró el estudiante con id {student_id}"}), 404
    data = request.json
    for key, value in data.items():
        setattr(student, key, value)
    db.session.commit()
    return jsonify({"message": f"Estudiante con id {student_id} actualizado correctamente", "student": student.to_dict()})

if __name__ == "__main__":
    # Crear tablas si no existen
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
