module.exports = {
	name: 'deletemems',
	description: 'Deletes all memory packets from game and from inventories.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const mems = await database[6].destroy({ where: { guild: message.guild.id.toString() } });
            if (!mems) return message.reply('No memory packets found.');

            try {
                const temp = '';
                const affectedRows = await database[3].update({ mems: temp }, { where: { guild: message.guild.id.toString() } });
            } catch (e) {
                return message.reply(`Something went wrong with updating an inventory. Error: ${e}`);
            }

            return message.reply(`Deleted all memory packets.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting memory packets. Error: ${e}`);
        }
	},
};
