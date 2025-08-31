from flask import Flask, Response
import json
import os

app = Flask(__name__)

STUDENTS_FILE = "/app/data/students.json"

@app.route("/students", methods=["GET"])
def get_students():
    if os.path.exists(STUDENTS_FILE):
        with open(STUDENTS_FILE, "r", encoding="utf-8") as f:
            students = json.load(f)
        # devolver con indentación bonita
        return Response(
            json.dumps(students, ensure_ascii=False, indent=4),
            mimetype="application/json"
        )
    else:
        return Response(
            json.dumps({"error": "Archivo students.json no encontrado"}, indent=4),
            mimetype="application/json",
            status=404
        )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

