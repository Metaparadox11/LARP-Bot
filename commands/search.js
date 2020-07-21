module.exports = {
	name: 'search',
	description: 'List the current channel\'s areas.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
		let channelTemp = message.channel;

        try {
            const area = await database[1].findAll({ where: { channel: channelTemp.name, guild: message.guild.id.toString() } });
            if (!area) {
            	return message.reply('There are no areas associated with this channel.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < area.length; i++) {
                    let nameTemp = area[i].get('name');
                    let containersTemp = area[i].get('containers');
                    if (typeof containersTemp === 'undefined') containersTemp = 'none';
										let signsTemp = area[i].get('signs');
		                if (typeof signsTemp === 'undefined') signsTemp = 'none';
										//check if signs are active and add them to the list if they are
										let signsActive = '';
										let signs = signsTemp.split(/,/);
										for (let j = 0; j < signs.length; j++) {
											try {
												const sign = await database[7].findOne({ where: { name: signs[j], guild: message.guild.id.toString() } });
												if (sign) {
													if (sign.get('active') === true) {
														if (signsActive !== '') {
															signsActive += ',';
														}
														signsActive += sign.get('name');
													}
												}
											} catch (e) {
												return message.reply(`Something went wrong looking up a sign. Error: ${e}`);
											}
										}

                    messageTemp += `\nName: ${nameTemp}\nContainers: ${containersTemp}\nSigns: ${signsActive}\n`;
                }
								if (area.length === 0) {
									messageTemp = 'No areas found.';
								}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up areas. Error: ${e}`);
        }
	},
};
