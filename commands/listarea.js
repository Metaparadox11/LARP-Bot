module.exports = {
	name: 'listarea',
	description: 'List an area\'s data.',
    args: true,
    usage: '<areaname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        //const areaTemp = args[0];
		let areaTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                areaTemp += ' ';
            }
            areaTemp += args[i];
        }

        try {
            const area = await Areas.findOne({ where: { name: areaTemp, guild: message.guild.toString() } });
            if (!area) {
            	return message.reply('You must include a valid area.');
            } else {
                let channelTemp = message.guild.channels.cache.find(channel => channel.name === area.get('channel'));
                let containersTemp = area.get('containers');
                if (typeof containersTemp === 'undefined') containersTemp = 'none';
                return message.reply(`\nArea: ${areaTemp}\nChannel: ${channelTemp}\nContainers: ${containersTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that area. Error: ${e}`);
        }
	},
};
