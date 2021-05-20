module.exports = {
	name: 'listitem',
	description: 'List an item\'s data.',
  args: true,
  usage: '<itemname>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        let itemTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                itemTemp += ' ';
            }
            itemTemp += args[i];
        }
				
				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
            const item = await database[0].findOne({ where: { name: {[Op.like]: itemTemp}, guild: message.guild.id.toString() } });
            if (!item) {
            	return message.reply('You must include a valid item.');
            } else {
							if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
                let bulkyTemp = item.get('bulky');
                if (typeof bulkyTemp === 'undefined') bulkyTemp = '0';
                let descriptionTemp = item.get('description');
								let nameTemp = item.get('name');
                if (typeof descriptionTemp === 'undefined') descriptionTemp = 'none';
								//let contentsTemp = item.get('contents');
                //if (typeof contentsTemp === 'undefined') contentsTemp = 'none';
                return message.reply(`\nName: ${nameTemp}\nBulky: ${bulkyTemp}\nDescription: ${descriptionTemp}`);
							} else {
								let bulkyTemp = item.get('bulky');
                if (typeof bulkyTemp === 'undefined') bulkyTemp = '0';
                let descriptionTemp = item.get('description');
                if (typeof descriptionTemp === 'undefined') descriptionTemp = 'none';
								let contentsTemp = item.get('contents');
								let nameTemp = item.get('name');
                if (typeof contentsTemp === 'undefined') contentsTemp = 'none';
                return message.reply(`\nName: ${nameTemp}\nBulky: ${bulkyTemp}\nDescription: ${descriptionTemp}\nContents: ${contentsTemp}`);
							}
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that item. Error: ${e}`);
        }
	},
};
