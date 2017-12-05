# zendesk-ticket-viewer
An interactive command line application that connects to the [Zendesk](https://www.zendesk.com) API and displays ticket information from a Zendesk account.

## Installation instructions
1. Clone this repository.
2. cd into the root directory of this repo.
3. Run `npm install`. (You need [Node.js](https://nodejs.org/), which includes npm, to do this and to run the app)

    
## Usage
Run with `node index.js` or with `npm start`.

Input **0** to edit your API details.
```
    url: <your Zendesk url>
  email: <your email>
  token: <your API token>
```
These values are saved in a file, so you don't need to reenter them every time you run the app.

Input **1** followed by ticket id to display information about one ticket.

Input **2** to display information about all tickets.


Stop the app by ending input (e.g. with `^C`).

### Example
```
$ node index.js
---------------------------------------------------------
Welcome to the Zendesk Ticket Viewer

Please enter one of the following commands:
    0     Edit the config
    1     Display a single ticket
    2     Display all tickets
    3     Display last created ticket
    4     Display tickets where subject contains query
    5     Create a new ticket with subject and description
    help  Display this message
---------------------------------------------------------
> 1 6
Searching for ticket with id 6...
---------------------------------------------------------
Ticket #6
    Subject: Why isn't it working?
Description: We're working on that.
 Updated at: 2017-11-23T04:51:50Z
---------------------------------------------------------
> 
```
