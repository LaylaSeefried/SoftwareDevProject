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
  host: process.env.HOST, // the database server
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

app.use('/css', express.static(path.join(__dirname, 'resources/css')));
app.use('/js', express.static(path.join(__dirname, 'resources/js')));

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

// Dummy API
app.get('/welcome', (req, res) => {
    res.json({ status: 'success', message: 'Welcome!' });
});

// Public Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('pages/login', { customNavbar: true });
});

app.get('/register', (req, res) => {
    res.render('pages/register', { customNavbar: true });
});

app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';

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
    const query = "SELECT * FROM users WHERE username = $1";
    const username = req.body.username;
    const password = req.body.password;

    try {
        // Fetch user by username
        const user = await db.one(query, [username]);

        // Compare password
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Successful login
            req.session.user = username;
            req.session.save(() => {
                res.redirect("/home");
            });
        } else {
            // Password mismatch
            res.render('pages/login', {
                customNavbar: true,
                errorMessage: 'Password does not match the username. Please try again or register.',
            });
        }
    } catch (error) {
        // Handle database query errors (e.g., username not found)
        if (error.message.includes('No data returned from the query')) {
            res.render('pages/login', {
                customNavbar: true,
                errorMessage: 'Invalid username. Please try again or register.',
            });
        } else {
            console.error("Login error:", error);
            res.status(500).send("Server error");
        }
    }
});


// Authentication Middleware
const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Protected Routes (use `auth` middleware here)
app.get('/home', auth, (req, res) => {
    res.render('pages/home', {});
});

app.get('/course', auth, (req, res) => {
    res.render('pages/course', {});
});

app.get('/profile', auth, (req, res) => {
    res.render('pages/profile', {});
});

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

// Route for rendering course pages
app.get('/courses/:courseId', async (req, res) => {
    console.log('DB object:', db);
    const courseId = parseInt(req.params.courseId, 10);
    console.log('Parsed course ID:', courseId);

    if (isNaN(courseId)) {
        console.error('Invalid course ID:', req.params.courseId);
        return res.status(400).send('Invalid course ID');
    }

    try {
        // Fetch course details
        const courseResult = await db.query(
            `SELECT course_name, course_description, credit_hours
             FROM courses
             WHERE course_id = $1`,
            [courseId]
        );

        console.log('Course query result:', courseResult);

        if (!courseResult || courseResult.length === 0) {
            console.error('No course found for:', courseId);
            return res.status(404).send('Course not found');
        }

        const course = courseResult[0];
        console.log('Course details:', course);

        // Fetch enrolled students
        const studentsResult = await db.query(
            `SELECT u.username
             FROM student_courses sc
             JOIN users u ON sc.username = u.username
             WHERE sc.course_id = $1`,
            [courseId]
        );

        console.log('Students query result:', studentsResult);

        const students = studentsResult.map(row => row.username);

        // Render the course.hbs template with the course data
        res.render('pages/course', {
            course_name: course.course_name,
            course_description: course.course_description,
            credit_hours: course.credit_hours,
            students: students,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// *****************************************************
// <!-- Section 5 : Start Server -->
// *****************************************************
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');


