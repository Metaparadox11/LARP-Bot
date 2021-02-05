module.exports = {
	name: 'deleteroles',
	description: 'Deletes all character roles.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

			if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
				return message.reply(`You don't have GM permissions.`);
			}

			try {
				const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });

				for (let i = 0; i < roles.length; i++) {
					let taggedRole = await message.guild.roles.fetch(roles[i].get('id'));
					taggedRole.delete();
				}

				const roles2 = await database[5].destroy({ where: { guild: message.guild.id.toString() } });
				return message.reply(`Deleted all roles.`);
			}
			catch (e) {
      	return message.reply(`Something went wrong deleting roles. Error: ${e}`);
      }
	},
};
