module.exports = {
	name: 'deleteareas',
	description: 'Deletes all areas and associated containers.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {

        try {
            const area = await Areas.destroy({ where: { guild: message.guild.toString() } });
            if (!area) return message.reply('No areas found.');

            try {
                const container = await Containers.destroy({ where: { guild: message.guild.toString() } });
            }
            catch (e) {
            	return message.reply(`Something went wrong deleting containers. Error: ${e}`);
            }

            return message.reply(`Deleted all areas and associated containers.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting areas. Error: ${e}`);
        }
	},
};
