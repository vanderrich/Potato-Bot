"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const categories = ["Currency", "Fun", "Info", "Moderation", "Music", "Bot Admin Only"];
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("All commands")
        .addStringOption(option => option
        .setName("category")
        .setDescription("The category to get help for.")
        .addChoices({ name: "Currency", value: "Currency" }, { name: "Fun", value: "Fun" }, { name: "Info", value: "Info" }, { name: "Moderation", value: "Moderation" }, { name: "Music", value: "Music" }, { name: "Bot Admin Only", value: "Bot Admin Only" }))
        .addStringOption(option => option
        .setName("command")
        .setDescription("The command to get help for.")),
    category: "Info",
    execute(interaction, client, footers) {
        const commands = client.slashCommands;
        let category = interaction.options.getString("category");
        if (category) {
            category = category.charAt(0).toUpperCase() + (category === null || category === void 0 ? void 0 : category.slice(1));
            if (!categories.includes(category)) {
                return interaction.reply("No category with that name");
            }
            const commandsInCategory = [];
            commands.forEach((command) => {
                if (command.category == category && command.data) {
                    commandsInCategory.push(command);
                }
            });
            const messageEmbed = new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(category)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            for (const commandIndex in commandsInCategory) {
                const command = commandsInCategory[commandIndex];
                const description = command.data.description;
                messageEmbed.addField(command.data.name, description);
            }
            return interaction.reply({ embeds: [messageEmbed] });
        }
        else if (interaction.options.getString("command")) {
            let command = interaction.options.getString("command");
            let commandObject = commands.get(command);
            if (!commandObject) {
                return interaction.reply("No command with that name");
            }
            const messageEmbed = new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(commandObject.data.name)
                .setDescription(commandObject.data.description)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            if (commandObject.data.options) {
                for (const optionIndex in commandObject.data.options) {
                    const option = commandObject.data.options[optionIndex];
                    messageEmbed.addField(option.name, option.description);
                }
            }
            return interaction.reply({ embeds: [messageEmbed] });
        }
        let a = [];
        for (let category in categories) {
            let value = 0;
            commands.forEach((command) => {
                if (command.category == categories[category]) {
                    value++;
                }
            });
            if (categories[category] == "Work in Progress" || categories[category] == "Bot Admin Only")
                continue;
            a.push({ name: categories[category], value: `${value} commands in that category` });
        }
        const messageEmbed = new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Commands')
            .setDescription(`Do /help and assign the parameters to get help for a specific command or category.\n\nFor example: \`/help category:Currency\``)
            .addFields(...a)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        interaction.reply({ embeds: [messageEmbed] });
    }
};
