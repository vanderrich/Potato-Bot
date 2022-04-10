module.exports = {
  name: "settings",
  category: "Info",
  execute(message, args, cmd, client) {
    let settings = client.settings[message.guild.id]
    if (!settings) {
      settings = client.settings.default
    }
    if (!args) {
      return message.reply("you didn't give any arguments!")
    }
    if (!settings[args[0]]) {
      return message.reply("that setting doesn't exist!")
    }
    if (!args[1]) {
      return message.reply("no value given")
    }
    if (typeof (settings[args[0]]) == "boolean" && !!args[1]) {
      settings[args[0]] = !!args[1]
    }
    else if (typeof (settings[args[0]]) == "string") {
      settings[args[0]] = args[1]
    }
    else if (typeof (settings[args[0]]) == "object") {
      if (args[2] == "push")
        settings[args[0]].push(args[1])
      else if (args[2] == "slice")
        settings[args[0]].slice(args[1], 1)
    }
    else {
      return message.reply("value doesn't match")
    }
    message.reply(`changed the value of ${args[0]} to ${settings[args[0]]}`)
  }
}