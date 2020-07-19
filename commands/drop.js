module.exports = {
	name: 'drop',
	description: 'Drop an item in a container.',
  args: true,
  usage: '<item> . <container>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
      if (typeof args[0] === 'undefined') {
          return message.reply('You need to include an item to drop.');
      }

			let hasDivider1 = false;
      let dividerPos1 = 0;
      for (var i = 0; i < args.length; i++) {
          if (args[i] === '.') {
              hasDivider1 = true;
              dividerPos1 = i;
              i = args.length;
          }
      }

			if (!hasDivider1) {
          return message.reply('You need to include a divider between the item name and container name.');
      }

			if (typeof args[dividerPos1 + 1] === 'undefined') {
          return message.reply('You need to include a container name.');
      }

			let itemTemp = args[0];
			for (let i = 1; i < dividerPos1; i++) {
				itemTemp += ' ' + args[i];
			}

			let containerTemp = args[dividerPos1 + 1];
			for (let i = dividerPos1 + 2; i < args.length; i++) {
				containerTemp += ' ' + args[i];
			}

			try {
				const item = await database[0].findOne({ where: { name: itemTemp, guild: message.guild.id.toString() } });
				if (!item) {
					return message.reply(`That item doesn't exist.`);
				}
			} catch (e) {
				return message.reply(`Something went wrong looking up that item. Error: ${e}`);
			}

			//Get associated character role
			let roleId = '';
			try {
					const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });
					if (!roles) {
						return message.reply('No roles found.');
					} else {
						for (let i = 0; i < roles.length; i++) {
							tempId = roles[i].get('id');
							let author = message.member;
							if (author.roles.cache.has(tempId)) {
								roleId = tempId;
								i = roles.length;
							}
						}
					}
			}
			catch (e) {
				return message.reply(`Something went wrong looking up roles. Error: ${e}`);
			}

			const taggedUser = await message.guild.roles.fetch(roleId);

			try {
          const yourInventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
          if (!yourInventory) {
            return message.reply('You must have an inventory.');
          } else {
              let itemTempYours = yourInventory.get('items');
              if (typeof itemTempYours === 'undefined') {
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
                  const affectedRows = await database[3].update({ items: temp }, { where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });

                  if (affectedRows === 0) {
                  	return message.reply(`Something went wrong removing the item from your inventory.`);
                  }
              } catch (e) {
                  return message.reply(`Something went wrong removing the item from your inventory. Error: ${e}`);
              }

              // Add item to container
              try {
                const container = await database[2].findOne({ where: { name: containerTemp, guild: message.guild.id.toString() } });
                if (!container) {
                  return message.reply(`That container doesn't exist.`);
                } else {
                  let containerItems = container.get('items');
                  let temp = '';
                  if (containerItems === '') {
                    temp = itemTemp;
                  } else {
                    temp = containerItems + ',' + itemTemp;
                  }

                  try {
  	                const affectedRows = await database[2].update({ items: temp }, { where: { name: containerTemp, guild: message.guild.id.toString() } });

  	                if (affectedRows === 0) {
  	                	return message.reply(`Something went wrong with updating the container items.`);
  	                }
  								} catch (e) {
  									return message.reply(`Something went wrong with updating the container items. Error: ${e}`);
  								}
                }
              }
              catch (e) {
                return message.reply(`Something went wrong looking up the container. Error: ${e}`);
              }

          }
      }
      catch (e) {
        return message.reply(`Something went wrong looking up that inventory. Error: ${e}`);
      }

      message.reply(`You dropped ${itemTemp} in ${containerTemp}.`);

	},
};
