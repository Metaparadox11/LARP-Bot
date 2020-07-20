module.exports = {
	name: 'memtriggers',
	description: 'List all your memory packet triggers.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {

        let roleId = '';
        try {
            const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });
            if (!roles) {
              return message.reply('No roles found.');
            } else {
              let tempId = '';
              for (let i = 0; i < roles.length; i++) {
                tempId = roles[i].get('id');
                let author = message.member;
                if (author.roles.cache.has(tempId)) {
                  roleId = tempId;
                  i = roles.length;
                }
              }
              if (roleId === '') return message.reply(`You don't have a role.`);
            }
        }
        catch (e) {
          return message.reply(`Something went wrong looking up roles. Error: ${e}`);
        }

        const taggedUser = await message.guild.roles.fetch(roleId);

        try {
            const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
            if (!inventory) {
            	return message.reply('You must have a valid inventory.');
            } else {
                let memsTemp = inventory.get('mems');
                let mems = memsTemp.split(/,/);
                let mainMessages = [];

                for (let i = 0; i < mems.length; i++) {
                  try {
                    const mem = await database[6].findOne({ where: { name: mems[i], guild: message.guild.id.toString() } });
                    if (mem) {
                      mainMessages[mainMessages.length] = await message.channel.send(`\nMemory Packet: ${mems[i]}\nTrigger: ${mem.get('trigger')}\n`);
                    }
                  } catch (e) {
                    return message.reply(`Something went wrong looking up your memory packets. Error: ${e}`);
                  }
                }

                const message2 = await message.channel.send("Delete message? React 👌 to delete.");
                message2.react('👌');

                const filter = (reaction, user) => {
                	return reaction.emoji.name === '👌' && user.id === message.author.id;
                };

                const collector = message2.createReactionCollector(filter, { time: 100000 });

                collector.on('collect', async (reaction, reactionCollector) => {
                  for (let m = 0; m < mainMessages.length; m++) {
                    await mainMessages[m].delete();
                  }
                  await message2.delete();
                });
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up your inventory. Error: ${e}`);
        }

	},
};
