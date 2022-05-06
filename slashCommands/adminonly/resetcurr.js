// const { admins } = require("../../config.json")
// const { SlashCommandBuilder } = require("@discordjs/builders");
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("resetcurr")
//         .setDescription("Resets the currency"),
//     permissions: "BotAdmin",
//     category: "Bot Admin Only",
//     async execute(interaction, client, Discord, footers) {
//         if (!admins.includes(interaction.user.id)) return; // return if author isn't bot owner
//         interaction.reply("Are you sure you want to reset the database? Enter `Potato Bot` to continue")
//         await interaction.channel.awaitMessages({ max: 1, time: 30_000, errors: ['time'] })
//             .then(async () => {
//                 if (m.content == 'Potato Bot') return
//                 interaction.followUp("Resetting database...")
//                 let result = await client.eco.reset();
//                 interaction.channel.send(result ? 'Reset successful' : 'Unable to reset database')
//             }).catch(() => {
//                 interaction.followUp("Reset canceled")
//             })

//     }
// }