module.exports = {
	name: 'deleteinventories',
	description: 'Deletes all inventories.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {

        try {
            const inventory = await Inventories.destroy({ where: { guild: message.guild.toString() } });
            if (!inventory) return message.reply('No inventories found.');
            return message.reply(`Deleted all inventories.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting inventories. Error: ${e}`);
        }
	},
};
