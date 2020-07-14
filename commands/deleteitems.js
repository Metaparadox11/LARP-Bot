module.exports = {
	name: 'deleteitems',
	description: 'Deletes all items from game and from inventories and containers.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {

        try {
            const item = await Items.destroy({ where: { guild: message.guild.toString() } });
            if (!item) return message.reply('No items found.');

            try {
                const temp = '';
                const affectedRows = await Inventories.update({ items: temp }, { where: { guild: message.guild.toString() } });
                try {
                    const affectedRows2 = await Containers.update({ items: temp }, { where: { guild: message.guild.toString() } });
                } catch (e) {
                    return message.reply(`Something went wrong with updating a container. Error: ${e}`);
                }
            } catch (e) {
                return message.reply(`Something went wrong with updating an inventory. Error: ${e}`);
            }

            return message.reply(`Deleted all items.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting items. Error: ${e}`);
        }
	},
};
