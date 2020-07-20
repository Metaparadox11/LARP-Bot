module.exports = {
	name: 'makecontainer',
	description: 'Make a container and add it to the database.',
    args: true,
    usage: '<name> . <area> . <time> <random true/false>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				if (typeof args[0] === 'undefined') {
            return message.reply('You need to include a container name.');
        }

        //----------------

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
            return message.reply('You need to include a divider after the container name.');
        }

        let nameArg = '';
        for (var i = 0; i < dividerPos1; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        if (typeof args[dividerPos1 + 1] === 'undefined') {
            return message.reply('You need to include a container area.');
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
            return message.reply('You need to include a divider after the container area.');
        }

        let areaArg = '';
        for (var i = dividerPos1 + 1; i < dividerPos2; i++) {
            if (i !== dividerPos1 + 1) {
                areaArg += ' ';
            }
            areaArg += args[i];
        }

				const areaTemp = await database[1].findOne({ where: { name: areaArg, guild: message.guild.id.toString() } });
				if (!areaTemp) {
					return message.reply('You must include a valid area.');
				}

        //----------------

        if (typeof args[dividerPos2 + 1] === 'undefined') {
            return message.reply('You need to include a container search time.');
        }

        if (typeof args[dividerPos2 + 2] === 'undefined') {
            return message.reply('You need to include whether searching the container is random.');
        }

        //----------------

        const timeArg = parseInt(args[dividerPos2 + 1]);

        if (typeof timeArg !== 'number') {
            return message.reply('Time argument must be a number.');
        }

        const randomArg = JSON.parse(args[dividerPos2 + 2]);

        if (typeof randomArg !== 'boolean') {
            return message.reply('Random argument must be true or false.');
        }

        //----------------

				const itemsArg = '';

        try {
        	const container = await database[2].create({
        				name: nameArg,
								items: itemsArg,
                time: timeArg,
                random: randomArg,
                area: areaArg,
                guild: message.guild.id.toString(),
        	});

            // check areaArg to see if it exists in Areas

            const area = await database[1].findOne({ where: { name: areaArg, guild: message.guild.id.toString() } });
            if (!area) {
            	//return message.channel.send(area.get('name'));
                return message.reply('You must include a valid area.');
            } else {
                let temp = area.get('containers');
                if (typeof temp === 'undefined') temp = '';
                if (temp !== '') {
                    temp += ','
                }
                temp += nameArg;
                let temp2 = area.get('name');
                //return message.reply(`Setting containers of area ${temp2} to ${temp}`);
                const affectedRows = await database[1].update({ containers: temp }, { where: { name: areaArg, guild: message.guild.id.toString() } });
                //area.upsert(containers: temp);
                if (affectedRows > 0) {
                	return message.reply(`Container created with name ${container.name} in area ${container.area}. Area ${areaArg} was edited.`);
                }
            }

        	return message.reply(`Container created with name ${container.name} in area ${container.area}.`);
        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('That container already exists.');
        	}
        	return message.reply(`Something went wrong with adding a container. Error: ${e}`);
        }
	},
};
