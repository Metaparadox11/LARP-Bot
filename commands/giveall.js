module.exports = {
	name: 'giveall',
	description: 'Give all items in your inventory to a user.',
  args: true,
  usage: '<user>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
      if (!message.mentions.users.size) {
       return message.reply('You need to tag a user in order to give them something!');
      }
      const taggedUser = message.mentions.users.first();

      if (taggedUser === message.author) {
        return message.reply(`You can't give your items to yourself.`);
      }

      try {
          const yourInventory = await database[3].findOne({ where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });
          if (!yourInventory) {
            return message.reply('You must include a valid inventory.');
          } else {
              let itemsTempYours = yourInventory.get('items');
              if (typeof itemsTempYours === 'undefined') {
                return message.reply(`You don't have any items to give.`);
              }

              // Add items to tagged user's inventory
              try {
                const theirInventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
                if (!theirInventory) {
                  return message.reply(`That user doesn't have an inventory.`);
                } else {
                  let yourItems = yourInventory.get('items');
                  let theirItems = theirInventory.get('items');
                  let temp = '';
                  if (theirItems === '') {
                    temp = yourItems;
                  } else {
                    temp = theirItems + ',' + yourItems;
                  }

                  try {
  	                const affectedRows = await database[3].update({ items: temp }, { where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });

  	                if (affectedRows === 0) {
  	                	return message.reply(`Something went wrong with updating their items.`);
  	                }
  								} catch (e) {
  									return message.reply(`Something went wrong with updating their items. Error: ${e}`);
  								}
                }
              }
              catch (e) {
                return message.reply(`Something went wrong looking up the other user's inventory. Error: ${e}`);
              }

              // Delete items from your inventory
              try {
                let temp = '';
                const affectedRows = await database[3].update({ items: temp }, { where: { id: message.author.id.toString(), guild: message.guild.id.toString() } });

                if (affectedRows === 0) {
                  return message.reply(`Something went wrong with updating your items.`);
                }
              } catch (e) {
                return message.reply(`Something went wrong removing items from your inventory. Error: ${e}`);
              }

          }
      }
      catch (e) {
        return message.reply(`Something went wrong looking up that inventory. Error: ${e}`);
      }

      message.reply(`You gave ${taggedUser} all your items.`);
	},
};
