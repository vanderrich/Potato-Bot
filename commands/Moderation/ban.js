const Discord = require("discord.js")
module.exports = {
    name: 'ban',
    description: "This command bans a member!",
    permissions: 'BAN_MEMBERS',
    execute(message, args){
      //variables
      const user = message.mentions.users.first();
      var reason = args.shift()

      //conditions
      if (args.length == 1){
        reason = "No Reason Given"
      }
      if (!user) {
        message.channel.send("You didn't mention the user to ban!");
      }

      //ban
      user
        .ban({reason: reason,})
        .then(() => {
          message.channel.send(`Successfully banned ${user.tag}`);
        })
        .catch(err => {
          message.channel.send('I was unable to ban the member');
          console.error(err);
        });
    }
}