const handleRegister = (req,res,db,bcrypt) => {
    let hashed = '';
    const {email, name, password} = req.body;
    // NB! Server and client should do error handling respectively
    if (!email || !name || !password) { // if either of the objects doesn't exist
       return res.status(400).json('All fields must be filled in');
    }
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        hashed = hash;
    });
    db.transaction(trx => { // transaction knex function
        trx.insert({
            hash: hashed,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginmail => {
            // returning ---  specifies which columns should be returned by a method 
           trx('users').returning('*').insert({ // NB! Never send a user's password over a response
                email: loginmail[0],
                name: name,
                joined: new Date() // creates current date object
            })
            .then(user => {
                res.json(user[0]); // returns inserted user
            })
            .then(trx.commit) // commits the db transaction
            .catch(trx.rollback); // abort transaction
        });
    })
    .catch(err => res.status(400).json('Failed to register user'));
};

module.exports = {
    handleRegister: handleRegister
};