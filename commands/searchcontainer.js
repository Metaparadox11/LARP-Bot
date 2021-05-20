module.exports = {
	name: 'searchcontainer',
	description: 'Search a container for an item.',
  args: true,
  usage: '<container name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
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
						if (roleId === '') return message.reply(`You don't have a character role.`);
					}
			}
			catch (e) {
				return message.reply(`Something went wrong looking up roles. Error: ${e}`);
			}

			const taggedUser = await message.guild.roles.fetch(roleId);

			if (typeof args[0] === 'undefined') {
          return message.reply('You need to include a container name.');
      }

			let containerTemp = args[0];
			for (let i = 1; i < args.length; i++) {
				containerTemp += ' ' + args[i];
			}

			// taggedUser.id.toString() or message.author.id.toString()
			try {
				const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
				if (!inventory) {
					return message.reply(`You don't have an inventory.`);
				}
			} catch (e) {
				return message.reply(`Something went wrong with checking for your inventory. Error: ${e}`);
			}

			const Sequelize = require('sequelize');
			const Op = Sequelize.Op;
			try {
          const container = await database[2].findOne({ where: { name: {[Op.like]: containerTemp}, guild: message.guild.id.toString() } });
          if (!container) {
            return message.reply(`That container doesn't exist.`);
          } else {
						containerTemp = container.get('name');
						// Check if you're in the right channel
						let thisChannel = message.channel.name;
						let containerArea = container.get('area');
						try {
							const area = await database[1].findOne({ where: { name: containerArea, guild: message.guild.id.toString() } });
							if (!area) {
								return message.reply(`No area contains this container.`);
							}
							let areaChannel = area.get('channel');
							if (areaChannel !== thisChannel) {
								return message.reply(`You aren't in the right area to search that container.`);
							}
						} catch (e) {
							return message.reply(`Something went wrong with getting the area's channel. Error: ${e}`);
						}

						// Read container text
						let text = container.get('text');
						let textMessage = await message.reply(`Container Text: ${text}`);

						// Only search if OK reaction
						const message2 = await message.channel.send("Search container? React ✅ to search. React ❌ to delete messages.");
						message2.react('✅');
						message2.react('❌');

						const filter2 = (reaction, user) => {
							return reaction.emoji.name === '❌' && user.id === message.author.id;
						};

						const collector2 = message2.createReactionCollector(filter2, { time: 100000 });

						collector2.on('collect', async (reaction, reactionCollector) => {
							await message2.delete();
							await textMessage.delete();
							await message.delete();
							return;
						});

						// React filters
						const filter = (reaction, user) => {
							return reaction.emoji.name === '✅' && user.id === message.author.id;
						};

						const filter3 = (reaction, user) => {
							return reaction.emoji.name === '✅' && user.id === message.author.id;
						};

						const collector3 = message2.createReactionCollector(filter3, { time: 100000 });

						collector3.on('collect', async (reaction, reactionCollector) => {
							collector2.stop();
							collector3.stop();
							let mainMessages = [];

							let time = container.get('time');
							if (time > 0) {
								mainMessages[mainMessages.length] = await message.channel.send(`Searching for ${time} seconds...`);

								function sleep(ms) {
								  return new Promise(resolve => setTimeout(resolve, ms));
								}
								await sleep(1000 * time);
							}

							let itemsTemp = container.get('items');
							if (itemsTemp === '') {
								mainMessages[mainMessages.length] = await message.reply(`You don't find anything.`);

								function sleep(ms) {
									return new Promise(resolve => setTimeout(resolve, ms));
								}
								await sleep(3000);

								for (let m = 0; m < mainMessages.length; m++) {
									await mainMessages[m].delete();
								}
								await textMessage.delete();
								await message2.delete();
								await message.delete();
								return;
							}

							if (container.get('random')) {
								// Code for giving random item
								let items = itemsTemp.split(/,/);
								let randomNumber = Math.floor(Math.random() * items.length);
								let randomItem = items[randomNumber];

								// Add item to inventory
								try {
									const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
									let yourItems = inventory.get('items');
									let temp = '';
									if (yourItems === '') {
										temp = randomItem;
									} else {
										temp = yourItems + ',' + randomItem;
									}

									try {
										const affectedRows = await database[3].update({ items: temp }, { where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });

										if (affectedRows === 0) {
											return message.reply(`Something went wrong with updating your inventory.`);
										}
									} catch (e) {
										return message.reply(`Something went wrong with updating your inventory. Error: ${e}`);
									}
								} catch (e) {
									return message.reply(`Something went wrong with checking for your inventory. Error: ${e}`);
								}

								// Remove item from container
								temp = '';
								let pos = -1;
								for (let i = 0; i < items.length; i++) {
										if (items[i] === randomItem) {
											pos = i;
											i = items.length;
										}
								}
								items.splice(pos, 1);
								for (let i = 0; i < items.length; i++) {
									temp += items[i];
									if (i !== items.length - 1) {
										temp += ',';
									}
								}

								try {
										const affectedRows = await database[2].update({ items: temp }, { where: { name: containerTemp, guild: message.guild.id.toString() } });

										if (affectedRows === 0) {
											return message.reply(`Something went wrong removing the item from the container.`);
										}
								} catch (e) {
										return message.reply(`Something went wrong removing the item from the container. Error: ${e}`);
								}

								mainMessages[mainMessages.length] = await message.reply(`Done searching. You got random item ${randomItem}.`);
								function sleep(ms) {
									return new Promise(resolve => setTimeout(resolve, ms));
								}
								await sleep(3000);

								for (let m = 0; m < mainMessages.length; m++) {
									await mainMessages[m].delete();
								}
								await message.delete();
							} else {
								// Code for letting player choose item

								let collectors = [];

								// List items in container
								let messages = [];

								let items = itemsTemp.split(/,/);
								if (items.length > 0) {
									mainMessages[mainMessages.length] = await message.reply(`You found ${items.length} items. React ✅ to the item you want to take: \n`);
									for (let i = 0; i < items.length; i++) {
										messages[i] = await message.channel.send(`${items[i]}\n`);
										messages[i].react('✅');
										collectors[i] = messages[i].createReactionCollector(filter, { time: 100000 });
									}
								} else {
									mainMessages[mainMessages.length] = await message.reply(`You found no items.\n`);
								}
								messages[items.length] = await message.channel.send(`React here to not take any items.`);
								messages[items.length].react('✅');
								collectors[items.length] = messages[items.length].createReactionCollector(filter, { time: 100000 });

								for (let i = 0; i < collectors.length; i++) {
									collectors[i].on('collect', async (reaction, reactionCollector) => {
										//delete all messages
										for (let m = 0; m < messages.length; m++) {
											await messages[m].delete();
										}

										if (i !== collectors.length - 1) {
											mainMessages[mainMessages.length] = await message.reply(`You chose item ${items[i]}.`);

											// Actually move item from container into your inventory
											// Add item to inventory
											try {
												const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
												let yourItems = inventory.get('items');
												let temp = '';
												if (yourItems === '') {
													temp = items[i];
												} else {
													temp = yourItems + ',' + items[i];
												}

												try {
													const affectedRows = await database[3].update({ items: temp }, { where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });

													if (affectedRows === 0) {
														return message.reply(`Something went wrong with updating your inventory.`);
													}
												} catch (e) {
													return message.reply(`Something went wrong with updating your inventory. Error: ${e}`);
												}
											} catch (e) {
												return message.reply(`Something went wrong with checking for your inventory. Error: ${e}`);
											}

											// Remove item from container

											let temp = '';
											items.splice(i, 1);
											for (let j = 0; j < items.length; j++) {
												temp += items[j];
												if (j !== items.length - 1) {
													temp += ',';
												}
											}

											try {
													const affectedRows = await database[2].update({ items: temp }, { where: { name: containerTemp, guild: message.guild.id.toString() } });

													if (affectedRows === 0) {
														return message.reply(`Something went wrong removing the item from the container.`);
													}
											} catch (e) {
													return message.reply(`Something went wrong removing the item from the container. Error: ${e}`);
											}

											mainMessages[mainMessages.length] = await message.reply(`You got the item!`);

										} else {
											mainMessages[mainMessages.length] = await message.reply(`You didn't pick an item.`);
										}

										function sleep(ms) {
										  return new Promise(resolve => setTimeout(resolve, ms));
										}
										await sleep(3000);

										for (let m = 0; m < mainMessages.length; m++) {
											await mainMessages[m].delete();
										}
										await message2.delete();
										await textMessage.delete();
										await message.delete();
										return;
									});
								}
							}
						});



					}
      }
      catch (e) {
        return message.reply(`Something went wrong looking up that container. Error: ${e}`);
      }

	},
};
