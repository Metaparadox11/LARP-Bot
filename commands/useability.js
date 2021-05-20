module.exports = {
	name: 'useability',
	description: 'Uses an ability with an optional target.',
  args: true,
  usage: '<@user (optional)> <abilityname>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
    let x = 1;
    if (!message.mentions.members.size) {
      x = 0;
    }

		let roleId = '';
		if (x === 1) {
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
		}

		const taggedUser = await message.guild.roles.fetch(roleId);

    if (typeof args[x] === 'undefined') {
        return message.reply('You need to include an ability name.');
    }

    let nameArg = '';
    for (var i = x; i < args.length; i++) {
        if (i !== x) {
            nameArg += ' ';
        }
        nameArg += args[i];
    }

    let idArg = '';

		if (x === 1) {
			idArg = taggedUser.id.toString();
		}

		const Sequelize = require('sequelize');
		const Op = Sequelize.Op;
    try {
        const ability = await database[4].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
        if (!ability) {
        	 return message.reply('You must include a valid ability.');
        } else {
						nameArg = ability.get('name');
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
              const inventory = await database[3].findOne({ where: { id: you.id.toString(), guild: message.guild.id.toString() } });
              if (!inventory) {
                return message.reply('You must have an inventory.');
              } else {
                let abilityTemp = ability.get('name');

                // check if you have ability
                let abilitiesTemp = inventory.get('abilities');
                const abils = abilitiesTemp.split(/,+/);
                let haveAbility = false;
								for (let a = 0; a < abils.length; a++) {
                  if (abils[a] === abilityTemp) {
                    haveAbility = true;
                  }
                }
                if (!haveAbility) return message.reply(`You don't have that ability.`);

                let effectTemp = ability.get('effect');
                if (typeof effectTemp === 'undefined') effectTemp = '';
                let nameTemp = inventory.get('name');

                let messageTemp = `\nAbility ${abilityTemp} used`;

                if (idArg !== '') {
                  messageTemp += ` on ${taggedUser} by ${nameTemp} with effect: ${effectTemp}`;
                } else {
                  messageTemp += ` by ${nameTemp} with effect: ${effectTemp}`;
                }

								if (ability.get('limited')) {
									let privateMessage = `You used limited-use ability ${abilityTemp}.\n`;
									message.author.send(privateMessage);
								}

								let cooldown = parseInt(ability.get('cooldown'));
								if (cooldown > 0) {
									setTimeout(cooldownMessage, 1000 * 60 * cooldown, message.author, abilityTemp);
								}

                return message.channel.send(messageTemp);
              }
            } catch (e) {
              return message.reply(`Something went wrong looking up your character name. Error: ${e}`);
            }
        }
    }
    catch (e) {
    	return message.reply(`Something went wrong looking up that ability. Error: ${e}`);
    }
	},

};

function cooldownMessage(author, abilityTemp) {
	author.send(`The cooldown for your ability ${abilityTemp} is over.`);
}
