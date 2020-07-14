module.exports = {
	name: 'makeability',
	description: 'Make an ability and add it to the database.',
    args: true,
    usage: '<name> . <description> . <effect>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
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
            return message.reply('You need to include a divider between the ability name and description.');
        }

        let nameArg = '';
        for (var i = 0; i < dividerPos1; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        if (typeof args[dividerPos1 + 1] === 'undefined') {
            return message.reply('You need to include an ability description.');
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
            return message.reply('You need to include a divider between the description and effect.');
        }

        let descriptionArgs = '';
        for (var i = dividerPos1 + 1; i < dividerPos2; i++) {
            if (i !== dividerPos1 + 1) {
                descriptionArgs += ' ';
            }
            descriptionArgs += args[i];
        }

		if (typeof args[dividerPos2 + 1] === 'undefined') {
            return message.reply('You need to include an ability effect.');
        }

        //----------------

        let effectArgs = '';
        for (var i = dividerPos2 + 1; i < args.length; i++) {
            if (i !== dividerPos2 + 1) {
                effectArgs += ' ';
            }
            effectArgs += args[i];
        }

        try {
        	const ability = await Abilities.create({
        		name: nameArg,
        		description: descriptionArgs,
        		effect: effectArgs,
				guild: message.guild.toString(),
        	});
        	return message.reply(`Ability ${ability.name} added.`);
        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('That ability already exists.');
        	}
        	return message.reply(`Something went wrong with adding an ability. Error: ${e}`);
        }
	},
};
