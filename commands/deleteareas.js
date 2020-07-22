module.exports = {
	name: 'deleteareas',
	description: 'Deletes all areas and associated containers.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const area = await database[1].destroy({ where: { guild: message.guild.id.toString() } });
            if (!area) return message.reply('No areas found.');

            try {
                const container = await database[2].destroy({ where: { guild: message.guild.id.toString() } });
								try {
									const sign = await database[7].destroy({ where: { guild: message.guild.id.toString() } });
									return message.reply(`Areas deleted. Containers and signs associated with areas deleted.`);
								} catch (e) {
									return message.reply(`Something went wrong deleting signs. Error: ${e}`);
								}
            }
            catch (e) {
            	return message.reply(`Something went wrong deleting containers. Error: ${e}`);
            }

        }
        catch (e) {
        	return message.reply(`Something went wrong deleting areas. Error: ${e}`);
        }
	},
};
