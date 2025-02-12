const { createServer } = require("node:http");
const EventEmitter = require("node:events");
const fs = require("node:fs");

require("dotenv").config(); // Reads .env, parses it, adds vars to process.env, returns object with keys or error
// dotenvx exists, which is above but better w/ encryption and multi-language support
console.log(process.env.NODE_ENV); // Access env variables thru process.env

const myDateTime = require("./myDateTime.js");

const hostname = "127.0.0.1";
const port = 3000;

// Event listener
const eventEmitter = new EventEmitter();

eventEmitter.on("start", (start, end) => {
  console.log(`started from ${start} to ${end}`);
});

eventEmitter.emit("start", 23, 37);

// Writes current dateTime to currentDateTime txt file
writeToNotesFile = async () => {
  try {
    await fs.writeFileSync("./myCurrentDateTime.txt", myDateTime());
  } catch (err) {
    console.log(err);
  }
  // Async, non-promise based version (aka lame)
  // fs.writeFile("./notes.txt", content, err => {
  //   if (err) {
  //     console.error("Couldn't write to no notes file :(");
  //   } else {
  //     console.log("Notes file written to successfully");
  //   }
  // });

}

// Use --watch when running to update the server on change

// More verbose with JSON response
// Note: will only update the page on page refresh, since it doesn't return on server creation
//        Shorter version will update on change if using --watch
const server = createServer();
server.on("request", (request, response) => {
  writeToNotesFile();
  console.log(request.url);

  // Serves different html pages based on request
  if (request.url === "/index") {
    fs.readFile("./index.html", (err, data) => {
      if (err) {
        console.log(err)
        return;
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    })
  } else if (request.url === "/about") {
    fs.readFile("./about.html", (err, data) => {
      if (err) {
        console.log(err)
        return;
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    })
  }
});

// Shorter, simpler version, plain text response
// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World!?");
// });

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})