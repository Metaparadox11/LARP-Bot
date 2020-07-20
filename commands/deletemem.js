module.exports = {
	name: 'deletemem',
	description: 'Deletes a memory packet and all instances of that memory packet from the game.',
  args: true,
  usage: '<mem name>',
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
            const mem = await database[6].destroy({ where: { name: nameArg, guild: message.guild.id.toString() } });
            if (!mem) {
            	return message.reply('You must include a valid memory packet name.');
            } else {
                try {
                    const inventory = await database[3].findAll({ where: { guild: message.guild.id.toString() } });

                    if (inventory.length > 0) {
                        for (let i = 0; i < inventory.length; i++) {
                            let tempmems = inventory[i].get('mems');
                            let tempID = inventory[i].get('id');

                            if (typeof tempmems === 'undefined') tempmems = '';

                            let mems = tempmems.split(/,/);

                            let temp = '';
                            let a = 0;
                            for (var j = 0; j < mems.length; j++) {
                                if (j !== a && mems[j] !== nameArg) {
                                    temp += ',';
                                    temp += mems[j];
                                } else if (j === a && mems[j] !== nameArg) {
                                    temp += mems[j];
                                } else if (j === a && mems[j] === nameArg) {
                                    a += 1;
                                }
                            }

                            try {

                                const affectedRows = await database[3].update({ mems: temp }, { where: { id: tempID, guild: message.guild.id.toString() } });

                            } catch (e) {
                                return message.reply(`Something went wrong with editing an inventory to remove a memory packet. Error: ${e}`);
                            }
                        }
                    }


                } catch (e) {
                    return message.reply('Something went wrong with finding an inventory to remove a memory packet.');
                }

                return message.reply(`Memory packet ${nameArg} deleted. Inventories updated.`);
            }

        } catch (e) {
            return message.reply(`Something went wrong deleting that memory packet. Error: ${e}`);
        }
	},
};
