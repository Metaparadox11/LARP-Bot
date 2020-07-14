module.exports = {
	name: 'listcontainer',
	description: 'List a container\'s data.',
    args: true,
    usage: '<containername>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        let containerTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                containerTemp += ' ';
            }
            containerTemp += args[i];
        }

        try {
            const container = await Containers.findOne({ where: { name: containerTemp, guild: message.guild.toString() } });
            if (!container) {
            	return message.reply('You must include a valid container.');
            } else {
								let itemsTemp = container.get('items');
								let timeTemp = container.get('time');
                if (typeof timeTemp === 'undefined') timeTemp = '0';
                let randomTemp = container.get('random');
                if (typeof randomTemp === 'undefined') randomTemp = 'false';
                let areaTemp = container.get('area');
                if (typeof areaTemp === 'undefined') areaTemp = 'none';
                return message.reply(`\nName: ${containerTemp}\nItems: ${itemsTemp}\nTime: ${timeTemp}\nRandom: ${randomTemp}\nArea: ${areaTemp}`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that container. Error: ${e}`);
        }
	},
};
