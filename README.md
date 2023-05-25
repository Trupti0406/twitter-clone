# MERN Twitter Clone

<!-- ![amazona](/frontend/public/images/amazona.jpg) -->

## Demo Website

- **👉 Render : [https://amazona.onrender.com](https://amazona.onrender.com)**

## How To Run This App Locally:

### 1. Clone repo

```
$ git clone git@github.com:trupti0406/twitter-clone.git
$ cd twitter-clone
```

### 2. Create a .env File

Create your values for the following .env variables:

- You can get your values for the first three variables by creating account on https://console.cloudinary.com On the dashboard you'll see all three values.

- MONGODB_URI would be the connecting URL link of your database(I have used MongoDB ATLAS)

- And you can generate your JWT_SECRET from here: https://jwt.io/

```
CLOUD_NAME =
CLOUD_API_KEY =
CLOUD_API_SECRET =
MONGODB_URI =
JWT_SECRET =
```

### 3. Setup MongoDB

- Local MongoDB
  - Install it from [here](https://www.mongodb.com/try/download/community)
  - In .env file update MONGODB_URI=mongodb://localhost/twitter-clone
- OR Atlas Cloud MongoDB (The one I've used)
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - In .env file update MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run the Backend

```
$ cd backend
$ npm install
$ nodemon server.js
```

### 5. Run Frontend

```
# open new terminal
$ cd frontend
$ npm install
$ npm start
```

## Support

- **Contact Creator: [Trupti Yadav](mailto:truptivijayyadav27@gmail.com)**

# Features

1. Login page (where user can enter the details and login)
2. Register page (where user can enter the register detail and register)
3. Home page (where we list all the tweets)
4. Create Git Repository
5. List Products
   1. create products array
   2. add product images
   3. render products
   4. style products
6. Add page routing
   1. npm i react-router-dom
   2. create route for home screen
   3. create router for product screen
