
 -- Inserting sample date to begin work on searchbar
INSERT INTO courses
  (course_id, course_name, credit_hours, course_description)
VALUES
  (1000, 'Computer Science as a Field of Work and Study', 1, 'Introduces curriculum, learning techniques, time management and career opportunities in Computer Science. Includes presentations from alumni and others with relevant educational and professional experience.'),
  (1300, 'Introduction to Programming', 4, 'Teaches techniques for writing computer programs in higher level programming languages to solve problems of interest in a range of application domains. Appropriate for students with little to no experience in computing or programming.'),
  (1200, 'Introduction to computational thinking', 3, 'Teaches computational thinking and techniques for writing computer programs using the Python programming language. Intended for students who realize that computational skills are beneficial to all fields of study, but who have little or no experience in programming or are not Computer Science majors. Students will be expected to create computer programs to solve problems in a range of disciplines. Does not count as Computer Science credit for the Computer Science BA, BS, or minor.'),
  (2270, 'Data Structures', 4, 'Studies data abstractions (e.g., stacks, queues, lists, trees, graphs, heaps, hash tables, priority queues) and their representation techniques (e.g., linking, arrays). Introduces concepts used in algorithm design and analysis including criteria for selecting data structures to fit their applications. Knowledge OF C++ is highly recommended.'),
  (2400, 'Computer Systems', 4, 'Covers how programs are represented and executed by modern computers, including low-level machine representations of programs and data, an understanding of how computer components and the memory hierarchy influence performance.'),
  (3308, 'Software Development Methods and Tools', 3, 'Covers tools and techniques for successful software development with a strong focus on best practices used in industry. Students work in small teams to complete a semester-long application development project. Students learn front-end design and construction using HTML & CSS, back-end database design and construction, and full-stack integration. Students gain exposure to agile methodologies, web services, distributed version control, requirements definition, automated integration testing, and cloud-based application deployment.'),
  (2824, 'Discrete Structures', 3, 'Covers foundational materials for computer science that is often assumed in advanced courses. Topics include set theory, Boolean algebra, functions and relations, graphs, propositional and predicate calculus, proofs, mathematical induction, recurrence relations, combinatorics, discrete probability. Focuses on examples based on diverse applications of computer science.'),
  (3104, 'Algorithms', 4, 'Covers the fundamentals of algorithms and various algorithmic strategies, including time and space complexity, sorting algorithms, recurrence relations, divide and conquer algorithms, greedy algorithms, dynamic programming, linear programming, graph algorithms, problems in P and NP, and approximation algorithms.'),
  (3155, 'Principles of Programming Languages', 4, 'Studies principles governing the design and analysis of programming languages and their underlying execution models. Explores values, scoping, recursion, higher-order functions, type systems, control structures, and objects. Introduces formal semantics as a framework for understanding programming features. Introduces advanced programming concepts such as functional programming, higher-order functions, immutable values and structures, inductive types, functors, continuation-passing; and object-oriented programming using inheritance, generics and covariance/contravariance in a functional programming language such as Scala.'),
  (3287, 'Design and Analysis of Database systems', 3, 'Introduces the fundamental concepts of database requirements analysis, database design, and database implementation with emphasis on the relational model and the SQL programming language. Introduces the concepts of Big Data and NoSQL systems.'),
  (3753, 'Design and Analysis of Operating systems', 4, 'Analyzes the software that extends hardware to provide a computing environment, including the role of linkers, file systems, resource sharing, security and networking. Studies the history of operating system organization and design and their influence on security, functionality and reliability.'),
  (2820, 'Linear Algebra with Computer Science Applications', 3, 'Introduces the fundamentals of linear algebra in the context of computer science applications. Includes vector spaces, matrices, linear systems, and eigenvalues. Includes the basics of floating point computation and numerical linear algebra.'),
  (3202, 'Introduction to Artificial Intelligence', 3, 'Surveys artificial intelligence techniques of search, knowledge representation and reasoning, probabilistic inference, machine learning, and natural language. Knowledge of Python strongly recommended.'),
  (3022, 'Introduction to Data Science', 3, 'Introduces students to the tools methods and theory behind extracting insights from data. Covers algorithms of cleaning and munging data, probability theory and common distributions, statistical simulation, drawing inferences from data, and basic statistical modeling.'),
  (3002, 'Fundamentals of Human Computer Interaction', 4, 'Introduces the practice and research of human-computer interaction, including its history, theories, the techniques of user-centered design, and the development of interactive technologies. Covers computing in society at large with respect to domains such as health, education, assistive technology, ethics, environment, and more.'),
  (3010, 'Intensive Programming Workshop', 3, 'Explores concepts and techniques for design and construction of larger, reliable, and maintainable software systems in the context of object-oriented programming. Covers various topics including: object-oriented programming paradigms, scope, inheritance, program structure and design, practical use of version control, working with established code bases, and building graphical user interfaces. Emphasizes coding individually and in pairs and includes in class lab work, smaller coding assignments, and multiple weeks-long projects. Not intended for students in their final year of the Computer Science BA or BS degree. Formerly offered as a special topics course.'),
  (4253, 'Data Center Scale Computing', 3, 'Covers the primary problem solving strategies, methods and tools needed for data-intensive programs using large collections of computers typically called "warehouse scale" or "data-center scale" computers. Examines methods and algorithms for processing data-intensive applications, methods for deploying and managing large collections of computers in an on-demand infrastructure and issues of large-scale computer system design.'),
  (4273, 'Network Systems', 3, 'Focuses on design and implementation of network programs and systems, including topics in network protocols, file transfer, client-server computing, remote procedure call and other contemporary network system design and programming techniques. Familiarity with C and Unix or Linux is required.'),
  (4308, 'Software Engineering Project 1', 4, 'Senior capstone course in which students design, implement, document and test software systems for use in industry, non-profits, government and research institutions. Also offers extensive experience in oral and written communication throughout the development process. Department consent required. Department-enforced prerequisites differ for BS and BA degree. Contact academic advisor for details. Senior Capstone courses are optional for BA students. BA students interested in taking this course should contact their advisor early in their major.'),
  (4448, 'Object-Oriented Analysis and Design', 3, 'An applied analysis and design class that addresses the use of object-oriented techniques. Topics include domain modeling, use cases, architectural design and modeling notations. Students apply the techniques in analysis and design projects.'),
  (4502, 'Data Mining', 3, 'Introduces basic data mining concepts and techniques for discovering interesting patterns hidden in large-scale data sets, focusing on issues relating to effectiveness and efficiency. Topics covered include data preprocessing, data warehouse, association, classification, clustering, and mining specific data types such as time-series, social networks, multimedia, and Web data.');


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
