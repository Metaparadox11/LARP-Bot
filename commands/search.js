module.exports = {
	name: 'search',
	description: 'List the current channel\'s areas.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
		let channelTemp = message.channel;

        try {
            const area = await Areas.findAll({ where: { channel: channelTemp.name, guild: message.guild.toString() } });
            if (!area) {
            	return message.reply('There are no areas associated with this channel.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < area.length; i++) {
                    let nameTemp = area[i].get('name');
                    let containersTemp = area[i].get('containers');
                    if (typeof containersTemp === 'undefined') containersTemp = 'none';
                    messageTemp += `\nName: ${nameTemp}\nContainers: ${containersTemp}\n`;
                }
				if (area.length === 0) {
					messageTemp = 'No areas found.';
				}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up areas. Error: ${e}`);
        }
	},
};
