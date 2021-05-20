module.exports = {
	name: 'listsign',
	description: 'List a sign\'s data.',
  args: true,
  usage: '<signname>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				let signTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                signTemp += ' ';
            }
            signTemp += args[i];
        }

				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
            const sign = await database[7].findOne({ where: { name: {[Op.like]: signTemp}, guild: message.guild.id.toString() } });
            if (!sign) {
            	return message.reply('You must include a valid sign.');
            } else {
								signTemp = sign.get('name');
								let areaTemp = sign.get('area');
                let contentsTemp = sign.get('contents');
                let activeTemp = sign.get('active');
                return message.reply(`\nName: ${signTemp}\nContents: ${contentsTemp}\nActive: ${activeTemp}\nArea: ${areaTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that sign. Error: ${e}`);
        }
	},
};
