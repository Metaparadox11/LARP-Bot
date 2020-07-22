module.exports = {
	name: 'removemem',
	description: 'Delete a memory packet from an inventory.',
  args: true,
  usage: '<character name or role> . <mem name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
		if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
			return message.reply(`You don't have GM permissions.`);
		}

		async function removeMem(idArg, nameArg) {
			try {
				const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
					if (!inventory) {
						return message.reply('You must include a valid name.');
					} else {
							let tempMems = inventory.get('mems');

							if (typeof tempMems === 'undefined') tempMems = '';

							let memsToSearch = tempMems.split(/,/);

							let temp = '';
							let pos = -1;
							for (let i = 0; i < memsToSearch.length; i++) {
									if (memsToSearch[i] === nameArg) {
										pos = i;
										i = memsToSearch.length;
									}
							}
							if (pos === -1) {
								return message.reply(`They don't have memory packet ${nameArg}.`);
							}
							memsToSearch.splice(pos, 1);
							for (let i = 0; i < memsToSearch.length; i++) {
								temp += memsToSearch[i];
								if (i !== memsToSearch.length - 1) {
									temp += ',';
								}
							}

							try {
									const affectedRows = await database[3].update({ mems: temp }, { where: { id: idArg, guild: message.guild.id.toString() } });

									if (affectedRows > 0) {
										return message.reply(`Memory packet ${nameArg} deleted from ${inventory.get('name')}'s inventory.`);
									}
							} catch (e) {
									return message.reply(`Something went wrong with deleting a memory packet from an inventory. Error: ${e}`);
							}
					}

				return message.reply(`Something went wrong with deleting a memory packet from an inventory.`);
			}
			catch (e) {
				return message.reply(`Something went wrong with deleting a memory packet from an inventory. Error: ${e}`);
			}
		}


		let dividerPos1 = 0;
		if (!message.mentions.roles.size) {
			 //return message.reply('You need to include a role in order to assign an mem!');
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
					 return message.reply('You need to include a divider between the mem name and description.');
			 }

			 let nameArg = '';
			 for (var i = 0; i < dividerPos1; i++) {
					 if (i !== 0) {
							 nameArg += ' ';
					 }
					 nameArg += args[i];
			 }

			//Get mem name

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
					 return message.reply('You need to include a memory packet name.');
			 }

			 let memArg = '';
			 for (var i = dividerPos1 + 1; i < args.length; i++) {
					 if (i !== dividerPos1 + 1) {
							 memArg += ' ';
					 }
					 memArg += args[i];
			 }

			 //Get role from name
			 try {
				 const role = await database[5].findOne({ where: { name: nameArg, guild: message.guild.id.toString() } });
				 if (!role) {
					 return message.reply(`You need to include a valid character name or tag a character role in order to delete their memory packet!`);
				 } else {
					 let tempId = role.get('id');
					 let taggedRole = await message.guild.roles.fetch(tempId);
					 const idArg = taggedRole.id.toString();

					 removeMem(idArg, memArg);
				 }
			 } catch (e) {
				return message.reply(`You need to include a valid character name or tag a character role in order to delete their memory packet! Error: ${e}`);
			 }
		} else {
			 dividerPos1 = 1;
			 const taggedUser = message.mentions.roles.first();

			 if (typeof args[dividerPos1] !== '.') {
					 return message.reply('You need to include a divider between the character role or name and memory packet name.');
			 }

			 if (typeof args[dividerPos1 + 1] === 'undefined') {
					 return message.reply('You need to include a memory packet name.');
			 }

			 let idArg = taggedUser.id.toString();

			 let nameArg = '';
			 for (var i = dividerPos1 + 1; i < args.length; i++) {
					 if (i !== 1) {
							 nameArg += ' ';
					 }
					 nameArg += args[i];
			 }

			 removeMem(idArg, nameArg);
		}

	},
};
