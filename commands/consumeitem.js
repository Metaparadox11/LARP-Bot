module.exports = {
	name: 'consumeitem',
	description: 'Consume/use an item from your inventory.',
  args: true,
  usage: '<item name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        let itemTemp = args[0];
				for (let i = 1; i < args.length; i++) {
					itemTemp += ' ' + args[i];
				}

				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        let contentsTemp = '';
				try {
					const item = await database[0].findOne({ where: { name: {[Op.like]: itemTemp}, guild: message.guild.id.toString() } });
					if (!item) {
						return message.reply(`That item doesn't exist.`);
					} else {
            contentsTemp = item.get('contents');
          }
					itemTemp = item.get('name');
				} catch (e) {
					return message.reply(`Something went wrong looking up that item. Error: ${e}`);
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
								let author = message.member;
								if (author.roles.cache.has(tempId)) {
									roleId = tempId;
									i = roles.length;
								}
							}
              if (roleId === '') {
                return message.reply(`You don't have a character role.`);
              }
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up roles. Error: ${e}`);
        }

				const you = await message.guild.roles.fetch(roleId);

				try {
	          const yourInventory = await database[3].findOne({ where: { id: you.id.toString(), guild: message.guild.id.toString() } });
	          if (!yourInventory) {
	            return message.reply('You must have an inventory.');
	          } else {
	              let itemTempYours = yourInventory.get('items');
	              if (typeof itemTempYours === 'undefined' || itemTempYours === '') {
	                return message.reply(`You don't have any items.`);
	              }

								// Delete item from your inventory
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

	          }
	      }
	      catch (e) {
	        return message.reply(`Something went wrong looking up that inventory. Error: ${e}`);
	      }

        let mainMessage = [];

        if (contentsTemp === '') {
	        mainMessage[0] = await message.reply(`You used ${itemTemp}.`);
        } else {
          mainMessage[0] = await message.reply(`You used ${itemTemp}. Contents: ${contentsTemp}`);
        }

        const message2 = await message.channel.send("Delete message? React ✅ to delete.");
        message2.react('✅');

        const filter = (reaction, user) => {
          return reaction.emoji.name === '✅' && user.id === message.author.id;
        };

        const collector = message2.createReactionCollector(filter, { time: 100000 });

        collector.on('collect', async (reaction, reactionCollector) => {
          await message2.delete();
          await mainMessage[0].delete();
          await message.delete();
        });

	},
};
