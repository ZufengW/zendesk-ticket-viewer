var Zendesk = require('zendesk-node-api');
const moment = require('moment');

const editConfig = require('./src/edit-config');
const userInput = require('./src/user-input');
const config = editConfig.readConfig();
var zendesk = new Zendesk(config);
const H_RULE = '---------------------------------------------------------';

displayIntro();
prompt();

/** get user input and do something about it */
function prompt() {
  userInput.getCommand().then((input) => {
    switch(input[0]) {
      case '0':
        // Edit the config file
        console.log(`Editing the config file. `
            + `Leave field blank to not change.`);
        editConfig.writeConfig().then((config) => {
          // create a new Zendesk instance with the updated details
          zendesk = new Zendesk(config);
          prompt();
        });
        break;
      case '1':
        // display a single ticket
        if (input.length < 2) {
          console.log("Usage is > 1 id");
          prompt();
        } else {
          console.log(`Searching for ticket with id ${input[1]}...`);
          displayTicketInfoWithID(input[1]);
        }
        break;
      case '2':
        // display all tickets
        console.log(`Displaying all tickets...`);
        displayAllTickets();
        break;
      case '3':
        // display the last created ticket
        console.log('Displaying last created ticket... ');
        displayLastTicket();
        break;
      case '4':
        // display a single ticket where the subject contains query as substring
        if (input.length < 2) {
          console.log("Usage is > 4 query");
          prompt();
        } else {
          console.log(`Searching for tickets with subject containing ${input[1]}...`);
          displaySearchTicket(input[1]);
        }
        break;
      case '5':
        // Create a new ticket with subject and description
        if (input.length < 3) {
          console.log("Usage is > 5 subject description");
          prompt();
        } else {
          console.log(`Creating a ticket with subject ${input[1]}...`);
          createTicket(input[1], input[2]);
        }
        break;
      case 'help':
        displayIntro();
        prompt();
        break;
      case '':
        prompt();
        break;
      default:
        // user input didn't match anything
        console.log("Enter help to see all commands");
        prompt();
        break;
    }
  });
}

// ======= Functions for the interactive command line application =======
/** displays instructions */
function displayIntro() {
  console.log(H_RULE);
  console.log("Welcome to the Zendesk Ticket Viewer\n");
  console.log("Please enter one of the following commands:");
  console.log("    0     Edit the config");
  console.log("    1     Display a single ticket");
  console.log("    2     Display all tickets");
  console.log("    3     Display last created ticket");
  console.log("    4     Display tickets where subject contains query");
  console.log("    5     Create a new ticket with subject and description");
  console.log("    help  Display this message");
  console.log(H_RULE);
}


/** displays a single ticket by id */
function displayTicketInfoWithID(id) {
  zendesk.tickets.show(id).then(function(result){
    console.log(H_RULE);
    displayTicketInfo(result);
    console.log(H_RULE);
    prompt();
  }, function(reason) {
    displayRejectionReason(reason);
    prompt();
  });
}


/** displays all the tickets of Zendesk */
function displayAllTickets() {
  getAllTickets((result) => {
    for (ticket of result) {
      displayTicketInfo(ticket);
      console.log('');
    }
  });
}


/** displays last created ticket of Zendesk */
function displayLastTicket() {
  getAllTickets((result) => {
    var latestDate = moment(result[0].created_at);
    var latestTicket = result[0];
    for (ticket of result) {
      if (moment(ticket.created_at) > latestDate) {
        latestTicket = ticket;
        latestDate = moment(ticket.created_at);
      }
    }
    displayTicketInfo(latestTicket);
  });
}


/** displays all tickets where title contains query as a substring */
function displaySearchTicket(query) {
  getAllTickets((result) => {
    var numPrinted = 0;
    for (ticket of result) {
      if (ticket.subject.indexOf(query) !== -1) {
        displayTicketInfo(ticket);
        console.log('');
        numPrinted++;
      }
    }
    if (numPrinted === 0) {
      console.log('No tickets found');
    }
  });
}


/** helper function */
function getAllTickets(callback) {
  zendesk.tickets.list().then(function(result) {
    console.log(H_RULE);
    if (result){
      callback(result);
    } else {
      console.log('No tickets found');
    }
    console.log(H_RULE);
    prompt();
  }, function(reason) {
    displayRejectionReason(reason);
    prompt();
  });
}


/** display something if request rejected */
function displayRejectionReason(reason) {
  console.log("Rejected due to", reason.message);
  if (reason.message.startsWith("Invalid URI")) {
    console.log("Might need to change url");
  }
}


/** Create a new ticket with subject and description */
function createTicket(subject, description) {
  var options = {
    subject,
    description
  };
  zendesk.tickets.create(options).then(function(result){
    // result == true
    if (result) {
      console.log('It worked');
    }
    prompt();
  });
}


/** given a JSON object for a single ticket, display info */
function displayTicketInfo(ticket) {
  if (!ticket) {
    console.warn('Ticket not found');
    return;
  }
  console.log('Ticket #' + ticket.id);
  console.log('    Subject: ' + ticket.subject);
  console.log('Description: ' + ticket.description);
  console.log(' Updated at: ' + ticket.updated_at);
}
