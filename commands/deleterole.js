module.exports = {
	name: 'deleterole',
	description: 'Delete a character role.',
  args: true,
  usage: '<name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
		if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
			return message.reply(`You don't have GM permissions.`);
		}

		if (!message.mentions.roles.size) {
      let name = args[0];
      for (let i = 1; i < args.length; i++) {
        name += ' ' + args[i];
      }

			const Sequelize = require('sequelize');
			const Op = Sequelize.Op;
      try {
				 const role = await database[5].findOne({ where: { name: {[Op.like]: name}, guild: message.guild.id.toString() } });
				 if (!role) {
					 return message.reply(`That role doesn't exist!`);
				 } else {
					 name = role.get('name');
					 let tempId = role.get('id');
					 let taggedRole = await message.guild.roles.fetch(tempId);

           try {
             const role2 = await database[5].destroy({ where: { id: taggedRole.id.toString(), guild: message.guild.id.toString() } });
             if (!role2) {
               return message.reply(`That role doesn't exist.`);
             } else {
               taggedRole.delete();
               return message.reply(`${taggedRole.name} role deleted.`);
             }
           }
           catch (e) {
             return message.reply(`Something went wrong deleting that role. Error: ${e}`);
           }
				 }
			} catch (e) {
				return message.reply(`You need to include a valid role name! Error: ${e}`);
			}
    } else {
      let taggedRole = message.mentions.roles.first();
      try {
        const role = await database[5].destroy({ where: { id: taggedRole.id.toString(), guild: message.guild.id.toString() } });
        if (!role) {
          return message.reply(`That role doesn't exist.`);
        } else {
          taggedRole.delete();
          return message.reply(`${taggedRole.name} role deleted.`);
        }
      }
      catch (e) {
        return message.reply(`Something went wrong deleting that role. Error: ${e}`);
      }
    }


	},
};
