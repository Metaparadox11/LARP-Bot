module.exports = {
	name: 'searchcontainer',
	description: 'Search a container for an item.',
  args: true,
  usage: '<name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
      if (typeof args[0] === 'undefined') {
          return message.reply('You need to include a container name.');
      }

			let containerTemp = args[0];
			for (let i = 1; i < args.length; i++) {
				containerTemp += ' ' + args[i];
			}

			try {
				const inventory = await database[3].findOne({ where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });
				if (!inventory) {
					return message.reply(`You don't have an inventory.`);
				}
			} catch (e) {
				return message.reply(`Something went wrong with checking for your inventory. Error: ${e}`);
			}

			try {
          const container = await database[2].findOne({ where: { name: containerTemp, guild: message.guild.id.toString() } });
          if (!container) {
            return message.reply(`That container doesn't exist.`);
          } else {
						// React filter
						const filter = (reaction, user) => {
							return reaction.emoji.name === '✅' && user.id === message.author.id;
						};

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
						}

						if (container.get('random')) {
							// Code for giving random item
							let items = itemsTemp.split(/,/);
							let randomNumber = Math.floor(Math.random() * items.length);
							let randomItem = items[randomNumber];

							// Add item to inventory
							try {
								const inventory = await database[3].findOne({ where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });
								let yourItems = inventory.get('items');
								let temp = '';
								if (yourItems === '') {
									temp = randomItem;
								} else {
									temp = yourItems + ',' + randomItem;
								}

								try {
									const affectedRows = await database[3].update({ items: temp }, { where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });

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
							mainMessages[mainMessages.length] = await message.reply(`You found items. React ✅ to the item you want to take: \n`);
							let items = itemsTemp.split(/,/);
							for (let i = 0; i < items.length; i++) {
								messages[i] = await message.channel.send(`${items[i]}\n`);
								messages[i].react('✅');
								collectors[i] = messages[i].createReactionCollector(filter, { time: 100000 });
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
											const inventory = await database[3].findOne({ where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });
											let yourItems = inventory.get('items');
											let temp = '';
											if (yourItems === '') {
												temp = items[i];
											} else {
												temp = yourItems + ',' + items[i];
											}

											try {
												const affectedRows = await database[3].update({ items: temp }, { where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });

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
										for (let a = 0; a < items.length; a++) {
												if (a !== 0) {
													if (a !== i) {
														temp += ',' + items[a];
													}
												} else {
													if (a !== i) {
														temp += items[a];
													}
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

										mainMessages[mainMessages.length] = await message.reply(`You got item ${items[i]}.`);

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
									await message.delete();
								});
							}
						}

					}
      }
      catch (e) {
        return message.reply(`Something went wrong looking up that container. Error: ${e}`);
      }

	},
};
