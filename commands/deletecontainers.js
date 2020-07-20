module.exports = {
	name: 'deletecontainers',
	description: 'Deletes all containers from game and from areas.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const container = await database[2].destroy({ where: { guild: message.guild.id.toString() } });
            if (!container) return message.reply('No containers found.');

            try {
                const temp = '';
                const affectedRows = await database[1].update({ containers: temp }, { where: { guild: message.guild.id.toString() } });
            } catch (e) {
                return message.reply(`Something went wrong with updating an area. Error: ${e}`);
            }

            return message.reply(`Deleted all containers.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting containers. Error: ${e}`);
        }
	},
};
