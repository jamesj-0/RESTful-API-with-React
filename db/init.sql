BEGIN;

    DROP TABLE IF EXISTS users, examples
    CASCADE;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(511) NOT NULL,
    adminusr BOOLEAN
);

CREATE TABLE examples
(
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    language VARCHAR(32),
    title VARCHAR(255),
    example TEXT NOT NULL,
    date TIMESTAMP
    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

    INSERT INTO users
        (username, email, user_password, adminusr)
    VALUES
        ('admin', 'admin@iscool.com', '$2a$10$zH7.4s2AbH8Lz.SqsauRSOldLUacu3axD.0ZgoR2v2CJpM/pItOiy', true),
        ('Tom', 'tom@iscool.com', '$2a$10$aHsFImUy5q1fj37Z72O6r.iUpDLL1CBH38UCaHGK25CEP5W5uyVQa', false),
        ('Chloe', 'chloe@iscool.com', '$2a$10$QFV6woSkfTa6XhaJAYYCmu8fqkLOduWm.kDzZI56crZCTIaKzaFDy', false),
        ('Kat', 'kat@iscool.com', '$2a$10$SSahAXMX/e.3VS0juErkceVbwwR1iL8/cWYnOD5IILyf.74EMnHr6', false),
        ('Roger', 'roger@iscool.com', '$2a$10$./Rk0decBFt/XHJcIJX2XOq3Qq0AbfsQCPNQ7Gz66TA7dFK8l5/Fm', false);

    INSERT INTO examples
        (owner_id, language, title, example)
    VALUES
        (1, 'js', 'Test example 1', 'Example 1 code goes here.'),
        (2, 'sql', 'Test example 2', 'Example 2 code goes here.'),
        (3, 'js', 'Test example 3', 'Example 3 code goes here.'),
        (4, 'js', 'Test example 4', 'Example 4 code goes here.');

    COMMIT;