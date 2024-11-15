DROP TABLE IF EXISTS users;
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL,
    bio TEXT,
    year VARCHAR(10) CHECK (year IN ('freshman', 'sophomore', 'junior', 'senior', 'graduate')), -- Constraint to limit values
    major VARCHAR(100)
);

DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  course_id INT PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  credit_hours NUMERIC NOT NULL,
  course_description TEXT
);

DROP TABLE IF EXISTS student_courses;
CREATE TABLE student_courses (
    course_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL, -- Match this to the length of `username`
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(username) ON DELETE CASCADE -- Reference `users(username)`
);
