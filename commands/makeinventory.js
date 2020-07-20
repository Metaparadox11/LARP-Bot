module.exports = {
	name: 'makeinventory',
	description: 'Make an inventory and add it to the database.',
    args: true,
    usage: '<character role or name>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				async function makeInventory(idArg, itemsArg, abilitiesArg, memsArg, nameArg) {
					try {
						const inventory = await database[3].create({
							id: idArg,
							items: itemsArg,
							abilities: abilitiesArg,
							mems: memsArg,
							name: nameArg,
							guild: message.guild.id.toString(),
						});
						return message.reply(`Inventory created for ${inventory.name}.`);
					}
					catch (e) {
						if (e.name === 'SequelizeUniqueConstraintError') {
							return message.reply('That inventory already exists.');
						}
						return message.reply(`Something went wrong with adding an inventory. Error: ${e}`);
					}
				}

				if (!message.mentions.roles.size) {
		       //return message.reply('You need to tag a character role in order to make their inventory!');
					 let temp = args[0];
					 for (let i = 1; i < args.length; i++) {
						 temp += ' ' + args[i];
					 }

					 //Get role from name
					 try {
						 	const role = await database[5].findOne({ where: { name: temp, guild: message.guild.id.toString() } });
	            if (!role) {
								return message.reply(`You need to include a valid character name or tag a character role in order to make their inventory!`);
						 	} else {
								let tempId = role.get('id');
								let taggedRole = await message.guild.roles.fetch(tempId);

								let nameArg = taggedRole.name;

				        const idArg = taggedRole.id.toString();
				        //return message.reply(idArg);
				        const itemsArg = '';
				        const abilitiesArg = '';
								const memsArg = '';

				        makeInventory(idArg, itemsArg, abilitiesArg, memsArg, nameArg);
							}
					 } catch (e) {
						 return message.reply(`You need to include a valid character name or tag a character role in order to make their inventory! Error: ${e}`);
					 }
				} else {
					let taggedRole = message.mentions.roles.first();

					let nameArg = taggedRole.name;

	        const idArg = taggedRole.id.toString();
	        //return message.reply(idArg);
	        const itemsArg = '';
	        const abilitiesArg = '';
					const memsArg = '';

	        makeInventory(idArg, itemsArg, abilitiesArg, memsArg, nameArg);
				}
	},
};
