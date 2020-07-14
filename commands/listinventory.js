module.exports = {
	name: 'listinventory',
	description: 'List a user\'s character\'s inventory.',
    args: true,
    usage: '<@username>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to list their inventory!');
        }
        const taggedUser = message.mentions.users.first();

        try {
            const inventory = await Inventories.findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.toString() } });
            if (!inventory) {
            	return message.reply('You must include a valid inventory.');
            } else {
                let nameTemp = inventory.get('name');
                let itemsTemp = inventory.get('items');
                if (typeof itemsTemp === 'undefined') itemsTemp = 'none';
                let abilitiesTemp = inventory.get('abilities');
                if (typeof abilitiesTemp === 'undefined') abilitiesTemp = 'none';
                return message.reply(`\nUser: ${taggedUser}\nCharacter Name: ${nameTemp}\nItems: ${itemsTemp}\nAbilities: ${abilitiesTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that inventory. Error: ${e}`);
        }
	},
};
