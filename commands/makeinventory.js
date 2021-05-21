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
					const Sequelize = require('sequelize');
					const Op = Sequelize.Op;
					// check inventory doesn't already exist (id and name must be unique)

					try {
	            const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
	            if (!inventory) {

								try {
				            const inventory2 = await database[3].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
				            if (!inventory2) {

											try {
												const inventory3 = await database[3].create({
													id: idArg,
													items: itemsArg,
													abilities: abilitiesArg,
													mems: memsArg,
													name: nameArg,
													guild: message.guild.id.toString(),
												});
												if (!inventory3) {
													return message.reply(`Something went wrong with adding an inventory. Error: ${e}`);
												} else {
													return message.reply(`Inventory created for ${nameArg}.`);
												}
											}
											catch (e) {
												return message.reply(`Something went wrong with adding an inventory. Error: ${e}`);
											}

				            } else {
				              return message.reply('That inventory already exists.');
				            }
				        }
				        catch (e) {
				        	return message.reply(`Something went wrong looking up an inventory. Error: ${e}`);
				        }

	            } else {
	              return message.reply('That inventory already exists.');
	            }

	        }
	        catch (e) {
	        	return message.reply(`Something went wrong looking up an inventory. Error: ${e}`);
	        }

				}

				if (!message.mentions.roles.size) {
					 let temp = args[0];
					 for (let i = 1; i < args.length; i++) {
						 temp += ' ' + args[i];
					 }

					 //Get role from name
					 const Sequelize = require('sequelize');
	 				 const Op = Sequelize.Op;
					 try {
						 	const role = await database[5].findOne({ where: { name: {[Op.like]: temp}, guild: message.guild.id.toString() } });
	            if (!role) {
								return message.reply(`You need to include a valid character role name or tag a character role in order to make their inventory!`);
						 	} else {
								temp = role.get('name');
								let tempId = role.get('id');

								try {
									let taggedRole = await message.guild.roles.fetch(tempId);

									if (!taggedRole) {
										let nameArg = temp;

						        const itemsArg = '';
						        const abilitiesArg = '';
										const memsArg = '';

						        makeInventory(tempId, itemsArg, abilitiesArg, memsArg, nameArg);
									} else {
										return message.reply(`Something went wrong looking up a role! Error: ${e}`);
									}

								} catch (e) {
									return message.reply(`Something went wrong looking up a role! Error: ${e}`);
								}
							}
					 } catch (e) {
						 return message.reply(`You need to include a valid character name or tag a character role in order to make their inventory! Error: ${e}`);
					 }
				} else {
					let taggedRole = message.mentions.roles.first();

					try {
 						const role = await database[5].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
 						if (!role) {
 							return message.reply(`You need to include a valid character name or tag a character role in order to make their inventory! Error: ${e}`);
 						} else {
 							let nameArg = role.get('name');
							const idArg = taggedRole.id.toString();
			        const itemsArg = '';
			        const abilitiesArg = '';
							const memsArg = '';

			        makeInventory(idArg, itemsArg, abilitiesArg, memsArg, nameArg);
 						}
 				  } catch (e) {
 					  return message.reply(`You need to include a valid character name or tag a character role in order to make their inventory! Error: ${e}`);
 				  }

				}
	},
};
