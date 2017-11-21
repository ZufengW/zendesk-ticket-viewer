var Zendesk = require('zendesk-node-api');
var config = require('./config.json');

var zendesk = new Zendesk(config);
const H_RULE = '---------------------------------------------------------';


displayAllTickets();

/** displays all the tickets of zendesk **/
function displayAllTickets() {
  zendesk.tickets.list().then(function(result) {
    console.log(H_RULE);
    for (ticket of result){
      displayTicketInfo(ticket);
      console.log('');
    }
    console.log(H_RULE);
  });
}


/** given a JSON object for a single ticket, display info **/
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
