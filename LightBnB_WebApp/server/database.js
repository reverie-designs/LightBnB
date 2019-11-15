const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let userEmail = email.toLowerCase();
  return pool.query(`
  SELECT * FROM users
  WHERE users.email = $1
  ;`, [userEmail])
  .then(res =>  res.rows[0]);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE users.id = $1
  ;`, [id])
  .then(res =>  res.rows[0]);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  ;`, [user.name, user.email, user.password])
  .then(res =>  res.rows[0]);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations.* , properties.* , AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
  .then(res =>  res.rows);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  let values = [];
  let queryString = `
                    SELECT properties.*, avg(property_reviews.rating) as average_rating
                    FROM properties
                    LEFT JOIN property_reviews ON properties.id = property_id
                    WHERE true`;
  
  if (Object.keys(options).length === 0){
    values.push(limit);
    queryString += `
                    GROUP BY properties.id 
                    ORDER BY cost_per_night
                    LIMIT $${values.length};
                    `;
  } else {
    values.push(limit);
    queryString = `
                    SELECT properties.*, avg(property_reviews.rating) as average_rating
                    FROM properties
                    LEFT JOIN property_reviews ON properties.id = property_id
                    WHERE true
                    `;

    if (options.city) {
      values.push(`%${options.city}%`);
      queryString += `AND city LIKE $${values.length}`;
    }

    if (options.minimum_price_per_night) {
        values.push(options.minimum_price_per_night*100);
        queryString += ` AND cost_per_night > $${values.length}`;
    }

    if (options.maximum_price_per_night) {
        values.push(options.maximum_price_per_night*100);
        queryString += ` AND cost_per_night < $${values.length}`;
    }

    if (options.owner_id) {
      values.push(options.owner_id);
      queryString += `AND owner_id = $${values.length}`;
    }

    queryString += ` GROUP BY properties.id `;

    if (options.minimum_rating) {
      values.push(options.minimum_rating);
      queryString += ` HAVING AVG(property_reviews.rating) >= $${values.length}`;
    }

    queryString += `
                    ORDER BY cost_per_night
                    LIMIT $1;
                  `;
  }

  return pool.query(queryString, values)
  .then(res =>  res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [property.title, property.description, Number(property.number_of_bedrooms), Number(property.number_of_bathrooms), Number(property.parking_spaces), Number(property.cost_per_night), property.thumbnail_photo_url, property.cover_photo_url, property.street, property.country, property.city, property.province, property.post_code, property.owner_id];
  
  // queryParams(values);
  const queryString = `
  INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`
  ;
 
 // console.log('THIS IS RESULT', result);
  return pool.query(queryString, values)
    .then(res => res.rows);

};
exports.addProperty = addProperty;
