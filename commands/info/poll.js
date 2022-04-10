module.exports = {
    name: 'poll',
    description: 'Makes a poll',
    usage: '<Title>, [Description], [Option 1], [Option 2], [Option 3]...',
    category: "Info",
    async execute(message, args, cmd, client, Discord, footers) {
        const findSep = args.find(char => char.includes(','));

        if (findSep === undefined) {

            const question = args.join(' ');
            if (!question) {
                return message.reply('Please enter a question');
            }

            message.delete();

            const embed = new Discord.MessageEmbed()
                .setTitle('📊 ' + question)
                .setColor('RANDOM')
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

            await message.reply({ embeds: [embed] }).then(msg => {
                msg.react('👍');
                msg.react('👎');
            });
        }

        else {

            message.delete();

            const embed = new Discord.MessageEmbed();
            let options = [];
            let j = 0;
            for (let i = 0; i < args.length; i++) {
                if (args[i] === ',') {
                    args.splice(i, 1);
                    const question = args.splice(0, i);
                    embed.setTitle('📊 ' + question.join(' '))
                    break
                }
            }

            for (let i = 0; i < args.length; i++) {
                if (args[i] === ',') {
                    args.splice(i, 1);
                    options[j] = args.splice(0, i);
                    j++;
                    i = 0;
                }
            }
            description = options.shift()[0]
            j--

            const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
                '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

            const arr = [];
            options[j] = args;

            if (options.length > alphabet.length) {
                return await message.reply('Please don\'t input more than 26 options.').then(sent => {
                    setTimeout(() => {
                        sent.delete();
                    }, 2000);
                });
            }

            let count = 0;

            options.forEach(option => {
                arr.push(alphabet[count] + ' ' + option.join(' '));
                count++;
            });

            embed
                .setDescription(description + '\n\n' + arr.join('\n\n'))
                .setColor('RANDOM')
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

            await message.reply({ embeds: [embed] }).then(msg => {
                for (let i = 0; i < options.length; i++) {
                    msg.react(alphabet[i]);
                }
            })
        }
    }
} 