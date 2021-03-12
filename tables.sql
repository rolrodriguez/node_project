CREATE DATABASE familyhistory;
\c familyhistory;

CREATE TABLE Person (
    id SERIAL PRIMARY KEY,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    birthDate date NOT NULL
);

CREATE TABLE Relations(
    id SERIAL PRIMARY KEY,
    parent int references Person(id),
    children int references Person(id)
);

INSERT INTO person (firstName, lastName, birthDate) VALUES ('Rolando', 'Rodriguez', '1987-12-10'), ('Alec', 'Rodriguez', '2019-10-04'), ('John', 'Doe', '2034-10-25');
INSERT INTO relations (parent, children) VALUES (1, 2), (2, 3);