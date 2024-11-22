// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// Serve static files from the 'resources' directory
app.use(express.static(path.join(__dirname, 'src/resources')));

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

//dummy API
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});


app.get('/', (req, res) => {
    res.redirect('pages/login');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);
  const username = req.body.username;
  // To-DO: Insert username and hashed password into the 'users' table
  const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';


  // get the student_id based on the emailid
  db.one(query, [username, hash])
    .then(data => {

      res.redirect('/login');
      console.log("Registered User with Password: ", data);
    })
    .catch(err => {
      console.log(err);
      res.redirect('/register');
    });

});

app.post('/login', async (req, res) => {
  const query = "SELECT * FROM users where username = $1";
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await db.one(
      query, [username]
    )
    console.log("Retrieved User: ", user)
    // check if password from request matches with password in DB
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    console.log(user);
    if (match)
    {
      
      //save user details in session like in lab 7
      req.session.user = username;
      req.session.save();
      res.redirect("/home");
    }
    else{
      res.redirect("/login");
    }
    
  }

  catch(error){
    res.redirect("/register");
    console.log(error)
    
  }


});


app.get('/home', (req, res) => {
  res.render('pages/home', {

  });
});

// app.get('/course', async (req, res) => {
//   const courseID = req.query.course_id;
//   res.render('pages/course', {
//     courses: {

//     }
//   });
// });

// Route for course page
app.get('/course', async (req, res) => {
  try {
    const courseId = req.body.course_id;

    // Query course details
    const courseQuery = `
      SELECT course_name, course_description 
      FROM courses 
      WHERE course_id = $1
    `;
    const courseResult = await pool.query(courseQuery, [courseId]);

    if (courseResult.rows.length === 0) {
      return res.status(404).send('Course not found');
    }

    const course = courseResult.rows[0];

    // Query enrolled students
    const studentsQuery = `
      SELECT username 
      FROM user_courses 
      WHERE course_id = $1
    `;
    const studentsResult = await pool.query(studentsQuery, [courseId]);
    const students = studentsResult.rows.map(row => row.username);

    // Render the course page with the data
    res.render('pages/course', {
      courses: {
        course_name: course.course_name,
        course_description: course.course_description,
      },
      users: {
        username: students,
      },
    });
  } 
  catch (error) {
    console.error('Error fetching course data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profile', (req, res) => {
  res.render('pages/profile', {

  });
});



// Authentication Required
// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

app.use(auth);


app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy the session
    res.render('pages/logout', {message: "Logged out successfully"});
});

// API Route for Class Search
app.get('/api/class-search', async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const result = await db.query(
            `SELECT * FROM courses
             WHERE course_name ILIKE $1 OR course_id::text LIKE $1`,
            [`%${searchTerm}%`]
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Redirect route for course selection
app.get('/class-select', async (req, res) => {
    const courseId = req.query.courseId;
    try 
    {
        const result = await db.query(
            `SELECT * FROM courses WHERE course_id = $1`,
            [courseId]
        );

        if (result.rowCount === 0) {
            res.status(404).send('Course not found');
        }
        else {
            res.redirect(`/courses/${courseId}`);
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');

