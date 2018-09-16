const Discord = require('discord.js')
const HypixelAPI = require('hypixel-api')
const moment = require('moment')

const args = process.argv.slice(2)

if (args.length < 2) {
	console.log('Usage: node index.js <Discord bot token> <Hypixel API key>')
	process.exit(0)
}

const client = new Discord.Client()
const HypixelClient = new HypixelAPI(args[1])

client.on('ready', () => {
	client.user.setPresence({
	game: {
		name: `Hypixel`, // Change what the bot is watching or playing.
		type: 1 // 0 for playing, 1 for streaming, 2 for listening and 3 for watching.
	}
})

	console.log('The bot has been initialized!')

	let installedGuilds = client.guilds.array()

	console.log('This bot is available on ' + installedGuilds.length + ' guilds:')

	let totalMembers = 0

	for (let i = 0; i < installedGuilds.length; i++) {
		totalMembers += installedGuilds[i].memberCount
		console.log(installedGuilds[i].name + ': ' + installedGuilds[i].memberCount + ' members')
	}

	console.log('Total members: ' + totalMembers)
})

client.on('message', async (message) => {
	if (message.author.id === client.user.id) return

	if (!message.guild || !message.member) {
		if (message.channel.recipient) {
			message.channel.send('To talk to me, get my attention in servers using the `!hypixel` command!')
		}
		return
	}

	const messageContent = message.content

	if (messageContent.indexOf('!') !== 0) {
		return
	}

	const commandComponents = messageContent.split('!')[1].split(' ')
	const baseCommand = commandComponents[0].toLowerCase()
	const commandArgs = (commandComponents.length > 1 ? commandComponents.slice(1) : [])

	switch (baseCommand) {
		case 'hypixel':
			let helpRich = new Discord.RichEmbed()

			helpRich.setTitle('Help')

			helpRich.setDescription('You can execute the following commands')

			helpRich.setColor('#FFE11A')

			helpRich.addField('!player <name>', 'Displays statistics for a player.')

			helpRich.addField('!guild <name>', 'Displays statistics for a Hypixel guild.')


			message.channel.send(helpRich)
			break
		case 'player':
			if (commandArgs.length > 0) {
				let hypixelPlayer

				message.channel.startTyping()

				try {
					hypixelPlayer = (await HypixelClient.getPlayer('name', commandArgs[0])).player
				}
				catch (err) {
					console.log(err)
					message.channel.stopTyping()
					message.channel.send('Hmm, that player doesn\'t seem to exist!')
					return
				}

				let playerRich = new Discord.RichEmbed()

			    playerRich.setThumbnail('https://crafatar.com/avatars/' + (hypixelPlayer.uuid || '') + '?size=100')
			    playerRich.setThumbnail('https://crafatar.com/avatars/' + (hypixelPlayer.uuid || '') + '?size=100')
				playerRich.setTitle('Hypixel Player: ' + hypixelPlayer.displayname)
				playerRich.setURL('https://hypixel.net/player/' + hypixelPlayer.displayname + '/')
				playerRich.setColor('#30DB09')

				playerRich.addField('Rank', (hypixelPlayer.rank || hypixelPlayer.packageRank || hypixelPlayer.newPackageRank || 'None').toString().replace(/_/g, ' '), true)
				playerRich.addField('Hypixel Level', hypixelPlayer.networkLevel || 'Not available', true)
				playerRich.addField('Karma', hypixelPlayer.karma || 'Not available', true)
				playerRich.addField('Client Version', hypixelPlayer.mcVersionRp || 'Not available', true)
				playerRich.addField('First Login', hypixelPlayer.firstLogin ? moment(hypixelPlayer.firstLogin).calendar() : 'Not available', true)
				playerRich.addField('Last Login', hypixelPlayer.lastLogin ? moment(hypixelPlayer.lastLogin).calendar() : 'Not available', true)

				let playerGuild

				let playerGuildID = (await HypixelClient.findGuild('member', hypixelPlayer.uuid)).guild

				if (playerGuildID) {
					playerGuild = (await HypixelClient.getGuild(playerGuildID)).guild
				}

				playerRich.addField('Guild', (playerGuild ? '[' + playerGuild.name + ' | Guild Tag [' + playerGuild.tag + ']' + '](https://hypixel.net/guilds/' + playerGuild._id + '/)' : 'None'))

				message.channel.stopTyping()

				message.channel.send(playerRich)
			}
			else {
				message.channel.send('Usage: `!player <name>`')
			}
			break
		case 'guild':
			if (commandArgs.length > 0) {
				message.channel.startTyping()
				let targetGuild = await HypixelClient.findGuild('name', message.content.split('!' + baseCommand + ' ')[1])
				message.channel.stopTyping()
				if (targetGuild.guild === null) {
					message.channel.send('Hmm, that guild doesn\'t seem to exist!')
					return
				}

				let guildData = (await HypixelClient.getGuild(targetGuild.guild)).guild

				let guildRich = new Discord.RichEmbed()

				guildRich.setThumbnail('https://hypixel.net/data/guild_banners/100x200/' + guildData._id + '.png')
				guildRich.setTitle('Hypixel Guild: ' + guildData.name + ' | Guild Tag [' + guildData.tag + ']')
				guildRich.setColor('#2DC7A1')
				guildRich.setURL('https://hypixel.net/guilds/' + guildData._id + '/')

				guildRich.addField('Member Count', guildData.members.length, true)
				guildRich.addField('Created', moment(guildData.created).calendar(), true)
				guildRich.addField('Coins', guildData.coins, true)

				message.channel.send(guildRich)
			}
			else {
				message.channel.send('Usage: `!player <name>`')
			}
			break
	}
})


