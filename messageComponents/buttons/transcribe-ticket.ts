import Discord from "discord.js";
import fs from "fs";
import officegen from "officegen";
import { Createticket } from "../../localization";
import { Client } from "../../Util/types";
const msglimit = 100;

module.exports = {
    name: "transcribe-ticket",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const locale = client.getLocale(interaction, "commands.moderation.createticket") as Createticket
        const ticket = interaction.customId.split("-")[2];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (!ticketInfo) return interaction.reply(locale.noTicket);
        if (interaction.channel?.type !== "GUILD_TEXT") return;
        interaction.deferReply();
        let docx = officegen({
            type: 'docx',
            author: client.user?.username,
            creator: client.user?.username,
            description: client.getLocale(interaction, "commands.moderation.createticket.transcriptDocxDesc", interaction.channel.name, interaction.channel.id),
            pageMargins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
            title: locale.transcript
        });
        docx.on('error', function (err: any) {
            return console.log(err)
        });
        const path = `./assets/transcripts/${interaction.channel.name}-${interaction.channel.id}.docx`;
        const filename = `${interaction.channel.name}-${interaction.channel.id}.docx`;
        let pObj = docx.createP(); //Make a new paragraph
        pObj.options.align = 'left';  //align it to the left page
        pObj.options.indentLeft = -350;   //overdrive it 350px to the left
        pObj.options.indentFirstLine = -250;  //go 250 px to the - left so right of the overdrive
        pObj.addText(locale.transcriptFor + interaction.channel.name, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 22 }); //add the TEXT CHANNEL NAME
        pObj.addLineBreak(); //make a new LINE
        pObj.addText(locale.channelId + interaction.channel.id, { font_face: 'Arial', color: '000000', bold: false, font_size: 10 }); //Channel id
        pObj.addLineBreak(); //Make a new LINE
        pObj.addText(locale.oldestMsg, { hyperlink: 'myBookmark', font_face: 'Arial', color: '5dbcd2', italic: true, font_size: 8 });  //Make a hyperlink to the BOOKMARK (Created later)
        pObj.addText(locale.clickToJump, { hyperlink: 'myBookmark', font_face: 'Arial', color: '1979a9', italic: false, bold: true, font_size: 8 });  //Make a hyperlink to the BOOKMARK (Created later)
        pObj.addLineBreak();
        let messageCollection: any = new Discord.Collection<string, Discord.Message>(); //make a new collection
        let channelMessages = await interaction.channel.messages.fetch({//fetch the last 100 messages
            limit: 100
        }).catch(err => console.log(err)); //catch any error
        if (!channelMessages) return interaction.reply(locale.noMsg);
        messageCollection = messageCollection.concat(channelMessages); //add them to the Collection
        let tomanymsgs = 1; //some calculation for the messagelimit
        let messagelimit = Number(msglimit) / 100; //devide it by 100 to get a counter
        if (messagelimit < 1) messagelimit = 1; //set the counter to 1 if its under 1
        while (channelMessages?.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
            if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
            tomanymsgs += 1; //add 1 to the counter
            let lastMessageId: any = channelMessages.lastKey(); //get key of the already fetched messages above
            channelMessages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err)); //Fetch again, 100 messages above the already fetched messages
            if (channelMessages) //if its true
                messageCollection = messageCollection.concat(channelMessages); //add them to the collection
        }
        let msgs = messageCollection.reverse(); //reverse the array to have it listed like the discord chat
        //now for every interaction in the array make a new paragraph!
        await msgs.forEach(async (msg: Discord.Message) => {
            // Create a new paragraph:
            pObj = docx.createP()
            pObj.options.align = 'left'; //Also 'right' or 'justify'.
            //Username and Date
            pObj.addText(`${msg.author.tag}`, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 14 });
            pObj.addText(`   ${msg.createdAt.toDateString()}   ${msg.createdAt.toLocaleTimeString()}`, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 14 }); //
            //LINEBREAK
            pObj.addLineBreak()
            //interaction of user
            let umsg;

            if (msg.content.startsWith("```")) {
                umsg = msg.content.replace(/```/g, "");
            }
            else if (msg.attachments.size > 0) {
                umsg = locale.cantLoad;
            }
            else {
                umsg = msg.content;
            }
            pObj.addText(umsg, { font_face: 'Arial', color: '000000', bold: false, font_size: 10 });
            //LINEBREAK
            pObj.addLineBreak()
            pObj.addText(`______________________________________________________________________________________________________________________________________________________________________________________________________________`, { color: 'a6a6a6', font_size: 4 });

        });
        pObj.startBookmark('myBookmark');  //add a bookmark at tha last interaction to make the jump
        pObj.endBookmark();
        let out = fs.createWriteStream(path)  //write everything in the docx file
        out.on('error', function (err) {
            console.log(err)
        })
        out.on("finish", function () {
            try { // try to send the file
                const buffer = fs.readFileSync(path); //get a buffer file
                const attachment = new Discord.MessageAttachment(buffer, filename); //send it as an attachment
                //send the Transcript Into the Channel and then Deleting it again from the FOLDER
                interaction.editReply({ files: [attachment] }).then(del => { //after sending it delete the file and edit the temp interaction to an approvement
                    fs.unlinkSync(path)
                });
            } catch (err) { // if the file is to big to be sent, then catch it!
                console.log(err)
                interaction.editReply(locale.fileTooBig)
                fs.unlinkSync(path) //delete the docx
            }
        })
        docx.generate(out);
    }
}