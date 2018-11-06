'use strict'
const color = require('color')
const mqtt = require('mqtt')

module.exports.hello = function (context) {
  if(!context.req.query.color) {
    context.res = {
      status: 400,
      body: 'Requires URL parameter `color`!'
    }
    context.done()
  } else {
    let sentColor
    try {
      sentColor = color(context.req.query.color)
    } catch(err) {
      context.res = {
        status: 400,
          body: 'Invalid color!'
        }
      context.done()
    }

    if(sentColor) {
      let client = mqtt.connect('mqtt://io.adafruit.com', {
        port: 1883,
        username: 'nodebotanist',
        password: 'hahanicetry'
      })

      client.on('connect', () => {
        client.subscribe('nodebotanist/feeds/colorbot', () => {
        client.publish('nodebotanist/feeds/colorbot', sentColor.red() + ',' + sentColor.green() + ',' + sentColor.blue())
      })

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: context.req.query,
      }
      context.done()
    })  

    client.on('error', (err) => {
      context.res = {
        status: 400,
          body: 'AdafruitIO Error!'
        }
      context.done()
    })

    } else {
      context.res = {
        status: 400,
          body: 'Invalid color!'
        }
      context.done()
    }
  }
}
