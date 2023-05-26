# MERN Twitter Clone

<!-- ![amazona](/frontend/public/images/amazona.jpg) -->

## Demo Website

- **👉 Render : [https://twitter-by-trupti.onrender.com](https://twitter-by-trupti.onrender.com)**

# Features

1. Login page (where user can enter the details and login)
2. Register page (where users can enter the register detail and register)
3. Home page (where we list all the tweets)
4. Profile details page (show a user profile details)
5. Tweet Details Page (show tweet detail and also list all the replies related to that
   tweet)

## How To Run This App Locally:

### 1. Clone repo

```
$ git clone https://github.com/Trupti0406/twitter-clone.git
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
  - In the .env file update MONGODB_URI=mongodb://localhost/twitter-clone
- OR Atlas Cloud MongoDB (The one I've used)Create a database at [https://cloud.mongodb.com](https://cloud.mongodb.com)](https://cloud.mongodb.com)
  - In the .env file update MONGODB_URI=mongodb+srv://your-db-connection

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

## Contact

- **Contact Creator: [Trupti Yadav](mailto:truptivijayyadav27@gmail.com)**
