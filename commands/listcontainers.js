module.exports = {
	name: 'listcontainers',
	description: 'List all containers.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				try {
            const container = await database[2].findAll({ where: { guild: message.guild.id.toString() } });
            if (!container) {
            	return message.reply('No containers found.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < container.length; i++) {
                    let nameTemp = container[i].get('name');
										let itemsTemp = container[i].get('items');
                    let timeTemp = container[i].get('time');
                    if (typeof timeTemp === 'undefined') timeTemp = '0';
                    let randomTemp = container[i].get('random');
                    if (typeof randomTemp === 'undefined') randomTemp = 'false';
                    let areaTemp = container[i].get('area');
                    messageTemp += `\nName: ${nameTemp}\nItems: ${itemsTemp}\nTime: ${timeTemp}\nRandom: ${randomTemp}\nArea: ${areaTemp}\n`;
                }
				if (container.length === 0) {
					messageTemp = 'No containers found.';
				}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up a container. Error: ${e}`);
        }
	},
};
