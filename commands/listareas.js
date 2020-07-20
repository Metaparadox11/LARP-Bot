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
                let messageTemp = '';
                for (let i = 0; i < area.length; i++) {
                    let nameTemp = area[i].get('name');
                    let channelTemp = message.guild.channels.cache.find(channel => channel.name === area[i].get('channel'));
                    let containersTemp = area[i].get('containers');
                    if (typeof containersTemp === 'undefined') containersTemp = 'none';
                    messageTemp += `\nName: ${nameTemp}\nChannel: ${channelTemp}\nContainers: ${containersTemp}\n`;
                }
				if (area.length === 0) {
					messageTemp = 'No areas found.';
				}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up an area. Error: ${e}`);
        }
	},
};
