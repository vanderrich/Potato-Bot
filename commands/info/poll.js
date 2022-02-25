const {poll} = require('discord.js-poll');
module.exports =  {
    name: 'poll',
    description: 'poll',
    usage: 'Title + Option 1 + Option 2 + Option 3 + etc',
    category: "Info",
    execute(msg, args) {
        poll(msg, args, '+', '#00D1CD')
        msg.delete()
    }
} 