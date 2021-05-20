module.exports = {
	name: 'makesign',
	description: 'Make a sign and add it to the area.',
  args: true,
  usage: '<active true/false> <name> . <area> . <contents>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

        const activeArg = JSON.parse(args[0]);

        if (typeof activeArg !== 'boolean') {
            return message.reply('Random argument must be true or false.');
        }

        if (typeof args[1] === 'undefined') {
          return message.reply('You need to include a sign name.');
        }

				let hasDivider1 = false;
        let dividerPos1 = 1;
        for (var i = 1; i < args.length; i++) {
            if (args[i] === '.') {
                hasDivider1 = true;
                dividerPos1 = i;
                i = args.length;
            }
        }

				if (!hasDivider1) {
            return message.reply('You need to include a divider between the sign name and area.');
        }

        let nameArg = '';
        for (var i = 1; i < dividerPos1; i++) {
            if (i !== 1) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        if (typeof args[dividerPos1 + 1] === 'undefined') {
            return message.reply('You need to include an area.');
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
            return message.reply('You need to include a divider between the area and contents.');
        }

        let areaArgs = '';
        for (var i = dividerPos1 + 1; i < dividerPos2; i++) {
            if (i !== dividerPos1 + 1) {
                areaArgs += ' ';
            }
            areaArgs += args[i];
        }

				if (typeof args[dividerPos2 + 1] === 'undefined') {
            return message.reply('You need to include contents.');
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
        	const sign = await database[7].create({
        		name: nameArg,
        		area: areaArgs,
        		contents: contentsArgs,
            active: activeArg,
						guild: message.guild.id.toString(),
        	});

          //Check to see area is a real area
          try {
            const area = await database[1].findOne({ where: { name: areaArgs, guild: message.guild.id.toString() } });
            if (!area) {
              return message.reply('You must include a valid area.');
            } else {
              let temp = area.get('signs');
              if (typeof temp === 'undefined') temp = '';
              if (temp !== '') {
                  temp += ','
              }
              temp += nameArg;

              const affectedRows = await database[1].update({ signs: temp }, { where: { name: areaArgs, guild: message.guild.id.toString() } });

              if (affectedRows > 0) {
                return message.reply(`Sign created with name ${sign.name} in area ${sign.area}. Area ${areaArgs} was edited.`);
              }
            }
          } catch (e) {
            return message.reply(`Something went wrong looking up the area. Error: ${e}`);
          }

        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('A sign with that name already exists.');
        	}
        	return message.reply(`Something went wrong with adding a sign. Error: ${e}`);
        }
	},
};
