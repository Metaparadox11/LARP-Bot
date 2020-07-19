module.exports = {
	name: 'removeability',
	description: 'Delete an ability from an inventory.',
    args: true,
    usage: '<character name or role> . <abilityname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
		async function removeAbility(idArg, nameArg) {
			try {
				const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
					if (!inventory) {
						return message.reply('You must include a valid name.');
					} else {
							let tempAbils = inventory.get('abilities');

							if (typeof tempAbils === 'undefined') tempAbils = '';

							let abils = tempAbils.split(/,/);

							let temp = '';
							let pos = -1;
							for (let i = 0; i < abils.length; i++) {
									if (abils[i] === nameArg) {
										pos = i;
										i = abils.length;
									}
							}
							if (pos === -1) {
								return message.reply(`You don't have ability ${nameArg}.`);
							}
							items.splice(pos, 1);
							for (let i = 0; i < abils.length; i++) {
								temp += abils[i];
								if (i !== abils.length - 1) {
									temp += ',';
								}
							}

							try {
									const affectedRows = await database[3].update({ abilities: temp }, { where: { id: idArg, guild: message.guild.id.toString() } });

									if (affectedRows > 0) {
										return message.reply(`Ability ${nameArg} deleted from ${inventory.get('name')}'s inventory.`);
									}
							} catch (e) {
									return message.reply(`Something went wrong with deleting an item from an inventory. Error: ${e}`);
							}
					}

				return message.reply(`Something went wrong with deleting an item from an inventory.`);
			}
			catch (e) {
				return message.reply(`Something went wrong with deleting an item from an inventory. Error: ${e}`);
			}
		}


		let dividerPos1 = 0;
		if (!message.mentions.roles.size) {
			 //return message.reply('You need to include a role in order to assign an ability!');
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

			 let nameArg = '';
			 for (var i = 0; i < dividerPos1; i++) {
					 if (i !== 0) {
							 nameArg += ' ';
					 }
					 nameArg += args[i];
			 }

			//Get ability name

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
					 return message.reply('You need to include an ability name.');
			 }

			 let abilityArg = '';
			 for (var i = dividerPos1 + 1; i < args.length; i++) {
					 if (i !== dividerPos1 + 1) {
							 abilityArg += ' ';
					 }
					 abilityArg += args[i];
			 }

			 //Get role from name
			 try {
				 const role = await database[5].findOne({ where: { name: nameArg, guild: message.guild.id.toString() } });
				 if (!role) {
					 return message.reply(`You need to include a valid character name or tag a character role in order to delete their ability!`);
				 } else {
					 let tempId = role.get('id');
					 let taggedRole = await message.guild.roles.fetch(tempId);
					 const idArg = taggedRole.id.toString();

					 removeAbility(idArg, abilityArg);
				 }
			 } catch (e) {
				return message.reply(`You need to include a valid character name or tag a character role in order to delete their ability! Error: ${e}`);
			 }
		} else {
			 dividerPos1 = 1;
			 const taggedUser = message.mentions.roles.first();

			 if (typeof args[dividerPos1] !== '.') {
					 return message.reply('You need to include a divider between the character name and ability name.');
			 }

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
					 return message.reply('You need to include an ability name.');
			 }

			 let idArg = taggedUser.id.toString();

			 let nameArg = '';
			 for (var i = dividerPos1 + 1; i < args.length; i++) {
					 if (i !== 1) {
							 nameArg += ' ';
					 }
					 nameArg += args[i];
			 }

			 removeAbility(idArg, nameArg);
		}

	},
};
