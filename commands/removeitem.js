module.exports = {
	name: 'removeitem',
	description: 'Remove an item or items from an inventory.',
    args: true,
    usage: '<@user> <number> <itemname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to delete items!');
        }
        const taggedUser = message.mentions.users.first();
        let idArg = taggedUser.id.toString();

        if (typeof args[1] === 'undefined') {
            return message.reply('You need to include a number.');
        }

        const numberArg = parseInt(args[1]);
				if (typeof numberArg !== 'number') {
            return message.reply('Number argument must be a number.');
        }

        if (numberArg <= 0) {
            return message.reply('Number argument must be a number > 0.');
        }

        if (typeof args[2] === 'undefined') {
            return message.reply('You need to include an item name.');
        }

        let nameArg = '';
        for (var i = 2; i < args.length; i++) {
            if (i !== 2) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

		try {
        	const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
            if (!inventory) {
            	return message.reply('You must tag a valid username.');
            } else {
                let tempItems = inventory.get('items');

                if (typeof tempItems === 'undefined') tempItems = '';

                let items = tempItems.split(/,/);

                let temp = '';
                let a = 0;
                let maxA = numberArg - 1;
                let countDeleted = 0;
                for (var i = 0; i < items.length; i++) {
                    if (i !== a && items[i] !== nameArg) {
                        temp += ',';
                        temp += items[i];
                    } else if (i === a && items[i] !== nameArg) {
                        temp += items[i];
                    } else if (i === a && items[i] === nameArg) {
                        if (a < maxA) {
                            a += 1;
                            countDeleted += 1;
                        } else {
                            temp += items[i];
                        }
                    } else if (i !== a && items[i] === nameArg) {
                        countDeleted += 1;
                    }
                }

                try {
                    const affectedRows = await database[3].update({ items: temp }, { where: { id: idArg, guild: message.guild.id.toString() } });

                    if (affectedRows > 0) {
                    	return message.reply(`${countDeleted} of item ${nameArg} deleted from <@${inventory.get('id')}>'s inventory.`);
                    }
                } catch (e) {
                    return message.reply(`Something went wrong with deleting an item from an inventory. Error: ${e}`);
                }
            }

        	return message.reply(`Something went wrong with assigning an item.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong with assigning an item. Error: ${e}`);
        }
	},
};
