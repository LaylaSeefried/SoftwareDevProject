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
  course_id NUMERIC PRIMARY KEY,
  course_name VARCHAR(100) NOT NULL,
  credit_hours NUMERIC NOT NULL,
  course_description VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS student_courses;
CREATE TABLE user_courses (
  course_id INTEGER NOT NULL REFERENCES courses (course_id),
  student_id INTEGER NOT NULL REFERENCES students (student_id),
  RIMARY KEY (course_id, student_id)
);

