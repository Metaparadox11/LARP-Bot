module.exports = {
	name: 'useability',
	description: 'Uses an ability with an optional target.',
  args: true,
  usage: '<@user (optional)> <abilityname>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
    let x = 1;
    if (!message.mentions.users.size) {
      x = 0;
    }

    const taggedUser = message.mentions.users.first();

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
    if (typeof taggedUser !== 'undefined') {
      idArg = taggedUser.id.toString();
    }

    try {
        const ability = await database[4].findOne({ where: { name: nameArg, guild: message.guild.id.toString() } });
        if (!ability) {
        	 return message.reply('You must include a valid ability.');
        } else {
            try {
              const inventory = await database[3].findOne({ where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });
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
                  messageTemp += ` on <@${idArg}> by ${nameTemp} with effect: ${effectTemp}`;
                } else {
                  messageTemp += ` by ${nameTemp} with effect: ${effectTemp}`;
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
