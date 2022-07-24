import { CommandInteraction, MessageEmbed } from "discord.js";
import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

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
    ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const commands = client.slashCommands;
        const categories = client.getLocale(interaction, "commands.info.help.categories");
        let category = interaction.options.getString("category")
        if (category) {
            category = category.charAt(0).toUpperCase() + category?.slice(1)
            if (!categories.includes(category)) {
                return interaction.reply(client.getLocale(interaction, "commands.info.help.noCategory"));
            }
            const commandsInCategory: SlashCommand[] = []
            commands.forEach((command: SlashCommand) => {
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
                return interaction.reply(client.getLocale(interaction, "commands.info.help.noCommand"))
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
            commands.forEach((command: SlashCommand) => {
                if (command.category == categories[category]) {
                    value++
                }
            });
            if (category === categories[6]) continue
            a.push({ name: categories[category], value: client.getLocale(interaction, "commands.info.help.commandsInCategory", value) })
        }
        const messageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(client.getLocale(interaction, "commands.info.help.embedTitle"))
            .setDescription(client.getLocale(interaction, "commands.info.help.embedDesc"))
            .addFields(...a)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        interaction.reply({ embeds: [messageEmbed] })
    }
} as SlashCommand;