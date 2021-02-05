module.exports = {
	name: 'listsigns',
	description: 'List all signs.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const sign = await database[7].findAll({ where: { guild: message.guild.id.toString() } });
            if (!sign) {
            	return message.reply('No signs found.');
            } else {
                for (let i = 0; i < sign.length; i++) {
                  let areaTemp = sign[i].get('area');
                  let contentsTemp = sign[i].get('contents');
                  let activeTemp = sign[i].get('active');
                  let stringTemp = `\nName: ${sign[i].get('name')}\nContents: ${contentsTemp}\nActive: ${activeTemp}\nArea: ${areaTemp}\n`;
									if (stringTemp.length > 2000) {
										stringTemp.truncate(0,1997);
										stringTemp += '...';
									}
									message.channel.send(stringTemp);
                }
        				if (sign.length < 1) {
        					message.channel.send(`No signs found.`);
        				}
                return;
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up a sign. Error: ${e}`);
        }
	},
};
