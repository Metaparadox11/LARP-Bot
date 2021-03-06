module.exports = {
	name: 'deleteinventories',
	description: 'Deletes all inventories.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

			if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
				return message.reply(`You don't have GM permissions.`);
			}

			try {
          const inventory = await database[3].destroy({ where: { guild: message.guild.id.toString() } });
          if (!inventory) return message.reply('No inventories found.');
					return message.reply(`Deleted all inventories.`);
      }
      catch (e) {
      	return message.reply(`Something went wrong deleting inventories. Error: ${e}`);
      }
	},
};
