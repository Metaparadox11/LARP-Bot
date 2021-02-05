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
                for (let i = 0; i < role.length; i++) {
                  let stringTemp = `\nName: ${role[i].get('name')}`;
									if (stringTemp.length > 2000) {
										stringTemp.truncate(0,1997);
										stringTemp += '...';
									}
									message.channel.send(stringTemp);
                }
        				if (role.length < 1) {
        					message.channel.send(`No roles found.`);
        				}
                return;
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up a role. Error: ${e}`);
        }
	},
};
