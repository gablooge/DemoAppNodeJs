var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb+srv://user:usbw@node0.szb26.mongodb.net/lynda?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

var messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'Hello'}
]

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
    
});
app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save().then(() => {
        Message.findOne({message: 'badword'}, (err, cencored) => {
            if(cencored){
                console.log('cencored words found', cencored);
                Message.remove({_id: cencored.id}, (err) => {
                    console.log('removed cencored message')
                })
            }
        });
        messages.push(req.body);
        io.emit('message', req.body);
        res.sendStatus(200);
    }).catch((err) => {
        res.sendStatus(500)
        return console.error(err)
    });
    
});

io.on('connection', (socket) => {
    console.log('a user connected');
})

mongoose.connect(dbUrl, (err) => {
    console.log("mongo db connection", err);
});

var server = http.listen(3000, () => {
    console.log('server is listening on port 3000', server.address().port)
});