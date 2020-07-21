module.exports = {
	name: 'changesign',
	contents: 'Change an active to an inactive sign.',
  args: true,
  usage: '<current sign name> . <new sign name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        if (typeof args[0] === 'undefined') {
          return message.reply('You need to include a current sign name.');
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
            return message.reply('You need to include a divider between the sign names.');
        }

        let nameArg = '';
        for (var i = 0; i < dividerPos1; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        if (typeof args[dividerPos1 + 1] === 'undefined') {
            return message.reply('You need to include new sign name.');
        }

        let newArgs = '';
        for (var i = dividerPos1 + 1; i < args.length; i++) {
            if (i !== dividerPos1 + 1) {
                newArgs += ' ';
            }
            newArgs += args[i];
        }

        try {
            const sign = await database[7].findOne({ where: { name: nameArg, guild: message.guild.id.toString() } });
            if (!sign) {
            	return message.reply('You must include a valid current sign.');
            } else {
                //Make sure message is in the right channel
                let thisChannel = message.channel.name;
    						let signArea = sign.get('area');
    						try {
    							const area = await database[1].findOne({ where: { name: signArea, guild: message.guild.id.toString() } });
    							if (!area) {
    								return message.reply(`No area contains this current sign.`);
    							}
    							let areaChannel = area.get('channel');
    							if (areaChannel !== thisChannel) {
    								return message.reply(`You aren't in the right area to change that sign.`);
    							}
    						} catch (e) {
    							return message.reply(`Something went wrong with getting the area's channel. Error: ${e}`);
    						}

                //Check if sign is active
                let signActive = sign.get('active');
                if (!signActive) {
                  return message.reply(`The first sign needs to be active to run this command.`);
                }

                try {
                  const sign2 = await database[7].findOne({ where: { name: newArgs, guild: message.guild.id.toString() } });
                  if (!sign2) {
                  	return message.reply('You must include a valid new sign.');
                  } else {
                    //Make sure message is in the right channel
                    let thisChannel = message.channel.name;
        						let signArea2 = sign2.get('area');
        						try {
        							const area = await database[1].findOne({ where: { name: signArea2, guild: message.guild.id.toString() } });
        							if (!area) {
        								return message.reply(`No area contains this new sign.`);
        							}
        							let areaChannel = area.get('channel');
        							if (areaChannel !== thisChannel) {
        								return message.reply(`That sign isn't in the right area to activate.`);
        							}
        						} catch (e) {
        							return message.reply(`Something went wrong with getting the area's channel. Error: ${e}`);
        						}

                    //Check if sign is active
                    let signActive2 = sign2.get('active');
                    if (signActive2) {
                      return message.reply(`The new sign needs to be inactive to run this command.`);
                    }

                    // Switch active attributes
                    try {
                      const affectedRows = await database[7].update({ active: false }, { where: { name: nameArg, guild: message.guild.id.toString() } });
                      try {
                        const affectedRows2 = await database[7].update({ active: true }, { where: { name: newArgs, guild: message.guild.id.toString() } });

                        // React filter
            						const filter = (reaction, user) => {
            							return reaction.emoji.name === '✅' && user.id === message.author.id;
            						};

                        let mainMessage = await message.reply(`Sign ${nameArg} changed to ${newArgs}.`);

                        const message2 = await message.channel.send("Delete messages? React ✅ to delete.");
                        message2.react('✅');

                        const collector = message2.createReactionCollector(filter, { time: 100000 });

                        collector.on('collect', async (reaction, reactionCollector) => {
                          await message2.delete();
                          await mainMessage.delete();
                          await message.delete();
                        });

                      } catch (e) {
                        return message.reply(`Something went wrong updating the new sign. Error: ${e}`);
                      }
                    } catch (e) {
                      return message.reply(`Something went wrong updating the current sign. Error: ${e}`);
                    }

                  }
                } catch (e) {
                  return message.reply(`Something went wrong looking up that new sign. Error: ${e}`);
                }
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that current sign. Error: ${e}`);
        }
	},
};
