FROM alpine:3.20

WORKDIR app/

RUN apk add curl

COPY mensaje.txt app/mensaje.txt

CMD ["cat", "app/mensaje.txt"]
