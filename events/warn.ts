module.exports = {
    name: 'warn',
    execute(warning: string, client: any) {
        console.warn(warning);
        client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `<@709950767670493275> Warning: ${warning}!` }); // log the warning to the bot logs channel
    }
}