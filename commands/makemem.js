module.exports = {
	name: 'makemem',
	description: 'Make a memory packet and add it to the database.',
  args: true,
  usage: '<name> . <trigger> . <contents>',
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
            return message.reply('You need to include a divider between the mem name and trigger.');
        }

        let nameArg = '';
        for (var i = 0; i < dividerPos1; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        if (typeof args[dividerPos1 + 1] === 'undefined') {
            return message.reply('You need to include a trigger.');
        }

        //----------------

        let hasDivider2 = false;
        let dividerPos2 = 0;
        for (var i = dividerPos1 + 1; i < args.length; i++) {
            if (args[i] === '.') {
                hasDivider2 = true;
                dividerPos2 = i;
                i = args.length;
            }
        }

        if (!hasDivider2) {
            return message.reply('You need to include a divider between the trigger and contents.');
        }

        let triggerArgs = '';
        for (var i = dividerPos1 + 1; i < dividerPos2; i++) {
            if (i !== dividerPos1 + 1) {
                triggerArgs += ' ';
            }
            triggerArgs += args[i];
        }

				if (typeof args[dividerPos2 + 1] === 'undefined') {
            return message.reply('You need to include mem contents.');
        }

        //----------------

        let contentsArgs = '';
        for (var i = dividerPos2 + 1; i < args.length; i++) {
            if (i !== dividerPos2 + 1) {
                contentsArgs += ' ';
            }
            contentsArgs += args[i];
        }

				//----------------

        try {
        	const mem = await database[6].create({
        		name: nameArg,
        		trigger: triggerArgs,
        		contents: contentsArgs,
						guild: message.guild.id.toString(),
        	});
        	return message.reply(`Memory packet ${mem.name} added.`);
        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('A memory packet with that name already exists.');
        	}
        	return message.reply(`Something went wrong with adding a mem. Error: ${e}`);
        }
	},
};
