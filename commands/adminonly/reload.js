const fs = require('fs');
const { admins } = require('../../config.json');
module.exports = {
  name: 'reload',
  description: 'Reloads a command',
  args: true,
  category: "Bot Admin Only",
  async execute(message, args) {
    if (!admins.includes(message.author.id)) return;
    //variables
    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName)
      || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    const commandFolders = fs.readdirSync('./commands');

    //conditions
    if (!command) {
      return message.reply(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
    }
    const folderName = commandFolders.find(folder =>
      fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));
    delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

    try {
      const newCommand = require(`../${folderName}/${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.reply(`Command \`${newCommand.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      message.reply(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }
  },
};