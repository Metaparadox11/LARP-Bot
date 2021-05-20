module.exports = {
	name: 'listcontainer',
	description: 'List a container\'s data.',
  args: true,
  usage: '<containername>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				let containerTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                containerTemp += ' ';
            }
            containerTemp += args[i];
        }

				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
            const container = await database[2].findOne({ where: { name: {[Op.like]: containerTemp}, guild: message.guild.id.toString() } });
            if (!container) {
            	return message.reply('You must include a valid container.');
            } else {
								containerTemp = container.get('name');
								let itemsTemp = container.get('items');
								let timeTemp = container.get('time');
                if (typeof timeTemp === 'undefined') timeTemp = '0';
                let randomTemp = container.get('random');
                if (typeof randomTemp === 'undefined') randomTemp = 'false';
                let areaTemp = container.get('area');
                if (typeof areaTemp === 'undefined') areaTemp = 'none';
								let descriptionTemp = container.get('text');
                if (typeof descriptionTemp === 'undefined') descriptionTemp = 'none';
                return message.reply(`\nName: ${containerTemp}\nDescription: ${descriptionTemp}\nItems: ${itemsTemp}\nTime: ${timeTemp}\nRandom: ${randomTemp}\nArea: ${areaTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that container. Error: ${e}`);
        }
	},
};
