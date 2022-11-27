import { Guild } from "discord.js";
import error from "./error";
import { Client } from "./types";

export const updateStats = async (guild: Guild, client: Client) => {
    console.log(`Updating stats for ${guild.name}`);
    const guildSetting = await client.guildSettings.findOne({ guildId: guild.id });
    if (!guildSetting) return console.warn("no guild setting found");

    for (const i in guildSetting.statChannels) {
        const stat = guildSetting.statChannels[i];
        const statChannel = await guild.channels.fetch(stat.channel);
        if (!statChannel) return console.warn("no stat channel found");
        try {
            switch (stat.type) {
                case "all members":
                    statChannel.setName("All Members: " + guild.memberCount)
                    break;
                case "bots":
                    await guild.members.fetch();
                    statChannel.setName("Bots: " + guild.members.cache.filter(member => member.user.bot).size)
                    break;
                case "members":
                    await guild.members.fetch();
                    statChannel.setName("Members: " + guild.members.cache.filter(member => !member.user.bot).size)
                    break;
                case "boosts":
                    statChannel.setName("Boosts: " + guild.premiumSubscriptionCount)
                    break;
                case "role members":
                    if (!stat.role) return;
                    const role = await guild.roles.fetch(stat.role);
                    if (!role) return;
                    statChannel.setName(`${role.name}: ${role.members.size}`)
                default:
                    break;
            }
        } catch {
            error(new Error(`Can't update stats for ${guild} cuz no perms`), client)
        }
        console.log(`Updated ${statChannel.name}`);
    }
}