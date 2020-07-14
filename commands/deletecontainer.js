module.exports = {
	name: 'deletecontainer',
	description: 'Deletes a container.',
    args: true,
    usage: '<containername>',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {
        let nameArg = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                nameArg += ' ';
            }
            nameArg += args[i];
        }

        try {
            const container = await Containers.findOne({ where: { name: nameArg, guild: message.guild.toString() } });
            if (!container) {
            	return message.reply('You must include a valid container name.');
            }
            let tempArea = container.get('area');

            try {
                const container2 = await Containers.destroy({ where: { name: nameArg, guild: message.guild.toString() } });
                if (!container2) {
                	return message.reply('You must include a valid container name.');
                } else {

                    try {
                        const area = await Areas.findOne({ where: { name: tempArea, guild: message.guild.toString() } });

                        let tempContainers = area.get('containers');

                        if (typeof tempContainers === 'undefined') tempContainers = '';

                        let containers = tempContainers.split(/,/);

                        let temp = '';
                        let a = 0;
                        for (var i = 0; i < containers.length; i++) {
                            if (i !== a && containers[i] !== nameArg) {
                                temp += ',';
                                temp += containers[i];
                            } else if (i === a && containers[i] !== nameArg) {
                                temp += containers[i];
                            } else if (i === a && containers[i] === nameArg) {
                                a += 1;
                            }
                        }

                        try {

                            const affectedRows = await Areas.update({ containers: temp }, { where: { name: tempArea, guild: message.guild.toString() } });

                            if (affectedRows > 0) {
                            	return message.reply(`Container ${nameArg} deleted. Area edited to remove container.`);
                            }
                        } catch (e) {
                            return message.reply(`Something went wrong with editing an area to remove a container. Error: ${e}`);
                        }
                    } catch (e) {
                        return message.reply('Something went wrong with finding an area to remove a container.');
                    }

                    return message.reply(`Container ${nameArg} deleted.`);
                }
            }
            catch (e) {
            	return message.reply(`Something went wrong deleting that container. Error: ${e}`);
            }
        } catch (e) {
            return message.reply(`Something went wrong deleting that container. Error: ${e}`);
        }
	},
};
