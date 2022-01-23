# Tésis - Gestión de inmuebles web

## Build image

    sudo docker build . -t tesis-web

## Run image

    sudo docker run --name tesis-web-production -d -p 80:80 tesis-web
