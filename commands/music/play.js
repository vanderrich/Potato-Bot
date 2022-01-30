const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
var loop = false;
const queue = new Map();

module.exports = {
    name: 'play',
    cooldown: 0,
    aliases: ["stop", "skip", "loop", "queue"],
    description: 'music bot',
    async execute(message,args, cmd, client, Discord){
        //variables
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions');

        //server queue
        const server_queue = queue.get(message.guild.id);

        //if user use play command
        if (cmd === 'play'){
            if (!args.length) return message.channel.send('You need to send the second argument!');
            let song = {};

            //if first argument is a link. set the song object to have two keys. Title and URl.
            if (ytdl.validateURL(args[1])) {
                const song_info = await ytdl.getInfo(args[1]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                //if no link, use keywords to search for a video. Set the song object to have two keys. Title and URl.
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url }
                } else {
                     message.channel.send('Error finding video.');
                }
            }

            //if server queue not exist (which doesn't for the first video queued) then create a constructor to be added to our global queue.
            if (!server_queue){

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                
                //add key and value pair to global queue. then use this to get our server queue.
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                //establish a connection and play the song with video_player function.
                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting!');
                    throw err;
                }
            } else{
                server_queue.songs.push(song);
                return message.channel.send(`👍 **${song.title}** added to queue!`);
            }
        }
        //other commands
        else if(cmd == 'skip'){
            skip_song(message, server_queue)
        }
        else if(cmd == 'stop'){
            stop_song(message, server_queue);
            message.channel.send('⏹ Stopped')
        }
        else if(cmd == 'loop'){
            if(!loop)message.channel.send('🔁 Enabled')
            else message.channel.send('🔁 Disabled')
            loop = !loop;
        }
        else if(cmd == 'queue'){
            check_queue(message, server_queue, Discord)
        }
        else if(cmd == 'remove'){
            remove_queue(server_queue, args[0])
            message.channel.send(`removed **${server_queue[args[0]+1].title}**`)
        }
    }
    
}

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    //if no song left in server queue. Leave voice channel and delete key and value pair from global queue.
    if (!song && !loop) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        //if loop is on, remove the song played just now and puts it at the end, else it removes it
        if (loop){
            song_queue.songs.push(song_queue.songs.shift())
            video_player(guild, song_queue.songs[0])
        }else{  
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0]);
        }
        
    });
    await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`)
}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if(!server_queue){
        return message.channel.send(`There are no songs in queue 😔`);
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}

const check_queue = (message, server_queue, Discord) => {
    if (!server_queue || server_queue.songs == []){
      return message.channel.send("no songs in queue")
    }
    var embed = new Discord.MessageEmbed()
      .setTitle(`${message.guild.name}'s queue'`)
      .addField(`loop: ${loop}`)
    for (let i = 0; i < server_queue.songs.length; i++){
      let title = (i==0)?"playing":i + ". " + server_queue.songs[i].title 
      embed.addField(title, server_queue.songs[i].url)
    }
    message.channel.send(embed)
}
const remove_song = (server_queue, songIndex) =>{
  server_queue.pop(songIndex)
}