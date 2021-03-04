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
    /*console.log('GOI TOI DAY REQUEST FULLFULLMENT');
    console.log(req);
    res.statusCode = 200;
    res.json(posts)*/
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`$('body').append('<p style="color: black; background-color: green; font-size: 16px;">Your app is using jQuery</p>');`);
}