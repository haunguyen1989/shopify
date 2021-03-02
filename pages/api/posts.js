// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const posts = [
    {
        id: 1,
        name: 'Nextjs is awesome'
    },
    {
        id: 2,
        name: 'Using TypeScript with Nextjs'
    },
    {
        id: 3,
        name: 'GraphQL Vs REST'
    },
    {
        id: 4,
        name: 'Bridging in React Native'
    }
];

export default (req, res) => {
    var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');
    
    var filePath = path.join(__dirname, '/script.js');
    var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'application/javascript',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
}
