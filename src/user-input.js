// handles things related to readline and user input
const readline = require('readline');

var rl = readline.createInterface(process.stdin, process.stdout);

// displays a message when rl closes
rl.on('close', function() {
  console.log('Complete.');
  process.exit(0);
});

/** get the user's next command. Returns a Promise with a list of strings */
var getCommand = () => {
  return new Promise((resolve, reject) => {
    rl.question('> ', function(line) {
      resolve(line.trim().split(/\s+/));
    });
  });
};

/** Question the user with query. Returns a promise with a string */
var getUserInput = (query) => {
  return new Promise((resolve, reject) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};


module.exports = {
  getCommand,
  getUserInput
};
