import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildEmoji, Message, MessageEmbed } from "discord.js";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Spin the slots!")
        .addNumberOption(option =>
            option
                .setName("bet")
                .setDescription("The amount of money you want to bet")
                .setRequired(true)
    ) as SlashCommandBuilder,
    category: "Fun",
    permissions: "USE_EXTERNAL_EMOJIS",
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const bet = interaction.options.getNumber("bet");
        if (!bet || bet < 0) return interaction.reply(client.getLocale(interaction.user.id, "commands.fun.slots.noBet"));
        const userWallet = await client.eco.balance({ user: interaction.user.id });
        if (bet > userWallet.wallet) return interaction.reply(client.getLocale(interaction.user.id, "commands.fun.slots.noMoneyBet"));
        const footer = footers[Math.floor(Math.random() * footers.length)]
        let messages: MessageEmbed[] = [];
        let win = true;
        //initializes the emojis and the embed
        const diamond = client.emojis.cache.get("981348563852329050")
        const emerald = client.emojis.cache.get("981348806450896936")
        const potat = client.emojis.cache.get("981348806450896936")
        const embed = new MessageEmbed()
            .setTitle('Slots')
            .setDescription('⬛⬛⬛')
            .setFooter({ text: footer })

        //sends the embed message and reacts to it
        interaction.reply({ embeds: [embed], fetchReply: true }).then(async (msg) => {
            if (msg instanceof Message) {
                var frameCount = Math.floor(Math.random() * 5) + 5
                for (let i = 0; i < frameCount; i++) {
                    let slotdisplay: GuildEmoji[] = []
                    for (let x = 0; x < 3; x++) {
                        switch (Math.floor(Math.random() * 3)) {
                            case 1:
                                slotdisplay[x] = diamond
                                break;
                            case 2:
                                slotdisplay[x] = potat
                                break;
                            default:
                                slotdisplay[x] = emerald
                                break;
                        }
                    }
                    messages.unshift(new MessageEmbed()
                        .setTitle(client.getLocale(interaction.user.id, "commands.fun.slots.embedTitle"))
                        .setDescription(slotdisplay.join('')))

                    //check if the player won
                    if ((slotdisplay[0].id === slotdisplay[1].id && slotdisplay[1].id === slotdisplay[2].id) && i === 0) win = true
                    else if (i === 0) win = false
                }
                //sends the frames
                for (let i = 0; i < messages.length; i++) {
                    msg.edit({
                        embeds: [messages[i].setFooter({ text: footer })]
                    })
                }

                //sends the result
                if (win) {
                    setTimeout(async function () {
                        interaction.channel?.send(client.getLocale(interaction.user.id, "commands.fun.slots.win", interaction.user, bet));
                        await client.eco.addMoney({ user: interaction.user.id, amount: bet, whereToPutMoney: "wallet" })
                    }, messages.length * 1000)
                } else {
                    setTimeout(async function () {
                        interaction.channel?.send(client.getLocale(interaction.user.id, "commands.fun.slots.lose", bet));
                        await client.eco.removeMoney({ user: interaction.user.id, amount: bet, whereToGetMoney: "wallet" })
                    }, messages.length * 1000)
                }
            }
        })
    }
} as SlashCommand;