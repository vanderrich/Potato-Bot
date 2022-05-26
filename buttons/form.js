
module.exports = {
    name: "form",
    async execute(interaction, client, Discord, footers) {
        const name = interaction.options.getString("name");
        const form = await client.forms.findOne({ name: name });
        if (!form) return interaction.message.channel.send("Form not found.");
        const modal = new Discord.Modal()
            .setTitle(form.name)
            .setCustomId(form.customId)
        const fields = [];
        for (const field of form.fields) {
            let component;
            if (field.type === "text") {
                component = new Discord.TextInputComponent()
                    .setLabel(field.name)
                    .setCustomId(field.customId)
                    .setStyle(field.style)
            } else if (field.type === "select") {
                component = new Discord.MessageSelectMenu()
                    .setCustomId(field.customId)
                    .setPlaceholder(field.placeholder)
                    .addOptions(field.options.map(option => new Discord.MessageOption(option.name, option.value)))
            }

            fields.push(new Discord.MessageActionRow().addComponents(components));
        }
        modal.addComponents(...fields);
        await interaction.showModal(modal);
    }
}