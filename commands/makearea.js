module.exports = {
	name: 'makearea',
	description: 'Make an area and add it to the database.',
    args: true,
    usage: '<channel> <name>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				if (!message.guild.channels.cache.find(channel => channel.name === args[0])) {
            return message.reply('You need to include a valid channel name.');
        }

        if (typeof args[1] === 'undefined') {
            return message.reply('You need to include an area name.');
        }

        let nameArg = '';
        for (var i = 1; i < args.length; i++) {
            if (i !== 1) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        const channelArg = args[0];
        const containersArg = '';

        try {
        	const area = await database[1].create({
                name: nameArg,
                channel: channelArg,
                containers: containersArg,
								guild: message.guild.id.toString(),
        	});
        	return message.reply(`Area ${area.name} added.`);
        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('That area already exists.');
        	}
        	return message.reply(`Something went wrong with adding an area. Error: ${e}`);
        }
	},
};
