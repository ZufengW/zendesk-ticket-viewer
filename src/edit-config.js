const fs = require('fs');

const userInput = require('./user-input');
const FILE_NAME = 'config.json';

/** This function is synchronous. Reads the config file. Returns an object. */
var readConfig = () => {
  try {
    var contents = fs.readFileSync(FILE_NAME);
    return JSON.parse(contents);
  } catch (e) {
    // file probably doesn't exist
    return {};
  }
};

/** asks the user for config details: url, email, token */
var getConfigDetails = () => {
  var details = {};
  return new Promise((resolve, reject) => {
    userInput.getUserInput('  url: ').then((result) => {
      details.url = result;
      return userInput.getUserInput('email: ');
    }).then((result) => {
      details.email = result;
      return userInput.getUserInput('token: ');
    }).then((result) => {
      details.token = result;
      resolve(details);
    });
  });
};

/** asks the user for config details, then writes to file.
 * Returns the object that was written
 */
var writeConfig = (object) => {
  return new Promise((resolve, reject) => {
    getConfigDetails().then((newObject) => {
      // read the orignal object from the file
      var original = readConfig();
      // replace properties in orignal with object if they are not empty
      for (key of Object.keys(newObject)) {
        if (newObject[key]) {
          original[key] = newObject[key];
        }
      }
      fs.writeFileSync(FILE_NAME, JSON.stringify(original));
      resolve(original);
    });
  });
};


module.exports = {
  readConfig,
  writeConfig,
};
