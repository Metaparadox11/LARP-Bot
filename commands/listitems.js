module.exports = {
	name: 'listitems',
	description: 'List all items.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {

        try {
            const item = await Items.findAll({ where: { guild: message.guild.toString() } });
            if (!item) {
            	return message.reply('No items found.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < item.length; i++) {
                    let nameTemp = item[i].get('name');
                    let descriptionTemp = item[i].get('description');
                    let bulkyTemp = item[i].get('bulky');
                    if (typeof bulkyTemp === 'undefined') bulkyTemp = '0';
                    messageTemp += `\nName: ${nameTemp}\nBulky: ${bulkyTemp}\nDescription: ${descriptionTemp}\n`;
                }
				if (item.length === 0) {
					messageTemp = 'No items found.';
				}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up an item. Error: ${e}`);
        }
	},
};
