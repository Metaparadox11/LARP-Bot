const Discord = require('discord.js');
module.exports = {
	name: 'deletegame',
	description: 'Deletes all game assets.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
        message.channel.send("Are you sure? [y/n]");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', async message => {
            if (message.content == 'y') {
                message.channel.send('Commencing deletion.');
            } else if (message.content == 'n') {
                return message.reply('Okay. Deletion canceled.');
            } else {
                return message.reply('Try command ?deletegame again. Response to the question must be \'y\' or \'n\'\n');
            }

            try {
                const container = await database[2].destroy({ where: { guild: message.guild.id.toString() } });
                try {
                	const ability = await database[4].destroy({ where: { guild: message.guild.id.toString() } });
                    try {
                    	const item = await database[0].destroy({ where: { guild: message.guild.id.toString() } });
                        try {
                        	const area = await database[1].destroy({ where: { guild: message.guild.id.toString() } });
                            try {
                            	const inventory = await database[3].destroy({ where: { guild: message.guild.id.toString() } });
															try {
	                            	const roles = await database[5].destroy({ where: { guild: message.guild.id.toString() } });
	                            } catch (error) {
	                            	return message.reply('There was an error trying to delete roles!');
	                            }
                            } catch (error) {
                            	return message.reply('There was an error trying to delete inventories!');
                            }
                        } catch (error) {
                        	return message.reply('There was an error trying to delete areas!');
                        }
                    } catch (error) {
                    	return message.reply('There was an error trying to delete items!');
                    }
                } catch (error) {
                	return message.reply('There was an error trying to delete abilities!');
                }
            } catch (error) {
            	return message.reply('There was an error trying to delete containers!');
            }
            return message.reply('Deleted all game assets.');
        });
	},
};
