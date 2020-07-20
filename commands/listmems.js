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
                    messageTemp += `\nName: ${nameTemp}\nTrigger: ${triggerTemp}\nContents: ${contentsTemp}\n`;
                }
								if (mems.length === 0) {
									messageTemp = 'No memory packets found.';
								}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up a memory packet. Error: ${e}`);
        }
	},
};
