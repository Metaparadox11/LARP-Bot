module.exports = {
	name: 'deletearea',
	description: 'Deletes an area\'s data and any containers within it.',
    args: true,
    usage: '<areaname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				let areaTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                areaTemp += ' ';
            }
            areaTemp += args[i];
        }

		//return message.reply(`${areaTemp}`);

        try {
            const area = await database[1].destroy({ where: { name: areaTemp, guild: message.guild.id.toString() } });
            if (!area) {
            	return message.reply('You must include a valid area.');
            } else {
                try {
                    const container = await database[2].destroy({ where: { area: areaTemp, guild: message.guild.id.toString() } });
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
