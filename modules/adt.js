// a simple wrapper to call after the deadline APIs
// and transform XML (who uses that nowadays?) to JSON
// NOTE: use language-tool.js as its check is slightly better
const axios = require('axios')
const qs = require('querystring')
const parseString = require('xml2js').parseString
const BASE_URI = 'http://service.afterthedeadline.com'

// make xml2js.parseString a promise
const parse = (xml) => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })
}

const check = (data) => {
  // TODO: find a good HTTP client to handle
  // API calls
  const payload = {
    key: 'testing123_then-than_woozyking',
    data
  }
  console.log(`message being checked: ${data}`)
  return axios.post(`${BASE_URI}/checkGrammar`, qs.stringify(payload)).then((response) => {
    const xml = response.data
    return parse(xml)
  }).then((res) => {
    const errors = (res.results || {}).error || []
    let suggestions = []
    for (const e of errors) {
      // we only care about the following conditions
      // 1) e.type contains 'grammar'
      // 2) e.string contains 'then' or 'than'
      const s = e.string.join('|')
      if (e.type.includes('grammar') && (s.includes('then') || s.includes('than'))) {
        suggestions = suggestions.concat(e.suggestions)
      }
    }
    return suggestions
  })
}

module.exports = {
  check
}