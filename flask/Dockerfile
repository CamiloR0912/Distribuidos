FROM python:3.9-alpine

RUN pip install flask 
WORKDIR /app
COPY app.py /app

EXPOSE 5000

CMD ["python", "app.py"]
