module.exports = {
	name: 'listabilities',
	description: 'List all abilities.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {

        try {
            const ability = await Abilities.findAll({ where: { guild: message.guild.toString() } });
            if (!ability) {
            	return message.reply('No abilities found.');
            } else {
                let messageTemp = '';
                for (let i = 0; i < ability.length; i++) {
                    let nameTemp = ability[i].get('name');
                    let descriptionTemp = ability[i].get('description');
                    let effectTemp = ability[i].get('effect');
                    messageTemp += `\nName: ${nameTemp}\nDescription: ${descriptionTemp}\nEffect: ${effectTemp}\n`;
                }
								if (ability.length === 0) {
									messageTemp = 'No abilities found.';
								}
                return message.reply(messageTemp);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up an ability. Error: ${e}`);
        }
	},
};
