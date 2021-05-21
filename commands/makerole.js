module.exports = {
	name: 'makerole',
	description: 'Make a character role.',
  args: true,
  usage: '<name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
		if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
			return message.reply(`You don't have GM permissions.`);
		}

		let name = args[0];
    for (let i = 1; i < args.length; i++) {
      name += ' ' + args[i];
    }

		const Sequelize = require('sequelize');
		const Op = Sequelize.Op;
		try {
			const role = await database[5].findOne({ where: { name: {[Op.like]: name}, guild: message.guild.id.toString() } });
			if (!role) {
				let newRole = await message.guild.roles.create({
		      data: {
		      name: name,
		      color: 'WHITE',
		      mentionable: true,
		      },
		      reason: 'Character Role',
		    })
		      .then(message.reply(`You created a role named ${name}.`))
		      .catch(console.error);

		      let idArg = newRole.id.toString();

					try {
		        const role = await database[5].create({
		          id: idArg,
							name: name,
		          guild: message.guild.id.toString(),
		        });
		      }
		      catch (e) {
		        return message.reply(`Something went wrong with adding a role. Error: ${e}`);
		      }
			} else {
				return message.reply(`A role with that name already exists.`);
			}
		} catch (e) {
			return message.reply(`Something went wrong looking up a role! Error: ${e}`);
		}

	},
};
