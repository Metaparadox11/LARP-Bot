module.exports = {
	name: 'listability',
	description: 'List an ability\'s data.',
  args: true,
  usage: '<abilityname>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        //const areaTemp = args[0];
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				let abilityTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                abilityTemp += ' ';
            }
            abilityTemp += args[i];
        }

				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
            const ability = await database[4].findOne({ where: { name: {[Op.like]: abilityTemp}, guild: message.guild.id.toString() } });
            if (!ability) {
            	return message.reply('You must include a valid ability.');
            } else {
								abilityTemp = ability.get('name');
                let descriptionTemp = ability.get('description');
                if (typeof descriptionTemp === 'undefined') descriptionTemp = 'none';
                let effectTemp = ability.get('effect');
                if (typeof effectTemp === 'undefined') effectTemp = 'none';
                return message.reply(`\nAbility: ${abilityTemp}\nDecription: ${descriptionTemp}\nEffect: ${effectTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that ability. Error: ${e}`);
        }
	},
};
