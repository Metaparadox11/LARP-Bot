module.exports = {
	name: 'pullitem',
	description: 'Remove an item or items from a container.',
    args: true,
    usage: '<itemname> . <containername>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				if (typeof args[0] === 'undefined') {
            return message.reply('You need to include an item name.');
        }

        let hasDivider = false;
        let dividerPos = 0;
        for (var i = 0; i < args.length; i++) {
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
        for (var i = 0; i < dividerPos; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

				if (typeof args[dividerPos + 1] === 'undefined') {
            return message.reply('You need to include a container name.');
        }

        let containerArg = '';
        for (var i = dividerPos + 1; i < args.length; i++) {
            if (i !== dividerPos + 1) {
                containerArg += ' ';
            }
            containerArg += args[i];
        }

				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
        	const item = await database[0].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
            if (!item) {
            	return message.reply('You must name a valid item.');
            } else {
								nameArg = item.get('name');

				        try {
				            const container = await database[2].findOne({ where: { name: {[Op.like]: containerArg}, guild: message.guild.id.toString() } });
				            if (!container) {
				            	return message.reply('You must include a valid container.');
				            } else {
											containerArg = container.get('name');

											let tempItems = container.get('items');

			                if (typeof tempItems === 'undefined') tempItems = '';

			                let items = tempItems.split(/,/);

											let temp = '';
											let pos = -1;
											for (let i = 0; i < items.length; i++) {
													if (items[i] === nameArg) {
														pos = i;
														i = items.length;
													}
											}
											if (pos === -1) {
												return message.reply(`That container don't have item ${nameArg}.`);
											}
											items.splice(pos, 1);
											for (let i = 0; i < items.length; i++) {
												temp += items[i];
												if (i !== items.length - 1) {
													temp += ',';
												}
											}

			                try {
			                    const affectedRows = await database[2].update({ items: temp }, { where: { name: containerArg, guild: message.guild.id.toString() } });

			                    if (affectedRows > 0) {
			                    	return message.reply(`One of item ${nameArg} removed from container ${containerArg}.`);
			                    }
			                } catch (e) {
			                    return message.reply(`Something went wrong with removing an item from a container. Error: ${e}`);
			                }
				            }
				        }
				        catch (e) {
				        	return message.reply(`Something went wrong looking up that container. Error: ${e}`);
				        }

            }

        	return message.reply(`Something went wrong with removing an item from a container.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong with checking for an item. Error: ${e}`);
        }
	},
};
