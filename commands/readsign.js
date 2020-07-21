module.exports = {
	name: 'readsign',
	contents: 'Read a sign\'s contents.',
  args: true,
  usage: '<sign name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        let signTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                signTemp += ' ';
            }
            signTemp += args[i];
        }

        try {
            const sign = await database[7].findOne({ where: { name: signTemp, guild: message.guild.id.toString() } });
            if (!sign) {
            	return message.reply('You must include a valid sign.');
            } else {
                //Make sure message is in the right channel
                let thisChannel = message.channel.name;
    						let signArea = sign.get('area');
    						try {
    							const area = await database[1].findOne({ where: { name: signArea, guild: message.guild.id.toString() } });
    							if (!area) {
    								return message.reply(`No area contains this sign.`);
    							}
    							let areaChannel = area.get('channel');
    							if (areaChannel !== thisChannel) {
    								return message.reply(`You aren't in the right area to read that sign.`);
    							}
    						} catch (e) {
    							return message.reply(`Something went wrong with getting the area's channel. Error: ${e}`);
    						}

                //Check if sign is active
                let signActive = sign.get('active');
                if (!signActive) {
                  return message.reply(`You can't read an inactive sign.`);
                }

                let contentsTemp = sign.get('contents');
                if (typeof contentsTemp === 'undefined') contentsTemp = 'none';
                return message.reply(`\nName: ${signTemp}\nContents: ${contentsTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that sign. Error: ${e}`);
        }
	},
};
