const handleProfile = (req,res,db) => {
    // req.params: returns url parameters. Use ':id' in get() url to access the parameters
    const {id} = req.params;
    db.select('*').from('users').where({id}) // id property and value is the same
    .then(user => {
        if (user.length) { // if user exist
            res.json(user[0]);
        } else {
            res.status(400).json('This user doesn\'t exist')
        }
    })
    .catch(err => res.status(400).json('Something went wrong... Try again'));
};

module.exports = {
    handleProfile: handleProfile
}