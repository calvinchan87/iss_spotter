const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data
    // console.log(typeof body);
    const myIP = JSON.parse(body).ip;
    // console.log(typeof data);
  
    callback(null, myIP);
  
  });
  
};

const fetchCoordsByIP = function(ip, callback) {

  request("https://freegeoip.app/json/" + ip, (error, response, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching geo coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data
    // console.log(typeof body);
    const lat = JSON.parse(body).latitude;
    const lon = JSON.parse(body).longitude;
    let obj = {
      latitude: lat,
      longitude: lon
    };
    // console.log(typeof data);
  
    callback(null, obj);
  
  });

};

const fetchISSFlyOverTimes = function(coords, callback) {

  request("http://api.open-notify.org/iss-pass.json?lat=" + coords.latitude + "&lon=" + coords.longitude, (error, response, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data
    // console.log(typeof body);
    const flyoverTimes = JSON.parse(body).response;
    // console.log(typeof data);
  
    callback(null, flyoverTimes);

  });

};

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP(function(error, ip) {
    if (error) {
      return callback(error, null);
    }
  
    fetchCoordsByIP(ip, function(error, coords) {
      if (error) {
        return callback(error, null);
      }
  
      fetchISSFlyOverTimes(coords, function(error, flyoverTimes) {
        if (error) {
          return callback(error, null);
        }
      
        callback(null, flyoverTimes);
      
      });
    });
  });
};

module.exports = { fetchMyIP };
module.exports = { fetchCoordsByIP };
module.exports = { fetchISSFlyOverTimes };
module.exports = { nextISSTimesForMyLocation };