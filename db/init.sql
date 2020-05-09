BEGIN;

    DROP TABLE IF EXISTS users, links
    CASCADE;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(511) NOT NULL,
    adminusr BOOLEAN
);

CREATE TABLE links
(
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    link VARCHAR(255),
    title TEXT NOT NULL,
    date TIMESTAMP
    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

    INSERT INTO users
        (username, email, user_password, adminusr)
    VALUES
        ('admin', 'admin@iscool.com', '$2a$10$zH7.4s2AbH8Lz.SqsauRSOldLUacu3axD.0ZgoR2v2CJpM/pItOiy', true),
        ('James', 'james@iscool.com', '$2a$10$aHsFImUy5q1fj37Z72O6r.iUpDLL1CBH38UCaHGK25CEP5W5uyVQa', false),
        ('Jimmyface123', 'jimmy@iscool.com', '$2a$10$aHsFImUy5q1fj37Z72O6r.iUpDLL1CBH38UCaHGK25CEP5W5uyVQa', false);


    INSERT INTO links
        (owner_id, link, title)
    VALUES
        (2, 'www.bandcamp.com', 'bandcamp'),
        (2, 'www.spotify.com', 'spotify'),
        (2, 'www.soundcloud.com', 'soundcloud'),
        (3, 'www.mixcloud.com', 'mixcloud');

    COMMIT;