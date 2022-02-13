const jwt = require('jsonwebtoken'); // authentication
const redis = require('redis') // for storing sessions and user profiles
require('dotenv').config();

// accepts connection as parameter (beter to define it explicitly)
const redisClient = redis.createClient({host: process.env.REDIS_URI});
redisClient.on('connect', function() {
    console.log('Redis client connected');
});
redisClient.on('error', function (err) {
    console.log(`Redis not connected: ${err}`);
});

// Just returns promises
const handleSignIn = (db,bcrypt,req,res) => {
    const {email, password} = req.body;
    if (!email || !password) { // if either of the objects doesn't exist
        return Promise.reject('Invalid username and password'); // Promise gets send to signInAuth()
    }
    return db.select('email','hash').from('login')
    .where('email','=',email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users').where('email','=',email)
            .then(user => user[0])
            .catch(err => Promise.reject('Failed to return an user'))
        } else {
            Promise.reject('Invalid email and password');
        }
    })
    .catch(err => Promise.reject(`Something went wrong... Try again:\n ${err}`));
};

// signing a Token with a user's email
const signToken = (email) => {
    const jwtPayload = {email};
    // sign(signingobj,secret,expires)
    return jwt.sign(jwtPayload, `${process.env.JWT_SECTRET}`, {expiresIn: '2 days'});
}

// Sets token for authentication: returns a promise
const setToken = (key,val) => {
    return Promise.resolve(redisClient.set(key,val))
}

// Generates JWT Token and returns user data
const createSessions = (user) => {
    // NB!!! Try to avoid signing tokens with sensitive data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token,id)
    .then(() => { return { 
        success: true,
        userId: id,
        token // key and value is the same
    }})
    .catch(err => Promise.reject(`Failed to create session:\n ${err}`))
}

// Pass the Auth Token
const getAuthTokenId = (req,res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, () => (err,reply) => {
        if (err || !reply) {
            return res.status(400).json('Unauthorized')
        }
        return res.json({id: reply})
    })
}

// default handler: only default handlers should return a response
const signInAuth = (db,bcrypt) => (req,res) => {
    const { authorization } = req.headers // client sends token in request header
    return authorization ? getAuthTokenId(req,res) : handleSignIn(db,bcrypt,req,res)
    .then(data => {
        return data.id && data.email ? createSessions(data) : 
        Promise.reject('Invalid username and password');
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(`Failed to Authenticate:\n ${err}`))
};

module.exports = {
    handleSignIn,
    signInAuth
}
