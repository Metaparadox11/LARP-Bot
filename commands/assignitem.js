module.exports = {
	name: 'assignitem',
	description: 'Assign an item or items to an inventory.',
    args: true,
    usage: '<@user> <number> <itemname>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {
      if (!message.mentions.users.size) {
       return message.reply('You need to tag a user in order to assign items!');
      }
      const taggedUser = message.mentions.users.first();
      let idArg = taggedUser.id.toString();

      if (typeof args[1] === 'undefined') {
          return message.reply('You need to include a number.');
      }

      const numberArg = parseInt(args[1]);
			if (typeof numberArg !== 'number') {
          return message.reply('Number argument must be a number.');
      }

      if (typeof args[2] === 'undefined') {
          return message.reply('You need to include an item name.');
      }

      let nameArg = '';
      for (var i = 2; i < args.length; i++) {
          if (i !== 2) {
              nameArg += ' ';
          }
          nameArg += args[i];
      }

	//TODO: count number of bulky items and only add if there's < 2

      try {
      	const inventory = await database[3].findOne({ where: { id: idArg, guild: message.guild.id.toString() } });
          if (!inventory) {
          	//return message.channel.send(area.get('name'));
              return message.reply('You must tag a valid username.');
          } else {

              let temp = inventory.get('items');
              if (typeof temp === 'undefined') temp = '';
              for (var i = 0; i < numberArg; i++) {
                  if (temp !== '') {
                      temp += ','
                  }
                  temp += nameArg;
              }
							try {
                const affectedRows = await database[3].update({ items: temp }, { where: { id: idArg, guild: message.guild.id.toString() } });
                //area.upsert(containers: temp);
                if (affectedRows > 0) {
                	return message.reply(`${numberArg} of item ${nameArg} assigned to <@${inventory.get('id')}>'s inventory.`);
                }
							} catch (e) {
								return message.reply(`Something went wrong with assigning an item. Error: ${e}`);
							}
          }

      	return message.reply(`Something went wrong with assigning an item.`);
      }
      catch (e) {
      	return message.reply(`Something went wrong with assigning an item. Error: ${e}`);
      }
	},
};