client.on('message', message => {
    if(message.author.bot) return;
    else if (message.member.hasPermission("MANAGE_MESSAGES")) return;
    var re =  /[-a-zA-Z0-9@:%_\+.~#?&  =]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&  =]*)?/gi.exec(message.cleanContent);
    if(re != null){
        message.delete().then(message => {
            message.author.send('Sorry, you cannot include links in your messages');
        });
    }
});




client.on('message', msg => {
  if (msg.content === '!help') {
    msg.reply('This command is currently unavailable!');

  }

});

client.on('message', msg => {
  if (msg.content === '!clear') {
  const embed = new Discord.RichEmbed()
  .setTitle("Hypixel CLEAR")
  .setAuthor("Created by Panayiotis", "https://cdn.discordapp.com/avatars/405783458619850782/d0d496048d2718a939e8bb82f4a8618c.png?size=128")
  .addField("!clear 10", "Clears 10 Messages")
  .addField("!clear 20", "Clears 20 Messages")
  .addField("!clear 50", "Clears 50 Messages")
  .addField("!clear 100", "Clears 100 Messages")
  .setColor(0xffdb4d)
  .setThumbnail("http://i.imgur.com/rtCnCW3.png")
    msg.channel.send({embed})
  }

});

client.on('message', function(message) {
    if (message.content == "!clear 10") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(10);
                    const embed = new Discord.RichEmbed()
                    .addField("Messages deleted", "I've cleared 10 Messages!")
                    .setColor(0xffdb4d)
                    message.channel.send({embed})
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    }

});

client.on('message', function(message) {
    if (message.content == "!clear 20") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(20);
                    const embed = new Discord.RichEmbed()
                    .addField("Messages deleted", "I've cleared 20 Messages!")
                    .setColor(0xffdb4d)
                    message.channel.send({embed})
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    }

});

client.on('message', function(message) {
    if (message.content == "!clear 50") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(50);
                    const embed = new Discord.RichEmbed()
                    .addField("Messages deleted", "I've cleared 50 Messages!")
                    .setColor(0xffdb4d)
                    message.channel.send({embed})
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    }

});

client.on('message', function(message) {
    if (message.content == "!clear 100") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(100);
                    const embed = new Discord.RichEmbed()
                    .addField("Messages deleted", "I've cleared 100 Messages!")
                    .setColor(0xffdb4d)
                    message.channel.send({embed})
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    }

});

 client.on("message", (message) => {
      if (message.content.startsWith("!kick")) {
          if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(":x: Access denied!")
          var member= message.mentions.members.first();
          member.kick().then((member) => {
              message.channel.send(":wave: " + member.displayName + " has been successfully kicked :thumbsup: ");
          }).catch(() => {
              message.channel.send("Sorry I can't kick this person!");
          });

      }

  });

 client.on("message", (message) => {
      if (message.content.startsWith("!ban")) {
          if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(":x: Access denied!")
          var member= message.mentions.members.first();
          member.ban().then((member) => {
              message.channel.send(":fire: " + member.displayName + " has been successfully banned :thumbsup:");
          }).catch(() => {
              message.channel.send("Sorry I can't ban this person!");
          });

      }

  });

client.on('message', msg => {
  if (msg.content === '!cool playlist') {
  const embed = new Discord.RichEmbed()
  .setTitle("Hypixel MUSIC PLAYLIST")
  .addField("Duration", "00:31:38")
  .addField("\u200B", "\u200B")
  .addField("Channel", "Uploaded by ChillNation")
  .setColor(0xffdb4d)
  .setThumbnail("https://i.ytimg.com/vi/_YltzRfb-Yo/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCnTz7KgHmiDVjj3-FAgIACLcdWVg")
  .setFooter("Listen to this playlist here: https://www.youtube.com/watch?v=_YltzRfb-Yo")
    msg.channel.send({embed})
  }

});

client.on('message', function(message) {
    if (message.content == "!clear ultra") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(list);
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    }

});

client.on('message', function(message) {
    if (message.content == "avatar update") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    client.user.setAvatar('https://hypixel.net/data/avatars/l/227/227455.jpg?1524596502');
                    const embed = new Discord.RichEmbed()
                    .addField("UPDATE", "My avatar has been updated!")
                    .setColor(0xffdb4d)
					.setThumbnail("https://hypixel.net/data/avatars/l/227/227455.jpg?1524596502")
                    message.channel.send({embed})
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    }

});

client.on('message', function(message) {
    if (message.content == "name update") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    client.user.setUsername('NotWinner');
                    const embed = new Discord.RichEmbed()
                    .addField("Name updated")
                    .setColor(0xffdb4d)
                    message.channel.send({embed})
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        }
    }

});

client.on('guildMemberAdd', member => {
       member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);
       console.log(`${member.user.username} has joined`);
});

client.login(args[0])
