require('dotenv').config
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3300;
const mongoose = require('mongoose');
const { TRUE } = require('sass');
mongoose.set("strictQuery", false);
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo')(session);
const { collection } = require('./app/models/menu');

//Database connection
const url = 'mongodb://127.0.0.1/pizza';
mongoose.connect(url);
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('Database is connected...')

});


//session  config

app.use(session( {
 secret: 'thisismysecret',
 resave: true,
 saveUninitialized: true,
 //session store
 store: new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions',
    mongoUrl: url,
}),
 cookie: {maxAge: 24*60*60 * 1000}
 }));
 app.use(flash())

//Assets
app.use(express.static('public'));
app.use(express.json());

// global middleware
app.use((req,res,next)=> {
    res.locals.session = req.session
    next() 
})

// Set template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);



app.listen(3300, ()=>{
    console.log(`Server is running on port: ${PORT}`);
});