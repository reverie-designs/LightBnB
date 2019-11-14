INSERT INTO users (name, email, password)
VALUES ('Harry Potter', 'harry@killvoldy.com', '$2a$10$FB/BOAVhpExperliramusuLvpOREQVmvmezD4ED/.'),
('Hermione Granger', 'msknowitall@encyclopedia.com', '$2a$10$FB/BOAVhpExpObliVAiateEQVmvmezD4ED/.'),
('Rondald Billius Weasley', 'ronilwasil@eatcookies.com', '$2a$10$FB/BOAVhpChessMAsterpOREQVmvmezD4ED/.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'HOGWARTS', 'a castle', 'pic', 'cover-pic', 125, 3, 15, 500, 'Scotland', 
'5 lighthouse', 'Hogsmeade', 'Magic', 'HOWL', TRUE),
(2, 'Ministry of MAgic', 'a ministry', 'pic2', 'cover-pic2', 1025, 13, 105, 5070, 'ENGLAND', '512 lighthouse', 'London', 'Magic', 'MEAW', TRUE),
(3, 'Weasleys Wizarding Weezed', 'a store', 'pic3', 'cover-pic3', 25, 103, 15, 500, 'ENGLAND', '512 lighthose', 'Diagon Alley', 'Magic', 'HOOO', FALSE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2010-08-13', '2014-09-12', 2, 1),
('2018-08-13', '2018-09-12', 1, 3),
('2019-08-13', '2019-09-19', 3, 2);

INSERT INTO property_reviews (guest_id, reservation_id, property_id, rating, message)
VALUES (1, 1, 1, 9, 'message'),
(3, 2, 3, 7, 'message'), (2, 3, 2, 10, 'message');
