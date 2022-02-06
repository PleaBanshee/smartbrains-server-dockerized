const express = require('express');
const bcrypt = require('bcrypt-nodejs'); // use this package to hash passwords
const cors = require('cors'); // allows restricted resources to be shared and requested accross the web
const knex = require('knex'); // allows you to build sql queries
const morgan = require('morgan'); // for logging purposes
const register = require('./controllers/register.js'); // register route
const signIn = require('./controllers/signIn.js'); // signin route
const profile = require('./controllers/profile.js'); // profile route
const images = require('./controllers/image.js'); // updating entries
require('dotenv').config();

const app = express();
// use this code so you can parse responses into the correct format
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan('combined'))

// Database configuration
const db = knex({
    client: 'pg', // database is PostgreSQL
    connection: process.env.POSTGRES_URI  // from docker-compose.yml
});

// 'http://localhost:5000
// For CORS: doesn't allow loading responses from frontend to server  
const whitelist = []
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors());

// Test DB Connection
db.raw("SELECT 1").then(() => {
    console.log("PostgreSQL connected");
})
.catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
});

// Default route
app.get('/',(req,res) => {
    res.json(db.users);
});

// Sign In route
app.post('/signIn', signIn.signInAuth(db,bcrypt));

// Register route
app.post('/Register',(req,res) => register.handleRegister(req,res,db,bcrypt)); // dependency injection: passing required objects so we don't need to import them

// Gets a user profile
app.get('/Profile/:id', (req,res) => profile.handleProfile(req,res,db));

// Update a User Profile
app.post('/Profile/:id', (req,res) => profile.handleProfileUpdate(req,res,db));

// API call route
app.post('/imageurl',(req,res) => images.handleApiCall(req,res));

// Increase user rank when submitting images
app.put('/Image', (req,res) => images.handleImages(req,res,db)); // PUT --- updates content

app.listen(3000,() => {
    console.log(`SmartBrains is running on port 3000`);
});