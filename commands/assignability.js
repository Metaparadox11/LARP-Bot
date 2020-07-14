module.exports = {
	name: 'assignability',
	description: 'Assign an ability to an inventory.',
    args: true,
    usage: '<@user> <abilityname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to assign an ability!');
        }
        const taggedUser = message.mentions.users.first();

        if (typeof args[1] === 'undefined') {
            return message.reply('You need to include an ability name.');
        }

        let idArg = taggedUser.id.toString();

        let nameArg = '';
        for (var i = 1; i < args.length; i++) {
            if (i !== 1) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        try {
        	const inventory = await Inventories.findOne({ where: { id: idArg, guild: message.guild.toString() } });
            if (!inventory) {
            	//return message.channel.send(area.get('name'));
                return message.reply('You must tag a valid username.');
            } else {
                let temp = inventory.get('abilities');
                if (typeof temp === 'undefined') temp = '';
                if (temp !== '') {
                    temp += ','
                }
                temp += nameArg;
                const affectedRows = await Inventories.update({ abilities: temp }, { where: { id: idArg, guild: message.guild.toString() } });
                //area.upsert(containers: temp);
                if (affectedRows > 0) {
                	return message.reply(`Ability ${nameArg} assigned to <@${inventory.get('id')}>'s inventory.`);
                }
            }

        	return message.reply(`Something went wrong with assigning an ability.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong with assigning an ability. Error: ${e}`);
        }
	},
};
