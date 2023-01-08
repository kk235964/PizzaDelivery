const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3300;
 
app.get('/', (req, res)=>{
    // console.log('Welcome to Home route');
    res.render('home');
});

// Set template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');


app.listen(3300, ()=>{
    console.log(`Server is running on port: ${PORT}`);
});