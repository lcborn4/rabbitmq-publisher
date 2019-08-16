#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

let MSG_INTERVAL = process.env.INTERVAL ? process.env.INTERVAL : 10000

amqp.connect("amqp://localhost", function(error0, connection) {
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
    var msg = args.slice(1).join(" ") || "Hello World!";

    channel.assertExchange(exchange, "topic", {
      durable: false
    });

    const intervalObj = setInterval(() => {
      channel.publish(exchange, key, Buffer.from(msg));
      console.log(" [x] Sent %s:'%s'", key, msg);
    }, MSG_INTERVAL);
  });
});
