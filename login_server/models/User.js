//7
//created a new variable called schema that's
// used to define the structure of our data models.
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
      name: String,
      email: String,
      password: String,
      dateOfBirth: String,
});

// mongoose.model() is a method provided by the mongoose package that creates a new model 
// based on a Schema. You pass two arguments to mongoose.model(): the name of the model, 
// and the Schema that defines its structure.
const User = mongoose.model('User', UserSchema );

module.exports = User;