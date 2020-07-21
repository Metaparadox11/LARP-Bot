module.exports = {
	name: 'deletesign',
	description: 'Delete a sign from an area and the database.',
  args: true,
  usage: '<sign name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
		if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
			return message.reply(`You don't have GM permissions.`);
		}

		async function removesign(nameArg) {
      try {
        const sign = await database[7].findOne({ where: { name: nameArg, guild: message.guild.id.toString() } });
        if (!sign) {
          return message.reply('You must include a valid sign.');
        } else {
        	try {
    				  const area = await database[1].findOne({ where: { name: sign.get('area'), guild: message.guild.id.toString() } });
    					if (!area) {
    						return message.reply('You must include a valid area.');
    					} else {
    							let tempsigns = area.get('signs');

    							if (typeof tempsigns === 'undefined') tempsigns = '';

    							let signs = tempsigns.split(/,/);

    							let temp = '';
    							let pos = -1;
    							for (let i = 0; i < signs.length; i++) {
    									if (signs[i] === nameArg) {
    										pos = i;
    										i = signs.length;
    									}
    							}
    							if (pos === -1) {
    								return message.reply(`That sign isn't in that area.`);
    							}
    							signs.splice(pos, 1);
    							for (let i = 0; i < signs.length; i++) {
    								temp += signs[i];
    								if (i !== signs.length - 1) {
    									temp += ',';
    								}
    							}

    							try {
    									const affectedRows = await database[1].update({ signs: temp }, { where: { name: sign.get('area'), guild: message.guild.id.toString() } });

    									if (affectedRows > 0) {
                        try {
          									const affectedRows = await database[7].destroy({ where: { name: nameArg, guild: message.guild.id.toString() } });

          									if (affectedRows > 0) {
    										      return message.reply(`Sign ${nameArg} deleted from area ${sign.get('area')} and database.`);
                            }
                        } catch (e) {
                          return message.reply(`Something went wrong with deleting a sign. Error: ${e}`);
                        }
    									}
    							} catch (e) {
    									return message.reply(`Something went wrong with updating an area. Error: ${e}`);
    							}
    					}

    				  return message.reply(`Something went wrong with looking up an area.`);
    			}
    			catch (e) {
    				return message.reply(`Something went wrong with looking up an area. Error: ${e}`);
    			}
        }
      } catch (e) {
        return message.reply(`Something went wrong with looking up that sign. Error: ${e}`);
      }
		}

  	 // Get sign name
  	 let nameArg = '';
  	 for (var i = 0; i < args.length; i++) {
  			 if (i !== 0) {
  					 nameArg += ' ';
  			 }
  			 nameArg += args[i];
  	 }

  	 removesign(nameArg);

	},
};
