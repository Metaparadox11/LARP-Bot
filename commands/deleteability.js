module.exports = {
	name: 'deleteability',
	description: 'Deletes an ability and all instances of that ability from the game.',
    args: true,
    usage: '<abilityname>',
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
            const ability = await database[4].destroy({ where: { name: nameArg, guild: message.guild.id.toString() } });
            if (!ability) {
            	return message.reply('You must include a valid ability name.');
            } else {
                try {
                    const inventory = await database[3].findAll({ where: { guild: message.guild.id.toString() } });

                    if (inventory.length > 0) {
                        for (let i = 0; i < inventory.length; i++) {
                            let tempAbilities = inventory[i].get('abilities');
                            let tempID = inventory[i].get('id');

                            if (typeof tempAbilities === 'undefined') tempAbilities = '';

                            let abilities = tempAbilities.split(/,/);

                            let temp = '';
                            let a = 0;
                            for (var j = 0; j < abilities.length; j++) {
                                if (j !== a && abilities[j] !== nameArg) {
                                    temp += ',';
                                    temp += abilities[j];
                                } else if (j === a && abilities[j] !== nameArg) {
                                    temp += abilities[j];
                                } else if (j === a && abilities[j] === nameArg) {
                                    a += 1;
                                }
                            }

                            try {

                                const affectedRows = await database[3].update({ abilities: temp }, { where: { id: tempID, guild: message.guild.id.toString() } });

                                if (affectedRows > 0) {
                                    //return message.reply(`Container ${nameArg} deleted. Area edited to remove container.`);
                                }
                            } catch (e) {
                                return message.reply(`Something went wrong with editing an inventory to remove an ability. Error: ${e}`);
                            }
                        }
                    }


                } catch (e) {
                    return message.reply('Something went wrong with finding an inventory to remove an ability.');
                }

                return message.reply(`Ability ${nameArg} deleted. Inventories updated.`);
            }

        } catch (e) {
            return message.reply(`Something went wrong deleting that ability. Error: ${e}`);
        }
	},
};
