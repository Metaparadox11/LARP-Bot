module.exports = {
	name: 'deleteitem',
	description: 'Deletes an item and all instances of that item from the game.',
    args: true,
    usage: '<itemname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				let nameArg = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        try {
            const item = await database[0].destroy({ where: { name: nameArg, guild: message.guild.id.toString() } });
            if (!item) {
            	return message.reply('You must include a valid item name.');
            } else {
                try {
                    const inventory = await database[3].findAll({ where: { guild: message.guild.id.toString() } });

                    if (inventory.length > 0) {
                        for (let i = 0; i < inventory.length; i++) {
                            let tempItems = inventory[i].get('items');
                            let tempID = inventory[i].get('id');

                            if (typeof tempItems === 'undefined') tempItems = '';

                            let items = tempItems.split(/,/);

                            let temp = '';
                            let a = 0;
                            for (var j = 0; j < items.length; j++) {
                                if (j !== a && items[j] !== nameArg) {
                                    temp += ',';
                                    temp += items[j];
                                } else if (j === a && items[j] !== nameArg) {
                                    temp += items[j];
                                } else if (j === a && items[j] === nameArg) {
                                    a += 1;
                                }
                            }

                            try {

                                const affectedRows = await database[3].update({ items: temp }, { where: { id: tempID, guild: message.guild.id.toString() } });

                                if (affectedRows > 0) {
                                    //return message.reply(`Container ${nameArg} deleted. Area edited to remove container.`);
                                }
                            } catch (e) {
                                return message.reply(`Something went wrong with editing an inventory to remove an item. Error: ${e}`);
                            }
                        }
                    }


                } catch (e) {
                    return message.reply('Something went wrong with finding an inventory to remove an item.');
                }



                try {
                    const container = await database[2].findAll({ where: { guild: message.guild.id.toString() } });

                    if (container.length > 0) {
                        for (let i = 0; i < container.length; i++) {
                            let tempItems = container[i].get('items');
                            let tempName = container[i].get('name');

                            if (typeof tempItems === 'undefined') tempItems = '';

                            let items = tempItems.split(/,/);

                            let temp = '';
                            let a = 0;
                            for (var j = 0; j < items.length; j++) {
                                if (j !== a && items[j] !== nameArg) {
                                    temp += ',';
                                    temp += items[j];
                                } else if (j === a && items[j] !== nameArg) {
                                    temp += items[j];
                                } else if (j === a && items[j] === nameArg) {
                                    a += 1;
                                }
                            }

                            try {

                                const affectedRows = await database[2].update({ items: temp }, { where: { name: tempName, guild: message.guild.id.toString() } });

                                if (affectedRows > 0) {
                                    //return message.reply(`Container ${nameArg} deleted. Area edited to remove container.`);
                                }
                            } catch (e) {
                                return message.reply(`Something went wrong with editing a container to remove an item. Error: ${e}`);
                            }
                        }
                    }


                } catch (e) {
                    return message.reply('Something went wrong with finding a container to remove an item.');
                }

                return message.reply(`Item ${nameArg} deleted. Inventories and containers updated.`);
            }

        } catch (e) {
            return message.reply(`Something went wrong deleting that item. Error: ${e}`);
        }
	},
};
