#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
const express = require('express')
const app = express()

const port = process.env.PORT || 8000;

let MSG_INTERVAL = process.env.MESSAGE_INTERVAL ? process.env.MESSAGE_INTERVAL : 60000

let URL = process.env.CLOUDAMQP_URL ? process.env.CLOUDAMQP_URL : "amqp://localhost"

const message = require('./message');

amqp.connect(URL, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "topic_logs";
    var msg = JSON.stringify(message);

    const intervalObj = setInterval(() => {
      console.log("Sending message");
      console.log(message);
          channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
   console.log(" [x] Sent '%s'", msg);
    }, MSG_INTERVAL);
  });
});

app.get('/', (req, res) => res.send(message))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
