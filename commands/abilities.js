const Discord = require('discord.js');
module.exports = {
	name: 'abilities',
	description: 'Lists your character\'s abilities.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				let roleId = '';
				try {
            const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });
            if (!roles) {
            	return message.reply('No roles found.');
            } else {
							let tempId = '';
							for (let i = 0; i < roles.length; i++) {
								tempId = roles[i].get('id');
								let author = message.member;
								if (author.roles.cache.has(tempId)) {
									roleId = tempId;
									i = roles.length;
								}
							}
							if (roleId === '') return message.reply(`You don't have a role.`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up roles. Error: ${e}`);
        }

				const taggedUser = await message.guild.roles.fetch(roleId);

        try {
            const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
            if (!inventory) {
            	return message.reply('You must have a valid inventory.');
            } else {
                let abilitiesTemp = inventory.get('abilities');
                if (typeof abilitiesTemp === 'undefined') abilitiesTemp = '';

								const abils = abilitiesTemp.split(/,+/);

								var abilsList = [];

								for (let a = 0; a < abils.length; a++) {
									const ability = await database[4].findOne({ where: { name: abils[a], guild: message.guild.id.toString() } });

									if (!ability) {
			            	 	abilsList[a] = await message.channel.send('Ability not found.');
			            } else {
			                let messageTemp = '';
			                let nameTemp = ability.get('name');
			                let descriptionTemp = ability.get('description');
			                let effectTemp = ability.get('effect');
			                messageTemp += `\nName: ${nameTemp}\nDescription: ${descriptionTemp}\nEffect: ${effectTemp}\n`;

			                abilsList[a] = await message.channel.send(messageTemp);
			            }
								}

                const message2 = await message.channel.send("Delete message? React 👌 to delete.");
                message2.react('👌');

                const filter = (reaction, user) => {
                	return reaction.emoji.name === '👌' && user.id === message.author.id;
                };

                const collector = message2.createReactionCollector(filter, { time: 100000 });

                collector.on('collect', async (reaction, reactionCollector) => {
										for (let i = 0; i < abilsList.length; i++) {
											await abilsList[i].delete();
										}
                    await message2.delete();
                    await message.delete();
                });
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up your abilities. Error: ${e}`);
        }
	},
};
