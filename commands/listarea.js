module.exports = {
	name: 'listarea',
	description: 'List an area\'s data.',
    args: true,
    usage: '<areaname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
        //const areaTemp = args[0];
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				let areaTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                areaTemp += ' ';
            }
            areaTemp += args[i];
        }

				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
            const area = await database[1].findOne({ where: { name: {[Op.like]: areaTemp}, guild: message.guild.id.toString() } });
            if (!area) {
            	return message.reply('You must include a valid area.');
            } else {
								areaTemp = area.get('name');
                let channelTemp = message.guild.channels.cache.find(channel => channel.name === area.get('channel'));
                let containersTemp = area.get('containers');
                if (typeof containersTemp === 'undefined') containersTemp = 'none';
								let signsTemp = area.get('signs');
                if (typeof signsTemp === 'undefined') signsTemp = 'none';
                return message.reply(`\nArea: ${areaTemp}\nChannel: ${channelTemp}\nContainers: ${containersTemp}\nSigns: ${signsTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that area. Error: ${e}`);
        }
	},
};
