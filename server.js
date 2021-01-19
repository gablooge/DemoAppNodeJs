var express = require('express');
var app = express();

var messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'Hello'}
]

app.get('/messages', (req, res) => {
    res.send(messages);
});

app.use(express.static(__dirname));
var server = app.listen(3000, () => {
    console.log('server is listening on port 3000', server.address().port)
});