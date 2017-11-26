var Zendesk = require('zendesk-node-api');
var config = require('./config.json');
const readline = require('readline');

var zendesk = new Zendesk(config);
const H_RULE = '---------------------------------------------------------';

var rl = readline.createInterface(process.stdin, process.stdout);

displayIntro();
prompt();

/** get the user's next command */
function prompt() {
  rl.question('> ', function(line) {
    var input = line.trim().split(/\s+/);
    switch(input[0]) {
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
      default:
        // user input didn't match anything
        console.log("1 or 2");
        prompt();
        break;
    }
  });
}

rl.on('close', function() {
  console.log('Complete.');
  process.exit(0);
});


// ======= Functions for the interactive command line application =======
/** displays instructions */
function displayIntro() {
  console.log(H_RULE);
  console.log("Welcome to the Zendesk Ticket Viewer\n");
  console.log("Please enter one of the following options:");
  console.log("    1.  Display a single ticket");
  console.log("    2.  Display all tickets");
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
  zendesk.tickets.list().then(function(result) {
    console.log(H_RULE);
    if (result){
      for (ticket of result){
        displayTicketInfo(ticket);
        console.log('');
      }
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
