module.exports = {
    name: "sell",
    usage: "sell <item> [amount]",
    category: "Currency",
    async execute(message, args, cmd, client, Discord) {
        let item = args.join(' ').toLowerCase().trim();
        let hasItem;
        let inv = client.db.get(`items_${message.author.id}`)
        // loop through the inv, if the current item is equal to the item, set hasItem to the current item
        for (let i = 0; i < inv.length; i++) if (inv[i].name == item) hasItem = inv[i]
        if (!hasItem) {
            item = args.slice(0, -1).join(' ').toLowerCase().trim();
            // same thing as line 11, just different item
            for (let i = 0; i < inv.length; i++)if (inv[i].name == item) hasItem = inv[i];
            if (!hasItem)
                return message.reply("That item doesn't exist");
            else
                amount = args[args.length - 1];
        }
        else
            amount = 1
        let price = undefined;
        for (let i = 0; i < amount; i++) {
            for (let j = 0; j < inv.length; j++) {
                const currItem = inv[j];
                if (currItem.name == item) {
                    const itemInv = currItem;
                    price = itemInv.price || itemInv.prize;
                    await client.eco.addMoney(message.author.id, false, price);
                    inv.splice(j, 1)
                    client.db.set(`items_${message.author.id}`, inv)
                    break
                }
            }
        }
        return message.channel.send(`You sold **${amount} ${item}** for **:dollar: ${price}**.`);
    }
}