module.exports = {
	name: 'give',
	description: 'Give an item to a user.',
  args: true,
  usage: '<@user> <item>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to give them something!');
        }

				let roleId = '';
				try {
						const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });
						if (!roles) {
							return message.reply('No roles found.');
						} else {
							let tempId = '';
							for (let i = 0; i < roles.length; i++) {
								tempId = roles[i].get('id');
								let char = message.mentions.members.first();
								if (char.roles.cache.has(tempId)) {
									roleId = tempId;
									i = roles.length;
								}
							}
							if (roleId === '') {
                return message.reply(`They don't have a character role.`);
              }
						}
				}
				catch (e) {
					return message.reply(`Something went wrong looking up roles. Error: ${e}`);
				}

				const taggedUser = await message.guild.roles.fetch(roleId);
				let idArg = taggedUser.id.toString();

        if (typeof args[1] === 'undefined') {
            return message.reply('You need to include an item to give.');
        }

				if (taggedUser === message.author) {
	        return message.reply(`You can't give your items to yourself.`);
	      }

				let itemTemp = args[1];
				for (let i = 2; i < args.length; i++) {
					itemTemp += ' ' + args[i];
				}

				try {
					const item = await database[0].findOne({ where: { name: itemTemp, guild: message.guild.id.toString() } });
					if (!item) {
						return message.reply(`That item doesn't exist.`);
					}
				} catch (e) {
					return message.reply(`Something went wrong looking up that item. Error: ${e}`);
				}

				let roleId2 = '';
				try {
            const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });
            if (!roles) {
            	return message.reply('No roles found.');
            } else {
							let tempId = '';
							for (let i = 0; i < roles.length; i++) {
								tempId = roles[i].get('id');
								let author = message.member;
								if (author.roles.cache.has(tempId)) {
									roleId2 = tempId;
									i = roles.length;
								}
							}
							if (roleId2 === '') {
                return message.reply(`You don't have a character role.`);
              }
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up roles. Error: ${e}`);
        }

				const you = await message.guild.roles.fetch(roleId2);

				try {
	          const yourInventory = await database[3].findOne({ where: { id: you.id.toString(), guild: message.guild.id.toString() } });
	          if (!yourInventory) {
	            return message.reply('You must have an inventory.');
	          } else {
	              let itemTempYours = yourInventory.get('items');
	              if (typeof itemTempYours === 'undefined' || itemTempYours === '') {
	                return message.reply(`You don't have any items to give.`);
	              }

								// Delete items from your inventory
								let items = itemTempYours.split(/,/);

								let temp = '';
								let pos = -1;
	              for (let i = 0; i < items.length; i++) {
	                  if (items[i] === itemTemp) {
											pos = i;
											i = items.length;
										}
	              }
								if (pos === -1) {
									return message.reply(`You don't have item ${itemTemp}.`);
								}
								items.splice(pos, 1);
								for (let i = 0; i < items.length; i++) {
									temp += items[i];
									if (i !== items.length - 1) {
										temp += ',';
									}
								}



                try {
                    const affectedRows = await database[3].update({ items: temp }, { where: { id: you.id.toString(), guild: message.guild.id.toString() } });

                    if (affectedRows === 0) {
                    	return message.reply(`Something went wrong removing the item from your inventory.`);
                    }
                } catch (e) {
                    return message.reply(`Something went wrong removing the item from your inventory. Error: ${e}`);
                }

	              // Add item to tagged user's inventory
	              try {
	                const theirInventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
	                if (!theirInventory) {
	                  return message.reply(`That user doesn't have an inventory.`);
	                } else {
	                  let theirItems = theirInventory.get('items');
	                  let temp = '';
	                  if (theirItems === '') {
	                    temp = itemTemp;
	                  } else {
	                    temp = theirItems + ',' + itemTemp;
	                  }

	                  try {
	  	                const affectedRows = await database[3].update({ items: temp }, { where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });

	  	                if (affectedRows === 0) {
	  	                	return message.reply(`Something went wrong with updating their items.`);
	  	                }
	  								} catch (e) {
	  									return message.reply(`Something went wrong with updating their items. Error: ${e}`);
	  								}
	                }
	              }
	              catch (e) {
	                return message.reply(`Something went wrong looking up the other user's inventory. Error: ${e}`);
	              }

	          }
	      }
	      catch (e) {
	        return message.reply(`Something went wrong looking up that inventory. Error: ${e}`);
	      }

	      let mainMessage = await message.reply(`You gave ${itemTemp} to ${taggedUser}.`);

				const message2 = await message.channel.send("Delete message? React ✅ to delete.");
        message2.react('✅');

        const filter = (reaction, user) => {
          return reaction.emoji.name === '✅' && user.id === message.author.id;
        };

        const collector = message2.createReactionCollector(filter, { time: 100000 });

        collector.on('collect', async (reaction, reactionCollector) => {
          await message2.delete();
          await mainMessage.delete();
          await message.delete();
        });
	},
};
