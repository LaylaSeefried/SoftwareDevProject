
 -- Inserting sample date to begin work on searchbar
INSERT INTO courses
  (course_id, course_name, credit_hours, course_description)
VALUES
  (1000, 'Computer Science as a Field of Work and Study', 1, 'abcabc'),
  (1300, 'Introduction to Programming', 4, 'abcabc'),
  (1200, 'Introduction to computational thinking', 3, 'abcabc'),
  (2270, 'Data Structures', 4, 'abcabc'),
  (2400, 'Computer Systems', 4, 'abcabc'),
  (3308, 'Software Development Methods and Tools', 3, 'abcabc'),
  (2824, 'Discrete Structures', 3, 'abcabc'),
  (3104, 'Algorithms', 4, 'abcabc'),
  (3155, 'Principles of Programming Languages', 4, 'abcabc'),
  (3287, 'Design and Analysis of Database systems', 3, 'abcabc'),
  (3753, 'Design and Analysis of Operating systems', 4, 'abcabc'),
  (2820, 'Linear Algebra with Computer Science Applications', 3, 'abcabc'),
  (3202, 'Introduction to Artificial Intelligence', 3, 'abcabc'),
  (3022, 'Introduction to Data Science', 3, 'abcabc'),
  (3002, 'Fundamentals of Human Computer Interaction', 4, 'abcabc'),
  (3010, 'Intensive Programming Workshop', 3, 'abcabc'),
  (4253, 'Data Center Scale Computing', 3, 'abcabc'),
  (4273, 'Network Systems', 3, 'abcabc'),
  (4308, 'Software Engineering Project 1', 4, 'abcabc'),
  (4448, 'Object-Oriented Analysis and Design', 3, 'abcabc'),
  (4502, 'Data Mining', 3, 'abcabc');

-- Inserting sample data into users table with bios, year, and major
INSERT INTO users (username, password, bio, year, major)
VALUES
  ('johndoe', 'password1', 'A computer science enthusiast who loves algorithms and data structures.', 'junior', 'Computer Science'),
  ('janedoe', 'password2', 'Aspiring software engineer with a passion for artificial intelligence.', 'senior', 'Software Engineering'),
  ('alice', 'password3', 'Web developer focusing on front-end technologies and user experience.', 'sophomore', 'Information Technology'),
  ('bob', 'password4', 'Cybersecurity specialist with a love for cryptography.', 'graduate', 'Cybersecurity'),
  ('charlie', 'password5', 'Database administrator skilled in SQL and data modeling.', 'junior', 'Data Science'),
  ('david', 'password6', 'Back-end developer passionate about API design and server architecture.', 'freshman', 'Computer Engineering'),
  ('eve', 'password7', 'Machine learning enthusiast currently working on NLP projects.', 'senior', 'Artificial Intelligence'),
  ('frank', 'password8', 'Software engineering student exploring full-stack development.', 'junior', 'Software Development'),
  ('grace', 'password9', 'Data analyst interested in data visualization and big data technologies.', 'sophomore', 'Data Analytics'),
  ('heidi', 'password10', 'Cloud computing specialist with experience in AWS and Azure.', 'graduate', 'Cloud Computing');


-- Enrolling students in courses in student_courses table
INSERT INTO student_courses (course_id, username)
VALUES
  (1000, 'johndoe'),
  (1300, 'johndoe'),
  (2270, 'johndoe'),
  (2400, 'janedoe'),
  (3308, 'janedoe'),
  (2824, 'janedoe'),
  (3104, 'alice'),
  (3155, 'alice'),
  (3287, 'alice'),
  (3753, 'bob'),
  (2820, 'bob'),
  (3202, 'charlie'),
  (3022, 'charlie'),
  (3002, 'david'),
  (3010, 'david'),
  (4253, 'eve'),
  (4273, 'eve'),
  (4308, 'frank'),
  (4448, 'frank'),
  (4502, 'grace'),
  (1000, 'grace'),
  (1200, 'heidi'),
  (1300, 'heidi'),
  (2400, 'johndoe'),
  (3308, 'bob'),
  (3155, 'charlie'),
  (3022, 'grace');
