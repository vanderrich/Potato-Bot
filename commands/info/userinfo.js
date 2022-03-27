module.exports = {
    name: 'userinfo',
    category: "Info",
    execute(message, args, cmd, client, Discord) {

        const userMention = message.mentions.users.first() || message.author;

        let userinfo = {};
        userinfo.bot = userMention.bot;
        userinfo.createdate = userMention.createdAt;
        userinfo.discrim = userMention.discriminator;
        userinfo.id = userMention.id;
        userinfo.tag = userMention.tag;
        userinfo.uname = userMention.username;

        userinfo.avatar = userMention.avatarURL();
        console.log(userinfo)

        var myInfo = new Discord.MessageEmbed()
            .setAuthor(userinfo.uname, userinfo.avatar)
            .addField("Bot?", userinfo.bot.toString(), true)
            .addField("Created At", userinfo.createdate.toString(), true)
            .addField("Discriminator", userinfo.discrim, true)
            .addField("Client ID", userinfo.id, true)
            .addField("Client Tag", userinfo.tag, true)
            .addField("Username", userinfo.uname, true)
            .setColor('RANDOM')
            .setFooter({ text: 'insert epic footer here' })
            .setTitle("About this user...")
            .setThumbnail(userinfo.avatar)


        message.channel.send({ embeds: [myInfo] });

    },
};