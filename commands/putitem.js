module.exports = {
	name: 'putitem',
	description: 'Put an item or items in a container.',
    args: true,
    usage: '<number> <itemname> . <containername>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        const numberArg = parseInt(args[0]);
		if (typeof numberArg !== 'number') {
            return message.reply('Number argument must be a number.');
        }

		if (numberArg <= 0) {
            return message.reply('Number argument must be a number > 0.');
        }

        if (typeof args[1] === 'undefined') {
            return message.reply('You need to include an item name.');
        }

        let hasDivider = false;
        let dividerPos = 0;
        for (var i = 1; i < args.length; i++) {
            if (args[i] === '.') {
                hasDivider = true;
                dividerPos = i;
                i = args.length;
            }
        }

        if (!hasDivider) {
            return message.reply('You need to include a divider after the item name.');
        }

        let nameArg = '';
        for (var i = 1; i < dividerPos; i++) {
            if (i !== 1) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        let containerArg = '';
        for (var i = dividerPos + 1; i < args.length; i++) {
            if (i !== dividerPos + 1) {
                containerArg += ' ';
            }
            containerArg += args[i];
        }

        try {
        	const container = await Containers.findOne({ where: { name: containerArg, guild: message.guild.toString() } });
            if (!container) {
            	//return message.channel.send(area.get('name'));
                return message.reply('You must name a valid container.');
            } else {

                let temp = container.get('items');
                if (typeof temp === 'undefined') temp = '';
                for (var i = 0; i < numberArg; i++) {
                    if (temp !== '') {
                        temp += ','
                    }
                    temp += nameArg;
                }
				try {
	                const affectedRows = await Containers.update({ items: temp }, { where: { name: containerArg, guild: message.guild.toString() } });
	                //area.upsert(containers: temp);
	                if (affectedRows > 0) {
	                	return message.reply(`${numberArg} of item ${nameArg} assigned to container ${containerArg}.`);
	                }
				} catch (e) {
					return message.reply(`Something went wrong with assigning an item. Error: ${e}`);
				}
            }

        	return message.reply(`Something went wrong with assigning an item.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong with assigning an item. Error: ${e}`);
        }
	},
};
