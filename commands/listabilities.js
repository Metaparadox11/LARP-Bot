module.exports = {
	name: 'listabilities',
	description: 'List all abilities.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const ability = await database[4].findAll({ where: { guild: message.guild.id.toString() } });
            if (!ability) {
            	return message.reply('No abilities found.');
            } else {
                for (let i = 0; i < ability.length; i++) {
                    let nameTemp = ability[i].get('name');
                    let descriptionTemp = ability[i].get('description');
                    let effectTemp = ability[i].get('effect');
                    let stringTemp = `\nName: ${nameTemp}\nDescription: ${descriptionTemp}\nEffect: ${effectTemp}\n`;
										if (stringTemp.length > 2000) {
											stringTemp.truncate(0,1997);
											stringTemp += '...';
										}
                    message.channel.send(stringTemp);
                }
								if (ability.length < 1) {
									message.channel.send(`No abilities found.`);
								}
                return;
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up an ability. Error: ${e}`);
        }
	},
};
