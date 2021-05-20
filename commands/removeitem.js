module.exports = {
	name: 'removeitem',
	description: 'Remove an item from an inventory.',
  args: true,
  usage: '<character name or role> . <itemname>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
		if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
			return message.reply(`You don't have GM permissions.`);
		}

		async function removeItem(idArg, nameArg) {
			try {
				const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
					if (!inventory) {
						return message.reply('You must tag a user with an inventory.');
					} else {

							// get item proper name
							const Sequelize = require('sequelize');
							const Op = Sequelize.Op;
			        try {
			            const item = await database[0].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
			            if (!item) {
			            	return message.reply('You must include a valid item.');
			            } else {
										nameArg = item.get('name');

										let tempItems = inventory.get('items');

										if (typeof tempItems === 'undefined') tempItems = '';

										let items = tempItems.split(/,/);

										let temp = '';
										let pos = -1;
										for (let i = 0; i < items.length; i++) {
												if (items[i] === nameArg) {
													pos = i;
													i = items.length;
												}
										}
										if (pos === -1) {
											return message.reply(`They don't have item ${nameArg}.`);
										}
										items.splice(pos, 1);
										for (let i = 0; i < items.length; i++) {
											temp += items[i];
											if (i !== items.length - 1) {
												temp += ',';
											}
										}

										try {
												const affectedRows = await database[3].update({ items: temp }, { where: { id: idArg, guild: message.guild.id.toString() } });

												if (affectedRows > 0) {
													return message.reply(`One of item ${nameArg} deleted from ${inventory.get('name')}'s inventory.`);
												}
										} catch (e) {
												return message.reply(`Something went wrong with deleting an item from an inventory. Error: ${e}`);
										}

			            }
			        }
			        catch (e) {
			        	return message.reply(`Something went wrong looking up that item. Error: ${e}`);
			        }

					}

				return message.reply(`Something went wrong with removing an item.`);
			}
			catch (e) {
				return message.reply(`Something went wrong with removing an item. Error: ${e}`);
			}
		}

		let dividerPos1 = 0;
		if (!message.mentions.roles.size) {
			 //get dividerPos1
			 let hasDivider1 = false;
			 for (var i = 0; i < args.length; i++) {
					 if (args[i] === '.') {
							 hasDivider1 = true;
							 dividerPos1 = i;
							 i = args.length;
					 }
			 }

			if (!hasDivider1) {
					 return message.reply('You need to include a divider between the character role or name and item name.');
			 }

			 // Get character name
			 let nameArg = '';
			 for (var i = 0; i < dividerPos1; i++) {
					 if (i !== 0) {
							 nameArg += ' ';
					 }
					 nameArg += args[i];
			 }

			 //Get item name

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
           return message.reply('You need to include an item name.');
       }

			 let itemArg = '';
			 for (var i = dividerPos1 + 1; i < args.length; i++) {
					 if (i !== dividerPos1 + 1) {
							 itemArg += ' ';
					 }
					 itemArg += args[i];
			 }

			 //Get role from name
			 const Sequelize = require('sequelize');
			 const Op = Sequelize.Op;
			 try {
				 const role = await database[5].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
				 if (!role) {
					 return message.reply(`You need to include a valid character name or tag a character role in order to delete their item!`);
				 } else {
					 let tempId = role.get('id');
					 let taggedRole = await message.guild.roles.fetch(tempId);
					 const idArg = taggedRole.id.toString();

					 removeItem(idArg, itemArg);
				 }
			 } catch (e) {
				return message.reply(`You need to include a valid character name or tag a character role in order to delete their item! Error: ${e}`);
			 }
		} else {
			 dividerPos1 = 1;
			 const taggedUser = message.mentions.roles.first();
			 let idArg = taggedUser.id.toString();

			 if (args[dividerPos1] !== '.') {
					 return message.reply('You need to include a divider between the character role or name and item name.');
			 }

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
					 return message.reply('You need to include an item name.');
			 }

			 let nameArg = '';
			 for (var i = dividerPos1 + 1; i < args.length; i++) {
					 if (i !== dividerPos1 + 1) {
							 nameArg += ' ';
					 }
					 nameArg += args[i];
			 }

			 removeItem(idArg, nameArg);
		}

	},
};
