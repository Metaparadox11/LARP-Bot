module.exports = {
	name: 'deletearea',
	description: 'Deletes an area\'s data and any containers within it.',
    args: true,
    usage: '<areaname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        let areaTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                areaTemp += ' ';
            }
            areaTemp += args[i];
        }

		//return message.reply(`${areaTemp}`);

        try {
            const area = await Areas.destroy({ where: { name: areaTemp, guild: message.guild.toString() } });
            if (!area) {
            	return message.reply('You must include a valid area.');
            } else {
                try {
                    const container = await Containers.destroy({ where: { area: areaTemp, guild: message.guild.toString() } });
					return message.reply(`Area ${areaTemp} deleted. Containers associated with this area deleted.`);
                }
                catch (e) {
                	return message.reply(`Something went wrong deleting containers. Error: ${e}`);
                }
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting that area. Error: ${e}`);
        }
	},
};
