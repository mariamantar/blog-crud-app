// require express package
const express = require('express');
const app = express();
// handlebar package to render views
const exphbs = require('express-handlebars');
// mongoose
const mongoose = require('mongoose');
// require bosy parser to parse through the form content
const bodyParser = require('body-parser');
const port = 3000;

// connect to the mongo db
mongoose.connect('mongodb://localhost/blog-dev', { useNewUrlParser: true })
.then(() => console.log("connected to db"))
.catch((err) => console.log(err));


// require the blog model
require('./models/Blog')
// create a Blog model
const Blog = mongoose.model('blogs');
// All middlewares starts here
// middleware for static css files
app.use(express.static('public'));
//middleware for body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// middleware for express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// middleware codes
// app.use((req, res, next) =>{
//   console.log('middleware running');
//   // modify the req object
//   req.name = "NANDS"
//   next()
// });
// home route

// All middlewares end here
app.get('/', (req, res) => {
  // render the home page
  let title = "hello";
  res.render('home',{
    elephant: title
  });
});

//About page
app.get('/about', (req, res) => {
  res.render('about');
});

// add form
app.get('/blogs/new', (req, res) => {
   res.render('blogs/new');
});

// post route to save to the db
app.post('/blogs',(req, res) => {
  console.log(req.body);
  // res.send('ok');
  let errors = [];
  if (!req.body.title) {
    errors.push({text: "Title must be present"});
  }
  if (!req.body.description) {
    errors.push({text: "Description must be present"});
  }
  if (errors.length > 0) {
    res.render('blogs/new', {
      title: req.body.title,
      description: req.body.description,
      errors: errors,
    });

  } else {
    // save to db
    // res.send('passed');
    let newBlog = {
      title: req.body.title,
      description: req.body.description
    }
    new Blog(newBlog)
    .save()
    .then(blogs => {
      console.log(blogs)
      res.redirect('/blogs');
    })
    .catch(err => console.log(err));
  }
});
// show all blogs from  database
app.get('/blogs', (req, res) =>{
  Blog.find()
  .then(blogs => {
    console.log(blogs);
    res.render('blogs/index', {
      blogs: blogs
    });
  })
  .catch(err => console.log(err));
});
// start a server
app.listen(port, () => console.log(`sever started on port ${port}`));
