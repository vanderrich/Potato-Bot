module.exports = {
    name: 'unban',
    description: "This command unbans a member!",
    permissions: "BAN_MEMBERS",
    execute(message, args){
      //do i need to comment this code?
      try{
        const id = args[0];
        message.guild.members.unban(id);
      }
      catch(err){
        message.reply(err)
      }
    }
}