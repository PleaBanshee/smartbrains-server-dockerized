const handleSignIn = (db,bcrypt) => (req,res) => {
    const {email, password} = req.body;
    if (!email || !password) { // if either of the objects doesn't exist
        return res.status(400).json('Invalid username and password');
    }
    db.select('email','hash').from('login')
    .where('email','=',email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users').where('email','=',email)
            .then(user => {
                console.log(user);
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('Failed to return an user'))
        } else {
            res.status(400).json('Invalid email and password');
        }
    })
    .catch(err => res.status(400).json('Something went wrong... Try again'));
};

module.exports = {
    handleSignIn: handleSignIn
}
