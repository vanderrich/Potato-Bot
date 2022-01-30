module.exports = {
  name: "settings",
  execute(message, args, cmd, client){
    var gameSettings = client.settings
    console.log(gameSettings)
    if (!args){
      return message.channel.send("you didn't give any arguments!")
    }
    if (!gameSettings[args[0]]){
      return message.channel.send("that setting doesn't exist!")
    }
    if(!args[1]){
      return message.channel.send("no value given")
    }
    if(typeof(gameSettings[args[0]] == "boolean") && !!args[1]){
      gameSettings[args[0]] = !!args[1]
      console.log(gameSettings[args[0]])
    }
    else if(typeof(gameSettings[args[0]]) == "string"){ 
      gameSettings[args[0]] = args[1]
    }
    else{
      return message.channel.send("value doesn't match")
    }
    message.channel.send(`changed the value of ${args[0]} to ${gameSettings[args[0]]}`)
  }
}