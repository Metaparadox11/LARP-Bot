module.exports = {
	name: 'makeitem',
	description: 'Make an item and add it to the database.',
    args: true,
    usage: '<name> . <bulky integer> <description>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
        let hasDivider1 = false;
        let dividerPos1 = 0;
        for (var i = 0; i < args.length; i++) {
            if (args[i] === '.') {
                hasDivider1 = true;
                dividerPos1 = i;
                i = args.length;
            }
        }

				if (!hasDivider1) {
            return message.reply('You need to include a divider between the item name and bulkiness argument.');
        }

        let nameArg = '';
        for (var i = 0; i < dividerPos1; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        if (typeof args[dividerPos1 + 1] === 'undefined') {
            return message.reply('You need to include a bulkiness argument.');
        }

				const bulkyArg = parseInt(args[dividerPos1 + 1]);

				if (Number.isInteger(bulkyArg) == false) {
		            return message.reply('You need to include an integer bulkiness argument.');
		        }

				if (typeof args[dividerPos1 + 2] === 'undefined') {
		            return message.reply('You need to include an item description.');
		        }

				let descriptionArgs = '';
				for (var i = dividerPos1 + 2; i < args.length; i++) {
            if (i !== dividerPos1 + 2) {
                descriptionArgs += ' ';
            }
            descriptionArgs += args[i];
        }

        try {
        	const item = await database[0].create({
        		name: nameArg,
        		bulky: bulkyArg,
        		description: descriptionArgs,
						guild: message.guild.id.toString(),
        	});
        	return message.reply(`Item ${item.name} added.`);
        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('That item already exists.');
        	}
        	return message.reply(`Something went wrong with adding an item. Error: ${e}`);
        }
	},
};
