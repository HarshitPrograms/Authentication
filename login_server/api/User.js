//5
// This router object can then be used to define routes that 
// handle HTTP requests, such as GET, POST, PUT, and DELETE requests. 
// You can specify the HTTP method and the URL path that the route should handle, 
// and provide a function that defines the logic to execute when the route is requested.

const express = require('express');
const router = express.Router();

//9th Mongodb user model
const User = require('./../models/User');

//10th
const bcrypt = require('bcrypt');

//8th
//signup
router.post('/signup', (req, res) => {
    let{name, email, password, dateOfBirth} = req.body;
    name = name.trim(); //trimming of any extra spaces
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name == "" || email == "" || password == "" || dateOfBirth == "") { 
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        })
    } else if(!/^[a-zA-Z]*$/.test(name)){
        //This is a regular expression pattern that checks if the name variable
        // contains only alphabetical characters (letters).
        res.json({
            status: "FAILED",
            message: "invalid name entered"
        })
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        // This is a regular expression pattern that checks 
        // if the email variable is a valid email address or not.
        res.json({
            status: "FAILED",
            message: "invalid email entered"
        })
    } else if(!new Date(dateOfBirth).getTime()){
        // new Date(dateOfBirth) creates a new Date object from the dateOfBirth variable,
        //  which should contain a date string in a specific format such as 'yyyy-mm-dd'.
        res.json({
            status: "FAILED",
            message: "invalid date entered"
        })
    } else if(password.length < 8){
        res.json({
            status: "FAILED",
            message: "password is too short"
        })
    } else{
        // checking if user already exists
        User.find({email}).then(result => {
              if(result.length){
                //a user already exist
                res.json({
                    status: "FAILED",
                    message: "user with the same email already exist"
                })
              } else{
                //try to create new user
                //11th
                //password handeling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                      const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                      });
                     newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result,
                        })
                     }) .catch(err => {
                        console.log(err)
                        res.json({
                            status: "FAILED",
                            message: "an error while creating user"
                        })
                     })

                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "an error while hashing password"
                    })
                })
              }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "an error occured while checking existing users"
            })
        })
    }
})
//12th
//signin
router.post('/signin', (req, res) => {
    let{email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Email or password is empty"
        })
    } else{
        //check if user exists
        User.find({email}).then(data => {
             if(data.length){
                //user exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) {
                        //password match
                        res.json({
                            status: "SUCCESS",
                            message: "signin succesfull",
                            data: data
                        })
                    } else{
                        res.json({
                            status: "FAILED",
                            message: " invalid password entered"
                        })
                    }
                }) .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "an error occured while compareing password"
                    })
                })
             } else {
                res.json({
                    status: "FAILED",
                    message: "user does not exist"
                })
             }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "an error occured while checking for existing users"
            })
        })
    } 
})

module.exports = router;