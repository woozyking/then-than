# then-than

A simple project to detect incorrect use of `then` and `than` in english (the language).

This entire project was created during live-streaming, quite an experience despite that the viewership has never gone higher than a single digit on either of the platforms (Twitch.tv and Douyu.tv). `¯\_(ツ)_/¯`

## Features

- `then` and `than` incorrect usage detection (not 100%) by leveraging [LanguageTool](https://languagetool.org)
- An express.js based API server that handles the tunneled check
- A Discord bot that listens and auto-harasses the user who sends the incorrect messages

## Usage

To launch the API server, do `npm start`.

To launch the bot, create a file `.env` which contains environment variable `DISCORD_TOKEN` (your bot app token), and do `npm run bot`.
