// Run 'nodemon' in the command line for auto outputs on each save. Just type nodemon in the command line interface.

const fs = require("fs"); // file system is a core module that comes with node.js
const http = require("http"); // another core module - used to setup web server
const url = require("url"); // another core module - used for routing

// STEP 1: Get RAW data
const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8"); // This is a synchronous function that runs only once when the application starts. Thus, non-blocking asynchronous function isnt required. We must provide the absolute path of the target file as well as the encoding of the file.
// console.log(__dirname); // absolute path of the current directory

// STEP 2: Format RAW data
const laptopData = JSON.parse(json);
// console.log(laptopData);

// STEP 3: Set up WEB Server and load data
const server = http.createServer((request, response) => {
  // this callback function provided will fire each time someone accesses our web server

  // console.log(request.url);
  const pathName = url.parse(request.url, true).pathname; //capture the partial url (i.e. path after 'localhost:port') in the browser window
  //   console.log(pathName);
  const query = url.parse(request.url, true).query; // capture the query object from the url. Object property names and values are separated by '&' in the url, e.g. id=4&name=apple&year=2021

  // Basic Routing - Use frameworks like Express to handle complex routing and other stuff
  if (pathName === "/products" || pathName === "/") {
    response.writeHead(200, { "Content-type": "text/html" }); // Set HTTP header
    // response.end("This is the Products Page!"); // Set response

    // PRODUCTS OVERVIEW
    // We will use an asynchronous function. Non-blocking is required here because this is executed each time users interact with the server. So when there are thousands of users, we dont want them all to get stuck if execution for some of them takes long.
    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      "utf-8",
      (err, data) => {
        let overviewOutput = data;

        // LOOP over CARD DATA
        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          "utf-8",
          (err, data) => {
            const cardsOutput = laptopData
              .map((el) => replaceTemplate(data, el))
              .join("");
            overviewOutput = overviewOutput.replace("{%CARDS%}", cardsOutput);
            // console.log(cardsOutput);
            response.end(overviewOutput); // Set response
          }
        );
      }
    );
  } else if (pathName === "/laptop" && query.id < laptopData.length) {
    response.writeHead(200, { "Content-type": "text/html" }); // Set HTTP header
    // response.end(`This is the Laptop Page for laptop ${query.id}!`); // Set response

    // LAPTOP DETAIL
    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      "utf-8",
      (err, data) => {
        const output = replaceTemplate(data, laptopData[query.id]);
        // console.log(output);
        response.end(output); // Set response
      }
    );
  } else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    // Images and other files also need to be ROUTED manually
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      response.writeHead(200, { "Content-type": "image/jpg" }); // Set HTTP header
      response.end(data);
    });
  } else {
    // Url NOT FOUND (for all other paths not included in the IF statements above)
    response.writeHead(404, { "Content-type": "text/html" }); // Set HTTP header
    response.end("Url was not found on the server!"); // Set response
  }
});

// STEP 4: Listen to the WEB Server
server.listen(1337, "127.0.0.1", () => {
  console.log("Listening for requests now");
}); // continuously listen to a certain port on a certain IP address (127.0.0.1 is the IP address for localhost)

// Create a function to avoid redundancies in the code above
function replaceTemplate(originalHtml, laptop) {
  let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}
