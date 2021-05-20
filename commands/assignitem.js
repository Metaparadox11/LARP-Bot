module.exports = {
	name: 'assignitem',
	description: 'Assign an item or items to an inventory.',
    args: true,
    usage: '<character name or role> . <number> <itemname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
		if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
			return message.reply(`You don't have GM permissions.`);
		}

		async function assignItem(idArg, numberArg, itemNameArg) {
			//Check item is in database
			const Sequelize = require('sequelize');
			const Op = Sequelize.Op;
			try {
				const item = await database[0].findOne({ where: { name: {[Op.like]: itemNameArg}, guild: message.guild.id.toString() } });
				if (!item) {
					return message.reply(`That item doesn't exist. ${itemNameArg}`);
				}

				try {
					const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
						if (!inventory) {
								return message.reply('You must include a valid character name or role.');
						} else {
								let temp = inventory.get('items');
								itemNameArg = item.get('name');
								let empty = false;
	              if (typeof temp === 'undefined' || temp === '') {
									temp = '';
									empty = true;
								}

	              for (var i = 0; i < numberArg; i++) {
	                  if (empty && i === 0) {
	                      temp += itemNameArg;
												empty = false;
	                  } else {
											temp += ',' + itemNameArg;
										}
	              }

								const affectedRows = await database[3].update({ items: temp }, { where: { id: idArg, guild: message.guild.id.toString() } });

								if (affectedRows > 0) {
									return message.reply(`${numberArg} of item ${itemNameArg} assigned to ${inventory.get('name')}'s inventory.`);
								}
						}

					return message.reply(`Something went wrong with assigning an item.`);
				}
				catch (e) {
					return message.reply(`Something went wrong with assigning an item. Error: ${e}`);
				}

			} catch (e) {
				return message.reply(`Something went wrong with checking an item. Error: ${e}`);
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
					 return message.reply('You need to include a divider between the ability name and description.');
			 }

			 // Get character name
			 let nameArg = '';
			 for (var i = 0; i < dividerPos1; i++) {
					 if (i !== 0) {
							 nameArg += ' ';
					 }
					 nameArg += args[i];
			 }

			 //Get item name and number

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
					 return message.reply('You need to include a number of items.');
			 }

			 const numberArg = parseInt(args[dividerPos1 + 1]);
 			 if (isNaN(numberArg)) {
           return message.reply('Number argument must be a number.');
       }

			 if (numberArg <= 0) {
					 return message.reply('Number argument must be a number > 0.');
			 }

       if (typeof args[dividerPos1 + 2] === 'undefined') {
           return message.reply('You need to include an item name.');
       }

			 let itemArg = '';
			 for (var i = dividerPos1 + 2; i < args.length; i++) {
					 if (i !== dividerPos1 + 2) {
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
					 return message.reply(`You need to include a valid character name or tag a character role in order to assign them an item!`);
				 } else {
					 let tempId = role.get('id');
					 let taggedRole = await message.guild.roles.fetch(tempId);
					 const idArg = taggedRole.id.toString();

					 assignItem(idArg, numberArg, itemArg);
				 }
			 } catch (e) {
				return message.reply(`You need to include a valid character name or tag a character role in order to assign them an item! Error: ${e}`);
			 }
		} else {
			 dividerPos1 = 1;
			 const taggedUser = message.mentions.roles.first();
			 let idArg = taggedUser.id.toString();

			 if (typeof args[dividerPos1] !== '.') {
					 return message.reply('You need to include a divider between the character name and item name.');
			 }

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
					 return message.reply('You need to include an item number.');
			 }

			 const numberArg = parseInt(args[dividerPos1 + 1]);
 			 if (isNaN(numberArg)) {
           return message.reply('Number argument must be a number.');
       }

			 if (typeof args[dividerPos1 + 2] === 'undefined') {
					 return message.reply('You need to include an item name.');
			 }

			 let itemNameArg = '';
			 for (var i = dividerPos1 + 1; i < args.length; i++) {
					 if (i !== 1) {
							 itemNameArg += ' ';
					 }
					 itemNameArg += args[i];
			 }

			 assignItem(idArg, numberArg, itemNameArg);
		}

	},
};
