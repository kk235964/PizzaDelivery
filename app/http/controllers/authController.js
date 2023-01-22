const bcrypt = require('bcrypt')
const flash = require('express-flash');
const passport = require('passport');
const User = require('../../models/users')
function authController(){
    return {
        login(req,res) {
            res.render('auth/login');
        },

        postLogin(req, res,next) {
            const {email , password} = req.body
            if(!email || !password){
                req.flash('err', 'All fields are required')
                req.flash('email', email)
                res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.login(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        },
        register(req,res) {
            res.render('auth/register');
        },
        async postRegister(req, res){
            const {name, email, password} = req.body
            //validate request
            if(!name || !email || !password){
                req.flash('error', 'All fiels are required !')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }
            
            //If user already exist
            User.exists({email: email}, (err, result)=>{
                if(result){
                    req.flash('error', 'User already exists')
                    req.flash('name', name)
                    return res.redirect('/register')
                }
            })
            //hashing password
            const hashPassword = await bcrypt.hash(password, 10)
            // Create a user
            const user = new User ({
                name: name,
                email: email,
                password: hashPassword
            })

            user.save().then((user)=>{
                return res.redirect('/')

            }).catch(err=>{
                req.flash('error', 'Something went wrong')
                
                return res.redirect('/register')
            })

            
        },

        logout (req,res, next){
            req.logout('/logout', next)         //Call back function means its argument should be provided to proceed
            return res.redirect('/login')
        }
    }
}

module.exports = authController;