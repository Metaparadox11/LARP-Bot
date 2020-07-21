module.exports = {
	name: 'deletesigns',
	description: 'Deletes all signs from game and from areas.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const sign = await database[7].destroy({ where: { guild: message.guild.id.toString() } });
            if (!sign) return message.reply('No signs found.');

            try {
                const temp = '';
                const affectedRows = await database[1].update({ signs: temp }, { where: { guild: message.guild.id.toString() } });
            } catch (e) {
                return message.reply(`Something went wrong with updating an area. Error: ${e}`);
            }

            return message.reply(`Deleted all signs.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting signs. Error: ${e}`);
        }
	},
};
