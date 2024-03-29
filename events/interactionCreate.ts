import { DiscordAPIError, Interaction, PermissionResolvable } from 'discord.js';
import { Utils } from '../localization';
import throwError from "../Util/error";
import { AutoCompleteValue, Client, Event } from '../Util/types';
import { admins, tags } from './../config.json';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        const loggingChannel = client.guilds.cache.get("962861680226865193")?.channels.cache.get("979662019202527272");
        if (!loggingChannel || !loggingChannel.isText()) return;
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            if (command.guildOnly && (!interaction.guild)) return interaction.reply({ content: "You can't use this command in DM!", ephemeral: true });
            if (command.permissions) {
                if ((command.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(command.permissions as PermissionResolvable)) return interaction.reply({ content: "You don't have permission to use this command!", ephemeral: true });
                if ((command.permissions == "BotAdmin" && !interaction.guild!.me!.permissions.has("ADMINISTRATOR")) || (!interaction.guild!.me!.permissions.has(command.permissions as PermissionResolvable))) return interaction.reply({ content: "I dont have the permissions to use this command!", ephemeral: true });
            }

            try {
                loggingChannel.send({ content: `${interaction.user}(${interaction.user.username}) did the ${interaction.isCommand() ? "slash command" : "context menu command"} ${interaction.guild ? `in the guild ${interaction.guild.name}` : `in a dm`} ${command.data.name} ${interaction.isCommand() && interaction.options.data.length != 0 ? `with the options${interaction.options.data.map(option => ` \`${option.name}: ${option.value}\``)}` : ""}`, allowedMentions: { "users": [] } }); // log the command
                await command.execute(interaction as any, client, client.getLocale(interaction, "utils.footers") as Utils["footers"]);
            } catch (error: DiscordAPIError | any | Error) {
                throwError(error, client)

                try {
                    await interaction.reply({ content: 'There was an error while executing this command!\n' + error + "\n\nI have informed my owner about this, while waiting, why dont you join our [Discord Server](<https://discord.gg/cHj7nErGBa>)? (yes, shameless advertising)", ephemeral: true });
                }
                catch (err) {
                    await interaction.editReply({ content: 'There was an error while executing this command!\n' + error + "\n\nI have informed my owner about this, while waiting, why dont you join our [Discord Server](<https://discord.gg/cHj7nErGBa>)? (yes, shameless advertising)" });
                }
            }
        }
        else if (interaction.isButton()) {
            loggingChannel.send({ content: `${interaction.user}(${interaction.user.username}) clicked on a button with the custom id of ${interaction.customId} on the message with the content ${interaction.message.content} and the following embeds:`, embeds: interaction.message.embeds, allowedMentions: { users: [] } }); // log the command

            const button = client.buttons.get(interaction.customId.split("-").slice(0, -1).join("-"));

            if (button) {
                if (button?.permissions) {
                    if ((button.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(button.permissions as PermissionResolvable)) return interaction.reply("You don't have permission to use this command!");
                }

                try {
                    button?.execute(interaction, client, client.getLocale(interaction, "utils.footers") as Utils["footers"]);
                } catch (error: DiscordAPIError | any | Error) {
                    throwError(error, client)
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
                    const guildTags = client.cachedTags.get(interaction.guildId!)?.filter((tag: AutoCompleteValue) => tag.name.toLowerCase().includes(interaction.options.getString("tag") ?? "")) as { name: string, value: string }[];
                    const globalTags = tags.filter((tag: AutoCompleteValue) => tag.name.toLowerCase().includes(interaction.options.getString("tag") ?? ""));
                    const respondTags = [...globalTags];
                    if (guildTags) {
                        respondTags.push(...guildTags);
                    }
                    await interaction.respond(respondTags);
                    break;
                case 'sell':
                    const inventory = client.cachedInventories.get(interaction.user.id)?.filter((item: AutoCompleteValue) => item.name.toLowerCase().includes(`${interaction.options.getNumber("item")}` ?? ""))
                    await interaction.respond(inventory!);
                    break;
                case 'buy':
                    const guildItems = client.cachedShopItems.get(interaction.guildId!)?.filter((buy: AutoCompleteValue) => buy.name.toLowerCase().includes(interaction.options.getString("item") ?? ""))
                    const globalItems = client.globalShopItems.filter((buy: AutoCompleteValue) => buy.name.toLowerCase().includes(interaction.options.getString("item") ?? ""));
                    const respondItems = [...globalItems];
                    if (guildItems) {
                        respondItems.push(...guildItems);
                    }
                    await interaction.respond(respondItems);
                    break;
            }
        } else if (interaction.isSelectMenu()) {
            loggingChannel.send({ content: `${interaction.user}(${interaction.user.username}) interaction with a select menu with the custom id of ${interaction.customId} and set the values to ${interaction.values.join(", ")} on the message with the content ${interaction.message.content} and the following embeds:`, embeds: interaction.message.embeds, allowedMentions: { users: [] } }); // log the command

            const selectMenu = client.selectMenus.get(interaction.customId.split("-")[0]);

            if (selectMenu) {
                if (selectMenu?.permissions) {
                    if ((selectMenu.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(selectMenu.permissions as PermissionResolvable)) return interaction.reply("You don't have permission to use this command!");
                }

                try {
                    selectMenu?.execute(interaction, client, client.getLocale(interaction, "utils.footers") as Utils["footers"]);
                } catch (error: DiscordAPIError | any | Error) {
                    throwError(error, client)
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
} as Event;