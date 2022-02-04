-- Seed data with a fake user for testing
BEGIN TRANSACTION;

insert into users (name, email, entries, joined) values ('testuser', 'test@gmail.com', 5, '2022-02-03');
insert into login (hash, email) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'test@gmail.com');

COMMIT TRANSACTION;