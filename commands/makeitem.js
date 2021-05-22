module.exports = {
	name: 'makeitem',
	description: 'Make an item and add it to the database.',
  args: true,
  usage: '<name> . <bulky integer> <description> . <contents (optional)>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

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

				let hasDivider2 = false;
        let dividerPos2 = 0;
        for (var i = dividerPos1 + 1; i < args.length; i++) {
            if (args[i] === '.') {
                hasDivider2 = true;
                dividerPos2 = i;
                i = args.length;
            }
        }

				let descriptionArgs = '';
				if (!hasDivider2) dividerPos2 = args.length;
        for (var i = dividerPos1 + 2; i < dividerPos2; i++) {
            if (i !== dividerPos1 + 2) {
                descriptionArgs += ' ';
            }
            descriptionArgs += args[i];
        }

				//----------------

				let contentsArgs = '';
        if (hasDivider2) {
					for (var i = dividerPos2 + 1; i < args.length; i++) {
	            if (i !== dividerPos2 + 1) {
	                contentsArgs += ' ';
	            }
	            contentsArgs += args[i];
	        }
        }

				//check to see item with this name doesn't already exist
				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
            const item = await database[0].findOne({ where: { name: {[Op.like]: nameArg}, guild: message.guild.id.toString() } });
            if (!item) {

							try {
			        	const item = await database[0].create({
			        		name: nameArg,
			        		bulky: bulkyArg,
			        		description: descriptionArgs,
									contents: contentsArgs,
									guild: message.guild.id.toString(),
			        	});
			        	return message.reply(`Item ${nameArg} added.`);
			        }
			        catch (e) {
			        	return message.reply(`Something went wrong with adding an item. Error: ${e}`);
			        }

            } else {
							return message.reply('An item with that name already exists.');
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up an item. Error: ${e}`);
        }

	},
};
