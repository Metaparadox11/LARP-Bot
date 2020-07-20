module.exports = {
	name: 'deleteinventory',
	description: 'Deletes a user\'s character\'s inventory.',
    args: true,
    usage: '<character role or name>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
		if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
			return message.reply(`You don't have GM permissions.`);
		}

		async function deleteInventory(taggedRole) {
			try {
        const inventory = await database[3].destroy({ where: { id: taggedRole.id.toString(), guild: message.guild.id.toString() } });
        if (!inventory) {
        	return message.reply('You must include a valid inventory.');
        } else {
					try {
		        const role = await database[5].destroy({ where: { id: taggedRole.id.toString(), guild: message.guild.id.toString() } });
		        if (!role) {
		        	return message.reply('Your inventory must have a role.');
		        } else {
							taggedRole.delete();
		          return message.reply(`${taggedRole.name}'s inventory deleted.`);
		        }
		      }
		      catch (e) {
		      	return message.reply(`Something went wrong deleting that inventory's role. Error: ${e}`);
		      }
        }
      }
      catch (e) {
      	return message.reply(`Something went wrong deleting that inventory. Error: ${e}`);
      }
		}

		if (!message.mentions.roles.size) {
    	//return message.reply('You need include a valid character name or role in order to delete their inventory!');
			let temp = args[0];
			for (let i = 1; i < args.length; i++) {
				temp += ' ' + args[i];
			}

			//Get role from name
			try {
				 const role = await database[5].findOne({ where: { name: temp, guild: message.guild.id.toString() } });
				 if (!role) {
					 return message.reply(`You need to include a valid character name or tag a character role in order to delete their inventory!`);
				 } else {
					 let tempId = role.get('id');
					 let taggedRole = await message.guild.roles.fetch(tempId);

					 deleteInventory(taggedRole);
				 }
			} catch (e) {
				return message.reply(`You need to include a valid character name or tag a character role in order to delete their inventory! Error: ${e}`);
			}
		} else {
    	const taggedRole = message.mentions.roles.first();

      deleteInventory(taggedRole);
		}
	},
};
