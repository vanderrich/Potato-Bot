import { CommandInteraction, MessageEmbed } from "discord.js";
import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";

const categories = ["Currency", "Fun", "Info", "Moderation", "Music", "Bot Admin Only"]
type command = {
    data: SlashCommandBuilder,
    contextMenu: ContextMenuCommandBuilder,
    category: string,
    execute: (interaction: CommandInteraction, client: any, Discord: any, footers: Array<string>) => Promise<void> | void,
}
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
                    { name: "Music", value: "Music" }
                )
        )
        .addStringOption(option =>
            option
                .setName("command")
                .setDescription("The command to get help for.")
        ),
    category: "Info",
    execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const commands = client.slashCommands;
        let category = interaction.options.getString("category")
        if (category) {
            category = category.charAt(0).toUpperCase() + category?.slice(1)
            if (!categories.includes(category)) {
                return interaction.reply("No category with that name")
            }
            const commandsInCategory: command[] = []
            commands.forEach((command: command) => {
                if (command.category == category && command.data) {
                    commandsInCategory.push(command)
                }
            })
            const messageEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(category)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            for (const commandIndex in commandsInCategory) {
                const command = commandsInCategory[commandIndex]
                const description = command.data.description
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
            const messageEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(commandObject.data.name)
                .setDescription(commandObject.data.description)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            if (commandObject.data.options) {
                for (const optionIndex in commandObject.data.options) {
                    const option = commandObject.data.options[optionIndex]
                    messageEmbed.addField(option.name, option.description)
                }
            }
            return interaction.reply({ embeds: [messageEmbed] })
        }
        let a = []
        for (let category in categories) {
            let value = 0
            commands.forEach((command: command) => {
                if (command.category == categories[category]) {
                    value++
                }
            });
            if (categories[category] == "Work in Progress" || categories[category] == "Bot Admin Only") continue
            a.push({ name: categories[category], value: `${value} commands in that category` })
        }
        const messageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Commands')
            .setDescription(`Do /help and assign the parameters to get help for a specific command or category.\n\nFor example: \`/help category:Currency\``)
            .addFields(...a)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        interaction.reply({ embeds: [messageEmbed] })
    }
}