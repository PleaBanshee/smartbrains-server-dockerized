BEGIN TRANSACTION;

create table users (
	id serial primary key,
	name VARCHAR(100),
	email text unique NOT null,
	entries BIGINT default 0,
	joined TIMESTAMP not null
);

COMMIT TRANSACTION;