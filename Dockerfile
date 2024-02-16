#definir imagen base:
FROM node:20

#carpeta donde se va a guardar el proyecto:
WORKDIR /app

#copiar los archivos package de la carpeta local al /app
COPY package*.json ./

#ejecutamos el comando para instalar las dependencias
RUN npm install

#tomamos el codigo del aplicativo y lo pegamos
COPY . .


RUN npm rebuild bcrypt --build-from-source


# habilitamos el puerto que escucha nuestra computadora
EXPOSE 8080

# corremos el aplicativo
CMD ["npm", "start"]