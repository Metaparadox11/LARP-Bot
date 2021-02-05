module.exports = {
	name: 'listmems',
	description: 'List all memory packets.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const mems = await database[6].findAll({ where: { guild: message.guild.id.toString() } });
            if (!mems) {
            	return message.reply('No memory packets found.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < mems.length; i++) {
                    let nameTemp = mems[i].get('name');
                    let triggerTemp = mems[i].get('trigger');
                    let contentsTemp = mems[i].get('contents');
                    let stringTemp = `\nName: ${nameTemp}\nTrigger: ${triggerTemp}\nContents: ${contentsTemp}\n`;
										if (stringTemp.length > 2000) {
											stringTemp.truncate(0,1997);
											stringTemp += '...';
										}
                    message.channel.send(stringTemp);
                }
								if (mems.length < 1) {
									message.channel.send(`No memory packets found.`);
								}
                return;
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up a memory packet. Error: ${e}`);
        }
	},
};
