# zendesk-ticket-viewer
An interactive command line application that connects to the [Zendesk](https://www.zendesk.com) API and displays ticket information from a Zendesk account.

## Installation instructions
1. Clone this repository.
2. Run `npm install`.
3. Create a file `config.json` in the top-level directory. (Same directory as this readme) Fill it with the following:
```
{
  "url": "your Zendesk url",
  "email": "your email",
  "token": "your API token"
}
```
replacing each "your..." with your relevant value (inside quotes).
    
## Usage
Run with `node index.js`.

Input 1 followed by ticket id to display information about one ticket.

Input 2 to display information about all tickets.

Stop the app by ending input (e.g. with `^C`).

### Example
```
$ node index.js
---------------------------------------------------------
Welcome to the Zendesk Ticket Viewer

Please enter one of the following options:
    1.  Display a single ticket
    2.  Display all tickets
---------------------------------------------------------
> 1 6
Searching for ticket with id 6...
---------------------------------------------------------
Ticket #6
    Subject: Why isn't it working?
Description: We're working on that.
 Updated at: 2017-11-18T11:23:56Z
---------------------------------------------------------
> 
```
