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
    .catch(err => res.status(400).json(`Something went wrong... Try again\n ${err}`));
};

const handleProfileUpdate = (req,res,db) => {
    const {id} = req.params;
    const { name, age, quote } = req.body.formInput; // receives data from modal on frontend
    db('users').where({ id }).update({name})
    .then(response => {
        if (response) {
            res.json('Updated User Profile Successfully!')
        } else {
            res.status(400).json('Failed to update User Profile')
        }
    })
    .catch(err => res.status(400).json(`Something went wrong... Try again\n ${err}`));
};

module.exports = {
    handleProfile,
    handleProfileUpdate
}