create table users(
email varchar(50) primary key,
password varchar(500)
);

create table event(
event_id int primary key,
name varchar(50),
location varchar(500)
);

create table booking(
email varchar(50),
booking_id serial,
event_id int, 
num_tickets int, 
status varchar(50),
constraint event_id_fk foreign key (event_id) references event(event_id),
constraint email_fk foreign key(email) references users(email),
PRIMARY KEY (email, event_id)
);

INSERT INTO event (event_id, name, location) VALUES 
(1, 'Tech Conference 2025', '123 Tech Street, Silicon Valley, CA'),
(2, 'Music Festival', '456 Music Avenue, Nashville, TN'),
(3, 'Art Expo', '789 Art Blvd, New York, NY'),
(4, 'Food Carnival', '101 Food Lane, Austin, TX'),
(5, 'Startup Pitch', '202 Startup Road, San Francisco, CA');