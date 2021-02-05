module.exports = {
	name: 'listitems',
	description: 'List all items.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

        try {
            const item = await database[0].findAll({ where: { guild: message.guild.id.toString() } });
            if (!item) {
            	return message.reply('No items found.');
            } else {
                for (let i = 0; i < item.length; i++) {
                    let nameTemp = item[i].get('name');
                    let descriptionTemp = item[i].get('description');
										let contentsTemp = item[i].get('contents');
                    let bulkyTemp = item[i].get('bulky');
                    if (typeof bulkyTemp === 'undefined') bulkyTemp = '0';
										let stringTemp = `\nName: ${nameTemp}\nBulky: ${bulkyTemp}\nDescription: ${descriptionTemp}\nContents: ${contentsTemp}\n`;
										if (stringTemp.length > 2000) {
											stringTemp.truncate(0,1997);
											stringTemp += '...';
										}
                    message.channel.send(stringTemp);
                }
								if (item.length < 1) {
									message.channel.send(`No items found.`);
								}
                return;
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up an item. Error: ${e}`);
        }
	},
};
