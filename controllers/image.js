const Clarifai = require('clarifai');
require('dotenv').config();

// store API keys on server, more secure this way. API keys won't display in the network tab in Devtools
const app = new Clarifai.App({
    apiKey: process.env.API_KEY // set up in Heroku config variables
});

const handleApiCall = (req,res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Failed to upload image'));
}

const handleImages = (req,res,db) => {
    const {id} = req.body;
    db('users').where('id','=',id).increment('entries',1) // increment knex function 
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Failed to update entry count'))
}

module.exports = {
    handleImages,
    handleApiCall
}