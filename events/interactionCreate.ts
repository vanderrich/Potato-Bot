import { tags, footers, admins } from './../config.json'
import Discord from 'discord.js'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
type AutocompleteThingy = {
    name: string,
    value: string,
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Discord.Interaction, client: any) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            if (command.guildOnly && (!interaction.guild)) return interaction.reply({ content: "You can't use this command in DM!", ephemeral: true });
            if (command.permissions) {
                if ((command.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(command.permissions)) return interaction.reply({ content: "You don't have permission to use this command!", ephemeral: true });
                if ((command.permissions == "BotAdmin" && !interaction.guild!.me!.permissions.has("ADMINISTRATOR")) || (interaction.guild!.me!.permissions.has(command.permissions))) return interaction.reply({ content: "I dont have the permissions to use this command!", ephemeral: true });
            }

            try {
                client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `${interaction.user} did the ${interaction.isCommand() ? "slash command" : "context menu command"} ${interaction.guild ? `in the guild ${interaction.guild.name}` : `in a dm`} ${command.data.name} ${interaction.isCommand() && interaction.options.data.length != 0 ? `with the options${interaction.options.data.map(option => ` \`${option.name}: ${option.value}\``)}` : ""}`, allowedMentions: { "users": [] } }); // log the command
                await command.execute(interaction, client, footers);
            } catch (error: Discord.DiscordAPIError | any | Error) {
                console.error(error);
                const id = uuidv4();
                await client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `<@709950767670493275> [Error ${id}](https://potato-bot.netlify.app/status/${id})!` }); // log the error to the bot logs channel
                await axios.post('https://potato-bot-api.herokuapp.com/error', {
                    name: command.data.name,
                    id,
                    type: interaction.isCommand() ? "Slash Command" : "Context Menu Command",
                    error: error.toString(),
                    stack: error.stack,
                    code: error.code,
                    path: error.path,
                    httpStatus: error.httpStatus,
                    requestData: error.requestData?.json,
                });
                try {
                    await interaction.reply({ content: 'There was an error while executing this command!\n' + error + "\n\nSuccessfully DMed the owner about the error, very sorry about this issue", ephemeral: true });
                }
                catch (err) {
                    await interaction.editReply({ content: 'There was an error while executing this command!\n' + error + "\n\nSuccessfully DMed the owner about the error, very sorry about this issue" });
                }
            }
        }
        else if (interaction.isButton()) {
            client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `${interaction.user} clicked on a button with the custom id of ${interaction.customId} on the message with the content ${interaction.message.content} and the following embeds:`, embeds: interaction.message.embeds, allowedMentions: { users: [] } }); // log the command

            const button = client.buttons.get(interaction.customId.split("-")[0]);

            if (button) {
                if (button?.permissions) {
                    if ((button.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(button.permissions)) return interaction.reply("You don't have permission to use this command!");
                }

                try {
                    button?.execute(interaction, client, footers);
                } catch (error: Discord.DiscordAPIError | any | Error) {
                    console.error(error);
                    const id = uuidv4()
                    await client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `<@709950767670493275> [Error ${id}](https://potato-bot.netlify.app/status/${id})!` }); // log the error to the bot logs channel
                    await axios.post('https://potato-bot-api.herokuapp.com/error', {
                        name: button.customId,
                        id,
                        type: "Button",
                        error: error.toString(),
                        stack: error.stack,
                        code: error.code,
                        path: error.path,
                        httpStatus: error.httpStatus,
                        requestData: error.requestData?.json,
                    });
                    try {
                        await interaction.reply({ content: 'There was an error while executing this command!\n' + error, ephemeral: true });
                    }
                    catch (err) {
                        await interaction.editReply({ content: 'There was an error while executing this command!\n' + error });
                    }
                }
                return
            }
        }
        else if (interaction.isAutocomplete()) {
            switch (interaction.commandName) {
                case 'tag':
                    const guildTags = client.cachedTags.get(interaction.guildId)?.filter((tag: AutocompleteThingy) => tag.name.toLowerCase().includes(interaction.options.getString("tag") ?? ""))
                    const globalTags = tags.filter((tag: AutocompleteThingy) => tag.name.toLowerCase().includes(interaction.options.getString("tag") ?? ""));
                    const respondTags = [...globalTags];
                    if (guildTags) {
                        respondTags.push(...guildTags);
                    }
                    await interaction.respond(respondTags);
                    break;
                case 'sell':
                    const inventory = client.cachedInventories.get(interaction.user.id)?.filter((item: AutocompleteThingy) => item.name.toLowerCase().includes(`${interaction.options.getNumber("item")}` ?? ""))
                    await interaction.respond(inventory);
                    break;
                case 'buy':
                    const guildItems = client.cachedShopItems.get(interaction.guildId)?.filter((buy: AutocompleteThingy) => buy.name.toLowerCase().includes(interaction.options.getString("item") ?? ""))
                    const globalItems = client.globalShopItems.filter((buy: AutocompleteThingy) => buy.name.toLowerCase().includes(interaction.options.getString("item") ?? ""));
                    const respondItems = [...globalItems];
                    if (guildItems) {
                        respondItems.push(...guildItems);
                    }
                    await interaction.respond(respondItems);
                    break;
            }
        } else if (interaction.isSelectMenu()) {
            client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `${interaction.user} interaction with a select menu with the custom id of ${interaction.customId} and set the values to ${interaction.values.join(", ")} on the message with the content ${interaction.message.content} and the following embeds:`, embeds: interaction.message.embeds, allowedMentions: { users: [] } }); // log the command

            const selectMenu = client.selectMenus.get(interaction.customId.split("-")[0]);

            if (selectMenu) {
                if (selectMenu?.permissions) {
                    if ((selectMenu.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(selectMenu.permissions)) return interaction.reply("You don't have permission to use this command!");
                }

                try {
                    selectMenu?.execute(interaction, client, footers);
                } catch (error: Discord.DiscordAPIError | any | Error) {
                    console.error(error);
                    const id = uuidv4()
                    await client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `<@709950767670493275> [Error ${id}](https://potato-bot.netlify.app/status/${id})!` }); // log the error to the bot logs channel
                    await axios.post('https://potato-bot-api.herokuapp.com/error', {
                        name: selectMenu.data.name,
                        id,
                        type: "Select Menu",
                        error: error.toString(),
                        stack: error.stack,
                        code: error.code,
                        path: error.path,
                        httpStatus: error.httpStatus,
                        requestData: error.requestData?.json,
                    }, { headers: { Authorization: process.env.SUPER_SECRET_KEY! } }).catch(err => console.error(err)).then((res) => {
                        console.log(res!.data);
                    });
                    try {
                        await interaction.reply({ content: 'There was an error while executing this command!\n' + error, ephemeral: true });
                    }
                    catch (err) {
                        await interaction.editReply({ content: 'There was an error while executing this command!\n' + error });
                    }
                }
                return
            }

        }
    }
}