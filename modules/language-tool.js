// wrapper for LanguageTool service
const axios = require('axios')
const qs = require('querystring')
// TODO: use env var to configure
// for possible self-hosted LanguageTool Java Server
const API_HOST = 'https://languagetool.org'

// sample curl
/* curl -X POST \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Accept: application/json' \
-d 'text=i\u0027m%20better%20then%20you&language=en&enabledRules=CONFUSION_RULE&enabledOnly=true' \
'https://languagetool.org/api/v2/check'
*/

const check = (message) => {
  const payload = {
    text: message,
    language: 'en',
    enabledRules: 'CONFUSION_RULE',
    enabledOnly: true
  }
  return axios.post(
    `${API_HOST}/api/v2/check`,
    qs.stringify(payload)
  ).then((res) => {
    return (res.data || {}).matches || []
  })
}

module.exports = {
  check
}