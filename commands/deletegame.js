const Discord = require('discord.js');
module.exports = {
	name: 'deletegame',
	description: 'Deletes all game assets.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

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
																const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });

																for (let i = 0; i < roles.length; i++) {
																	let taggedRole = await message.guild.roles.fetch(roles[i].get('id'));
																	taggedRole.delete();
																}

																const roles2 = await database[5].destroy({ where: { guild: message.guild.id.toString() } });
															} catch (e) {
																return message.reply(`There was an error trying to delete roles! Error: ${e}`);
															}
										        } catch (e) {
										        	return message.reply(`There was an error trying to delete inventories. Error: ${e}`);
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
