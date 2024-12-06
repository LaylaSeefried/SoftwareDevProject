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
    const { username, password, bio, year, major, email } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (username, password, bio, year, major, email)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        await db.one(query, [username, hash, bio, year, major, email]); // Include 'email' in the array
        res.redirect('/login');
    } catch (err) {
        console.error('Error registering user:', err);
        res.redirect('/register');
    }
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

app.get('/users_profile', (req, res) => {
    const username = req.query.username;
    // Fetch user details from the database based on the username
    // Assuming you have a function to fetch user data
    getUserProfile(username, (err, user) => {
        if (err) {
            return res.status(500).send('Error fetching user profile');
        }
        res.render('user_profile', { user: user });
    });
});


app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Failed to log out');
        }

        // Redirect to the login page or send a success message
        res.redirect('/login'); // Redirect to login page after successful logout
    });
});


app.get('/profile', auth, async (req, res) => {
    const username = req.session.user;

    if (!username) {
        return res.status(400).send('User not logged in');
    }

    try {
        // Fetch user details
        const userQuery = `
            SELECT username, bio, year, major, email
            FROM users
            WHERE username = $1
        `;
        const user = await db.oneOrNone(userQuery, [username]);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch user courses
        const coursesQuery = `
            SELECT c.course_name, c.credit_hours
            FROM student_courses sc
            JOIN courses c ON sc.course_id = c.course_id
            WHERE sc.username = $1
        `;
        const courses = await db.any(coursesQuery, [username]);

        // Render the profile page with user and courses data
        res.render('pages/profile', {
            username: user.username || '',
            bio: user.bio || 'No bio available.',
            year: user.year || 'Not specified.',
            major: user.major || 'Not specified.',
            email: user.email || 'No email provided.',
            courses: courses,
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).send('Server error');
    }
});


app.post('/api/profile', auth, async (req, res) => {
    const { currentUsername, newUsername, about, year, major, email } = req.body;

    if (!currentUsername) {
        return res.status(400).json({ error: 'Current username is required' });
    }

    try {
        const dbTransaction = async t => {
            // Update `username` in related tables first
            if (newUsername && newUsername !== currentUsername) {
                const updateRelatedTablesQuery = `
                    UPDATE student_courses
                    SET username = $1
                    WHERE username = $2
                `;
                await t.none(updateRelatedTablesQuery, [newUsername, currentUsername]);
            }

            // Update the `users` table
            const updateUserQuery = `
                UPDATE users
                SET username = $1, bio = $2, year = $3, major = $4, email = $5
                WHERE username = $6
                RETURNING username, bio, year, major, email
            `;
            return t.one(updateUserQuery, [
                newUsername || currentUsername, // Use newUsername if provided, otherwise keep currentUsername
                about,
                year,
                major,
                email,
                currentUsername,
            ]);
        };

        const updatedUser = await db.tx(dbTransaction);

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
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
            course_id: courseId,
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

app.post('/courses/add', auth, async (req, res) => {
    const courseId = req.body.course_id;
    const username = req.session.user;

    if (!courseId || !username) {
        return res.status(400).send("Invalid request");
    }

    try {
        // Insert the course and user relationship into the `student_courses` table
        const query = `
            INSERT INTO student_courses (course_id, username)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING; -- Prevent duplicate entries
        `;

        await db.none(query, [courseId, username]);

        // Redirect back to the course page
        res.redirect(`/courses/${courseId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get('/users/:username', auth, async (req, res) => {
    const username = req.params.username;

    try {
        // Fetch user details, including email
        const userQuery = `
            SELECT username, bio, year, major, email
            FROM users
            WHERE username = $1
        `;
        const user = await db.one(userQuery, [username]);

        // Fetch the user's enrolled courses
        const coursesQuery = `
            SELECT c.course_name, c.credit_hours
            FROM student_courses sc
            JOIN courses c ON sc.course_id = c.course_id
            WHERE sc.username = $1
        `;
        const courses = await db.any(coursesQuery, [username]);

        // Render the view-profile template with all user details
        res.render('pages/view-profile', {
            user: {
                username: user.username,
                bio: user.bio,
                year: user.year,
                major: user.major,
                email: user.email, // Include the email
                courses: courses,
            },
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(404).send('User not found');
    }
});

app.get('/view-profile', async (req, res) => {
    const username = req.query.username; // Extract the username from the query

    try {
        // Fetch user details
        const userQuery = `
            SELECT username, bio, year, major, email
            FROM users
            WHERE username = $1
        `;
        const user = await db.oneOrNone(userQuery, [username]);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch the user's enrolled courses
        const coursesQuery = `
            SELECT c.course_name, c.credit_hours
            FROM student_courses sc
            JOIN courses c ON sc.course_id = c.course_id
            WHERE sc.username = $1
        `;
        const courses = await db.any(coursesQuery, [username]);

        // Render the profile page
        res.render('pages/view-profile', {
            user: {
                username: user.username,
                bio: user.bio,
                year: user.year,
                major: user.major,
                email: user.email,
                courses: courses,
            },
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).send('Server error');
    }
});






// *****************************************************
// <!-- Section 5 : Start Server -->
// *****************************************************
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');


