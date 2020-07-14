const Discord = require('discord.js');
module.exports = {
	name: 'deletegame',
	description: 'Deletes all game assets.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        message.channel.send("Are you sure? [y/n]");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', async message => {
            if (message.content == 'y') {
                message.channel.send('Commencing deletion.');
            } else if (message.content == 'n') {
                return message.reply('Okay. Deletion canceled.');
            } else {
                return message.reply('Try command ?deletegame again. Response to the question must be \'y\' or \'n\n');
            }

            try {
                const container = await Containers.destroy({ where: { guild: message.guild.toString() } });
                try {
                	const ability = await Abilities.destroy({ where: { guild: message.guild.toString() } });
                    try {
                    	const item = await Items.destroy({ where: { guild: message.guild.toString() } });
                        try {
                        	const area = await Areas.destroy({ where: { guild: message.guild.toString() } });
                            try {
                            	const inventory = await Inventories.destroy({ where: { guild: message.guild.toString() } });
                            } catch (error) {
                            	message.reply('There was an error trying to delete inventories!');
                            }
                        } catch (error) {
                        	message.reply('There was an error trying to delete areas!');
                        }
                    } catch (error) {
                    	message.reply('There was an error trying to delete items!');
                    }
                } catch (error) {
                	message.reply('There was an error trying to delete abilities!');
                }
            } catch (error) {
            	message.reply('There was an error trying to delete containers!');
            }
            message.reply('Deleted all game assets.');
        });
	},
};
