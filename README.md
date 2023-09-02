<p align="center">
  RESTful API for Medium-clone web application
</p>

## Tech Stack
-  [Nodejs](https://nodejs.org/en)
-  [Express](http://expressjs.com/)
-  [Typescript](https://www.typescriptlang.org/)
-  [Prisma](https://www.prisma.io/)
-  [MySQL](https://www.mysql.com/)

## Structure for the database
[![db.png](https://i.postimg.cc/k5X7cxft/db.png)](https://postimg.cc/CRXyMfyF)

## API Documentation
[Live API Docs](https://app.swaggerhub.com/apis/AFRIZAPAMUJO/Medium-clone/3.0.0)

[![api-docs.png](https://i.postimg.cc/vTjy8ksr/api-docs.png)](https://postimg.cc/WqMCX9tz)

## How to Contribute
#### Clone this repository
````bash
 git clone https://github.com/cuingskot76/medium-clone__backend.git
````
#### Go into the repository
````bash
 cd medium-clone__backend
````
#### Install dependencies
````bash
npm install
````
Create a `.env` file in the root project and matching to your database name
``` bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# for example :
DATABASE_URL="mysql://root:1234@localhost:3306/blog2"
```
#### Run the app
````bash
 npm start
````
Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug.
