module.exports = {
    name: "typingindicator",
    description: "Make the bot type",
    category: "Info",
    execute(message, args) {
        message.replyTyping();
    }
}