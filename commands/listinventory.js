module.exports = {
	name: 'listinventory',
	description: 'List a user\'s character\'s inventory.',
    args: true,
    usage: '<character role or name>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				async function getInventory(taggedUser) {
					try {
	            const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
	            if (!inventory) {
	            	return message.reply('You must include a valid inventory.');
	            } else {
	                let nameTemp = inventory.get('name');
	                let itemsTemp = inventory.get('items');
	                if (typeof itemsTemp === 'undefined') itemsTemp = 'none';
	                let abilitiesTemp = inventory.get('abilities');
	                if (typeof abilitiesTemp === 'undefined') abilitiesTemp = 'none';
	                return message.reply(`\nCharacter Name: ${nameTemp}\nItems: ${itemsTemp}\nAbilities: ${abilitiesTemp}`);
	            }
	        }
	        catch (e) {
	        	return message.reply(`Something went wrong looking up that inventory. Error: ${e}`);
	        }
				}

				if (!message.mentions.roles.size) {
	       //return message.reply('You need to tag a user in order to list their inventory!');
				 let temp = args[0];
				 for (let i = 1; i < args.length; i++) {
					 temp += ' ' + args[i];
				 }

				 //Get role from name
				 try {
						const role = await database[5].findOne({ where: { name: temp, guild: message.guild.id.toString() } });
						if (!role) {
							return message.reply(`You need to include a valid character name or tag a character role in order to list their inventory!`);
						} else {
							let tempId = role.get('id');
							let taggedRole = await message.guild.roles.fetch(tempId);

							getInventory(taggedRole);
						}
				 } catch (e) {
					 return message.reply(`You need to include a valid character name or tag a character role in order to list their inventory! Error: ${e}`);
				 }
			 	} else {
        	const taggedUser = message.mentions.roles.first();

        	getInventory(taggedUser);
				}
	},
};
