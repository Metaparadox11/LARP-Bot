module.exports = {
	name: 'listareas',
	description: 'List all areas.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const area = await database[1].findAll({ where: { guild: message.guild.id.toString() } });
            if (!area) {
            	return message.reply('No areas found.');
            } else {
                for (let i = 0; i < area.length; i++) {
                    let nameTemp = area[i].get('name');
                    let channelTemp = message.guild.channels.cache.find(channel => channel.name === area[i].get('channel'));
                    let containersTemp = area[i].get('containers');
                    if (typeof containersTemp === 'undefined') containersTemp = 'none';
										let signsTemp = area[i].get('signs');
		                if (typeof signsTemp === 'undefined') signsTemp = 'none';
                    let stringTemp = `\nName: ${nameTemp}\nChannel: ${channelTemp}\nContainers: ${containersTemp}\nSigns: ${signsTemp}\n`;
										if (stringTemp.length > 2000) {
											stringTemp.truncate(0,1997);
											stringTemp += '...';
										}
                    message.channel.send(stringTemp);
                }
								if (area.length < 1) {
									message.channel.send(`No areas found.`);
								}
                return;
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up areas. Error: ${e}`);
        }
	},
};
