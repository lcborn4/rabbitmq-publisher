#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
const express = require('express')
const app = express()

const port = process.env.PORT || 8000;

let MSG_INTERVAL = process.env.MESSAGE_INTERVAL ? process.env.MESSAGE_INTERVAL : 10000

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
    var exchange = "topic_logs";
    var args = process.argv.slice(2);
    var key = args.length > 0 ? args[0] : "test_rabbit";
    var msg = message.toString();

    channel.assertExchange(exchange, "topic", {
      durable: false
    });

    const intervalObj = setInterval(() => {
      console.log("Sending message");
      console.log(message);
      channel.publish(exchange, key, Buffer.from(msg));
      console.log(" [x] Sent %s:'%s'", key, msg);
    }, MSG_INTERVAL);
  });
});

app.get('/', (req, res) => res.send(message))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
