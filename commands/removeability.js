module.exports = {
	name: 'removeability',
	description: 'Delete an ability from an inventory.',
    args: true,
    usage: '<@user> <abilityname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to delete an ability!');
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
            	return message.reply('You must tag a valid username.');
            } else {
                let tempAbils = inventory.get('abilities');

                if (typeof tempAbils === 'undefined') tempAbils = '';

                let abils = tempAbils.split(/,/);

                let temp = '';
                let a = 0;
                for (var i = 0; i < abils.length; i++) {
                    if (i !== a && abils[i] !== nameArg) {
                        temp += ',';
                        temp += abils[i];
                    } else if (i === a && abils[i] !== nameArg) {
                        temp += abils[i];
                    } else if (i === a && abils[i] === nameArg) {
                        a += 1;
                    }
                }

                try {
                    const affectedRows = await Inventories.update({ abilities: temp }, { where: { id: idArg, guild: message.guild.toString() } });

                    if (affectedRows > 0) {
                    	return message.reply(`Ability ${nameArg} deleted from <@${inventory.get('id')}>'s inventory.`);
                    }
                } catch (e) {
                    return message.reply(`Something went wrong with deleting an item from an inventory. Error: ${e}`);
                }
            }

        	return message.reply(`Something went wrong with deleting an item from an inventory.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong with deleting an item from an inventory. Error: ${e}`);
        }
	},
};
