module.exports = {
	name: 'listroles',
	description: 'List all character roles.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const role = await database[5].findAll({ where: { guild: message.guild.id.toString() } });
            if (!role) {
            	return message.reply('No roles found.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < role.length; i++) {
                  messageTemp += `\nName: ${role[i].get('name')}\n`;
                }
        				if (role.length === 0) {
        					messageTemp = 'No roles found.';
        				}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up a role. Error: ${e}`);
        }
	},
};
