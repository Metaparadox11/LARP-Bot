module.exports = {
	name: 'deleteinventory',
	description: 'Deletes a user\'s character\'s inventory.',
    args: true,
    usage: '<@username>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to delete their inventory!');
        }
        const taggedUser = message.mentions.users.first();

        try {
            const inventory = await Inventories.destroy({ where: { id: taggedUser.id.toString(), guild: message.guild.toString() } });
            if (!inventory) {
            	return message.reply('You must include a valid inventory.');
            } else {
                return message.reply(`${taggedUser}'s inventory deleted.`);
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting that inventory. Error: ${e}`);
        }
	},
};
