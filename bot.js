// this is where we spawn the grammar nazi bot
const Discord = require('discord.js')
const client = new Discord.Client()
// mix-in our then-than check tool
const lt = require('./modules/language-tool')

client.on('ready', () => {
  console.log('I am ready!');
})

client.on('message', (message) => {
  // just skip reading any bot messages
  if (message.author.bot) {
    return
  }
  const parts = message.content.split(/\W/)
  if (parts.includes('then') || parts.includes('than')) {
    // react only when message contains `then` or `than`
    const msg = message.content.replace(/\W+/ig, ' ')
    lt.check(msg).then((matches) => {
      // react only when there is suggestion matches
      if (matches.length > 0) {
        // carve out the core suggestions
        // unlike the express server version
        // we probably only care about the first suggestion match
        const match = matches[0] || {}
        let r = {
          analysis: match.message,
          suggestion: ((match.replacements || [])[0] || {}).value
        }
        console.dir(r)
        // respond in the discord server, like a real bot would do
        // TODO: format in a human readable way
        message.reply(`Did you mean \`${r.suggestion}\`? ${r.analysis}`)
      }
      // this is a bot, we don't have to always respond
      // return res.json(r)
    }).catch(console.error)
  }
})

// NOTE: just by running node bot.js will not load the env vars from
// .env file properly. Use `npm run bot` command which handles it for you
client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log('Connected!')
}).catch(console.error)

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
  process.exit(1)
})
