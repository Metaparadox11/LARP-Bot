module.exports = {
	name: 'listinventories',
	description: 'List all inventories.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {

        try {
            const inventory = await database[3].findAll({ where: { guild: message.guild.id.toString() } });
            if (!inventory) {
            	return message.reply('No inventories found.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < inventory.length; i++) {
                    let idTemp = inventory[i].get('id');
                    let nameTemp = inventory[i].get('name');
                    let itemsTemp = inventory[i].get('items');
                    if (typeof itemsTemp === 'undefined') itemsTemp = 'none';
                    let abilitiesTemp = inventory[i].get('abilities');
                    if (typeof abilitiesTemp === 'undefined') abilitiesTemp = 'none';
                    messageTemp += `\nCharacter Name: ${nameTemp}\nItems: ${itemsTemp}\nAbilities: ${abilitiesTemp}\n`;
                }
				if (inventory.length === 0) {
					messageTemp = 'No inventories found.';
				}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up an inventory. Error: ${e}`);
        }
	},
};
