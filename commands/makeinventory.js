module.exports = {
	name: 'makeinventory',
	description: 'Make an inventory and add it to the database.',
    args: true,
    usage: '<@username> <name>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to make their inventory!');
        }
        const taggedUser = message.mentions.users.first();

        if (typeof args[1] === 'undefined') {
            return message.reply('You need to include a character name.');
        }

        let nameArg = '';
        for (var i = 1; i < args.length; i++) {
            if (i !== 1) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        const idArg = taggedUser.id.toString();
        //return message.reply(idArg);
        const itemsArg = '';
        const abilitiesArg = '';

        try {
        	const inventory = await database[3].create({
        		id: idArg,
                items: itemsArg,
                abilities: abilitiesArg,
                name: nameArg,
                guild: message.guild.id.toString(),
        	});
        	return message.reply(`Inventory created for ${inventory.name}.`);
        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('That inventory already exists.');
        	}
        	return message.reply(`Something went wrong with adding an inventory. Error: ${e}`);
        }
	},
};
