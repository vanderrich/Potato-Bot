const categories = ["Currency", "Fun", "Info", "Moderation", "Music", "Bot Admin Only"]
const { SlashCommandBuilder } = require("@discordjs/builders");
const { prefix } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("All commands")
        .addStringOption(option =>
            option
                .setName("category")
                .setDescription("The category to get help for.")
                .addChoices(
                    { name: "Currency", value: "Currency" },
                    { name: "Fun", value: "Fun" },
                    { name: "Info", value: "Info" },
                    { name: "Moderation", value: "Moderation" },
                    { name: "Music", value: "Music" },
                    { name: "Bot Admin Only", value: "Bot Admin Only" },
                )
        )
        .addStringOption(option =>
            option
                .setName("command")
                .setDescription("The command to get help for.")
        ),
    category: "Info",
    execute(interaction, client, Discord, footers) {
        const commands = client.slashCommands;
        if (interaction.options.getString("category")) {
            let category = interaction.options.getString("category")
            category = category.charAt(0).toUpperCase() + category.slice(1)
            if (!categories.includes(category)) {
                return interaction.reply("No category with that name")
            }
            commandsInCategory = []
            commands.forEach(command => {
                if (command.category == category && command.data) {
                    commandsInCategory.push(command)
                }
            })
            const messageEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(category)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
            for (command in commandsInCategory) {
                command = commandsInCategory[command]
                description = command.data.description
                messageEmbed.addField(command.data.name, description)
            }
            return interaction.reply({ embeds: [messageEmbed] })
        }
        else if (interaction.options.getString("command")) {
            let command = interaction.options.getString("command")
            let commandObject = commands.get(command)
            if (!commandObject) {
                return interaction.reply("No command with that name")
            }
            const messageEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(commandObject.data.name)
                .setDescription(commandObject.data.description)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
            if (commandObject.data.options) {
                for (option in commandObject.data.options) {
                    option = commandObject.data.options[option]
                    messageEmbed.addField(option.name, option.description)
                }
            }
            return interaction.reply({ embeds: [messageEmbed] })
        }
        let a = []
        for (let category in categories) {
            let value = 0
            commands.forEach(command => {
                if (command.category == categories[category]) {
                    value++
                }
            });
            if (categories[category] == "Work in Progress" || categories[category] == "Bot Admin Only") continue
            a.push({ name: categories[category], value: `${value} commands in that category` })
        }
        const messageEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Commands')
            .setDescription(`Write ${prefix}help <category> to see the commands in the category`)
            .addFields(...a)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
        interaction.reply({ embeds: [messageEmbed] })
    }
}