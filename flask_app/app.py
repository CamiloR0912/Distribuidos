from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

# Ruta al JSON (dentro del contenedor)
STUDENTS_FILE = "/app/students.json"


def load_students():
    """Carga los estudiantes desde el archivo JSON."""
    if os.path.exists(STUDENTS_FILE):
        with open(STUDENTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_students(students):
    """Guarda la lista de estudiantes en el archivo JSON."""
    with open(STUDENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(students, f, indent=4, ensure_ascii=False)


@app.route("/students", methods=["GET"])
def get_students():
    students = load_students()
    return jsonify(students)


@app.route("/student/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    students = load_students()
    updated_students = [s for s in students if s.get("id") != student_id]

    if len(students) == len(updated_students):
        return jsonify({"error": f"No se encontró el estudiante con id {student_id}"}), 404

    save_students(updated_students)
    return jsonify({"message": f"Estudiante con id {student_id} eliminado correctamente"})


@app.route("/student/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    students = load_students()
    data = request.json  # datos enviados en el body (JSON)

    for student in students:
        if student.get("id") == student_id:
            student.update(data)  # actualiza solo los campos enviados
            save_students(students)
            return jsonify({
                "message": f"Estudiante con id {student_id} actualizado correctamente",
                "student": student
            })

    return jsonify({"error": f"No se encontró el estudiante con id {student_id}"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

