module.exports = {
	name: 'assignmem',
	description: 'Assign a memory packet to an inventory.',
  args: true,
  usage: '<character name or role> . <mem name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				async function assignMem(idArg, nameArg) {
					//Check mem is in database
					const Sequelize = require('sequelize');
					const Op = Sequelize.Op;
					try {
						const mem = await database[6].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
						if (!mem) {
							return message.reply(`That memory packet doesn't exist.`);
						}

						try {
		        	const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
		            if (!inventory) {
		                return message.reply('You must include a valid character name or role.');
		            } else {
										let temp = inventory.get('mems');
										nameArg = mem.get('name');
										let memz = temp.split(/,/);
										let memPresent = false;
										for (let i = 0; i < memz.length; i++) {
											if (memz[i] === nameArg) {
												memPresent = true;
											}
										}

										if (memPresent) {
											return message.reply('That character already has that memory packet.');
										}

		                if (typeof temp === 'undefined') temp = '';
		                if (temp !== '') {
		                    temp += ','
		                }
		                temp += nameArg;
		                const affectedRows = await database[3].update({ mems: temp }, { where: { id: idArg, guild: message.guild.id.toString() } });

		                if (affectedRows > 0) {
		                	return message.reply(`Memory packet ${nameArg} assigned to ${inventory.get('name')}'s inventory.`);
		                }
		            }

		        	return message.reply(`Something went wrong with assigning a memory packet.`);
		        }
		        catch (e) {
		        	return message.reply(`Something went wrong with assigning a memory packet. Error: ${e}`);
		        }

					} catch (e) {
						return message.reply(`Something went wrong with checking a memory packet. Error: ${e}`);
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
	             return message.reply('You need to include a divider between the character name or role and memory packet name.');
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
					 const Sequelize = require('sequelize');
		 			 const Op = Sequelize.Op;
		 			 try {
		 			 	 const role = await database[5].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
		 			 	 if (!role) {
		 			 		 return message.reply(`You need to include a valid character name or tag a character role in order to assign them a memory packet!`);
		 				 } else {
		 					 let tempId = role.get('id');
		 					 let taggedRole = await message.guild.roles.fetch(tempId);
							 const idArg = taggedRole.id.toString();

		 					 assignMem(idArg, memArg);
		 				 }
		 			 } catch (e) {
		 				return message.reply(`You need to include a valid character name or tag a character role in order to assign them a memory packet! Error: ${e}`);
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

					 message.channel.send(nameArg);

					 assignMem(idArg, nameArg);
			 	}
	},
};
