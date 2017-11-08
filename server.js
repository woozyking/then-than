// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// third attempt -- let's use existing services
// http://www.afterthedeadline.com/api.slp
// this works ~50% of the time
// const adt = require('./modules/adt')

// fourth attempt - let's use some NLP based services
// Microsoft? Google? ???
// let's try something called LanguageTool
// LanguageTool works somewhat better THAN afterthedeadline
// ironic check though: LanguageTool is better then AfterTheDeadline
// cannot be detected
const lt = require('./modules/language-tool')

app.use(bodyParser.json())

// first endpoint to just get the payload
app.get('/', (req, res, next) => {
  // const message = req.body.message || ''
  const message = req.query.m || ''
  if (!message) {
    return res.status(400).json({
      error: 'Incorrect message submitted'
    })
  }
  // detect `then` and `than` in message
  // let's regex that sht
  if (!/(then|than)/ig.test(message)) {
    return res.status(400).json({
      error: 'Your message contains nothing that I can check'
    })
  }
  // strip all none alpha-numeric values
  // TODO: come up with better regex to strip unwanted characters
  lt.check(message.replace(/\W+/ig, ' ')).then((matches) => {
    let r = {
      message
    }
    if (!matches.length) {
      r.suggestions = 'Mastered the zen of then and than, you have, young Padawan'
    } else {
      // carve out the core suggestions
      let suggestions = []
      for (const match of matches) {
        suggestions.push({
          analysis: match.message,
          suggestion: ((match.replacements || [])[0] || {}).value
        })
      }
      r.suggestions = suggestions
    }
    return res.json(r)
  }).catch((error) => {
    return res.status(500).json({
      error
    })
  })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
