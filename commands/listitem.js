module.exports = {
	name: 'listitem',
	description: 'List an item\'s data.',
    args: true,
    usage: '<itemname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
        let itemTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                itemTemp += ' ';
            }
            itemTemp += args[i];
        }

        try {
            const item = await database[0].findOne({ where: { name: itemTemp, guild: message.guild.id.toString() } });
            if (!item) {
            	return message.reply('You must include a valid item.');
            } else {
                let bulkyTemp = item.get('bulky');
                if (typeof bulkyTemp === 'undefined') bulkyTemp = '0';
                let descriptionTemp = item.get('description');
                if (typeof descriptionTemp === 'undefined') descriptionTemp = 'none';
                return message.reply(`\nName: ${itemTemp}\nBulky: ${bulkyTemp}\nDescription: ${descriptionTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that item. Error: ${e}`);
        }
	},
};
