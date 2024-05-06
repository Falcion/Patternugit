FROM node:20

WORKDIR /repos/app

COPY package.json ./

COPY environment.ts ./
# Ensure copying typings for TS for ensure typesafe onload
COPY environment.d.ts ./typings/

RUN npm i

COPY . .

EXPOSE 3000

# Set up and start the app
CMD npm start