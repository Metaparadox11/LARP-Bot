module.exports = {
	name: 'listmem',
	description: 'List an memory packet\'s data.',
  args: true,
  usage: '<mem name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        //const areaTemp = args[0];
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				let memTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                memTemp += ' ';
            }
            memTemp += args[i];
        }

        try {
            const mem = await database[6].findOne({ where: { name: memTemp, guild: message.guild.id.toString() } });
            if (!mem) {
            	return message.reply('You must include a valid memory packet.');
            } else {
                let triggerTemp = mem.get('trigger');
                if (typeof triggerTemp === 'undefined') triggerTemp = 'none';
                let contentsTemp = mem.get('contents');
                if (typeof contentsTemp === 'undefined') contentsTemp = 'none';
                return message.reply(`\nName: ${memTemp}\nTrigger: ${triggerTemp}\nContents: ${contentsTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that memory packet. Error: ${e}`);
        }
	},
};
