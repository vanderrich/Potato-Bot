const Discord = require('discord.js')
module.exports = {
    name: 'tictactoe',
    description: 'play tictactoe!',
    expectedArgs: '<opponent>',
    minArgs: 1,
    aliases: ['ttt', 'tic-tac-toe'],
    async execute(message, args, cmd, client) {
        //initialize
        var tictactoemap = ['⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛']
        var opponent = message.mentions.users.first();
        if (opponent == null) {
            message.reply('Please tag a user to play with!')
            return
        }
        const filter = response => {
            return response.author.id == message.author.id || response.author.id == opponent.id
        }
        play(a)
        var a = message.author.id
        var turn;
        var aaaaa = false;
        
        //collector
        const collector = await message.channel.createMessageCollector(filter,{max: 100, time: 300000, errors: ['time']})
        collector.on('collect', (m) => {
            //checks if the content is stop and if so exit the game
            if(m.content == 'stop'){
                message.channel.send('exiting game...')
                aaaaa = true
            }
            //check if game has not ended
            if (aaaaa)return
            //check if collected user is not a bot and if its the one who started the message(? idk what i did)
            if (m.author.id == client.id || m.author.id !== a)return

            var user = m.author
            //checks whos turn is it
            if (user.id == message.author.id){
                a = opponent.id;
                turn = '⭕'
            }else a == message.author.id; turn = '❌' 

            //checks the coordinate that the user give
            var x = parseInt(m.content.slice(0, 2))
            var y = parseInt(m.content.slice(2))
            if(!Number.isInteger(x) || !Number.isInteger(y)){
                m.reply('not a valid coordinate')
                if (user.id == message.author.id){
                    a = opponent.id;
                    turn = '⭕'
                }else user.id == message.author.id; turn = '❌' 
                play(a)
                return
            }
            var coord = (3 * (y - 1)) + (x - 1)
            if(tictactoemap[coord] == turn){
                m.reply('that space is allready taken!')
            }else{
                tictactoemap[coord] = turn
            }
            
            //plays the game
            play(a)
        });
        collector.on('end', collected => {
            message.channel.send('timeout')
        })
        function play(a) {
            //processes the results
            var indices1 = [0, 1, 2]
            var indices2 = [3, 4, 5]
            var indices3 = [6, 7, 8]
            var result = [[], [], []]
            indices1.forEach(i => result[0].push(tictactoemap[i]));
            indices2.forEach(i => result[1].push(tictactoemap[i]));
            indices3.forEach(i => result[2].push(tictactoemap[i]));

            //check if player has won
            if (playerHasWon(result, turn)){
                message.channel.send(`${a} won!`)
                aaaaa = true
            }

            //sends the current state
            var tictactoe = result[0].join('') + '\n' + result[1].join('') + '\n' + result[2].join('')
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('tictactoe')
                .addFields(
                    { name: 'game' , value: tictactoe}
                )
            if(aaaaa){
                message.channel.send(`<@${a}>\'s turn`)
            }
            message.channel.send(exampleEmbed)
        }
        function playerHasWon(gameBoard, player){
          //diagonal
          if (gameBoard[0][0] == gameBoard[1][1] && gameBoard[0][0] == gameBoard[2][2] && gameBoard[0][0] == player) {
              this.winningPoints = { x: 0, y: 8 };
              return true;
          }
          if (gameBoard[0][2] == gameBoard[1][1] && gameBoard[0][2] == gameBoard[2][0] && gameBoard[0][2] == player) {
              this.winningPoints = { x: 6, y: 2 };
              return true;
          }

          //horizontal and vertical
          for (let i = 0; i < 3; ++i) {
              if (gameBoard[i][0] == gameBoard[i][1] && gameBoard[i][0] == gameBoard[i][2] && gameBoard[i][0] == player) {
                  this.winningPoints = { x: i, y: i + 6 };
                  return true;
              }

              if (gameBoard[0][i] == gameBoard[1][i] && gameBoard[0][i] == gameBoard[2][i] && gameBoard[0][i] == player) {
                  this.winningPoints = { x: i * 3, y: (i * 3) + 2 };
                  return true;
              }
          }
          return false;
        }
    }
}