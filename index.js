const fs = require('fs') // file system is a core module that comes with node.js
const http = require('http') // another core module
const url = require('url') // another core module used for routing

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); // we must provide the absolute path of the target file as well as the encoding of the file
// console.log(__dirname); // absolute path of the current directory

const laptopData = JSON.parse(json)
// console.log(laptopData);

const server = http.createServer((request, response) => {
    // the callback function provided will fire each time someone accesses our web server
    // console.log('Someone accessed the server!');

    // console.log(request.url);
    const pathName = url.parse(request.url, true).pathname; //capture the partial url (after localhost) in the browser window
    console.log(pathName);
    const query = url.parse(request.url, true).query; // get the query object from the url. Object property names and values are separated by '&' in the url, e.g. id=4&name=apple&year=2021

    // Basic Routing - Use framework like Express to handle complex routing and other stuff
    if(pathName === '/products' || pathName === '/') {
        // Set an HTTP header
        response.writeHead(200, {'Content-type': 'text/html'})
        // Set a response
        response.end('This is the Products Page!')
    } else if (pathName === '/laptop' && query.id < laptopData.length){
        // Set an HTTP header
        response.writeHead(200, {'Content-type': 'text/html'})

        // Set a response
        response.end(`This is the Laptop Page for laptop ${query.id}!`)
    } else {
        // Set an HTTP header
        response.writeHead(404, {'Content-type': 'text/html'})

        // Set a response
        response.end('Url was not found on the server!')
    }

    
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
}) // always keep listening to a certain port on a certain IP address (127.0.0.1 is the IP address for localhost)