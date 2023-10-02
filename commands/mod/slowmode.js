const ms = require("ms");

module.exports = {
    name: "slowmode",
    category: 'mod',
    description: "Set the slowmode for the channel!",
    aliases: ['sm'],
    async execute(client, msg, args) {
        if (!msg.member.permissions.has('MANAGE_CHANNELS')) {
            return msg.channel.send("You don't have permission to use this command. (MANAGE_CHANNELS)").then(m => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        }

        if (!args[0]) {
            return msg.channel.send("You did not specify a time!").then(m => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        }

        const currentCooldown = msg.channel.rateLimitPerUser;
        const reason = args[1] ? args.slice(1).join(' ') : 'no reason';

        if (args[0] === 'off') {
            if (currentCooldown === 0) {
                return msg.channel.send("Slowmode is already disabled").then(m => {
                    setTimeout(() => {
                        m.delete();
                    }, 5000);
                });
            }

            return msg.channel.setRateLimitPerUser(0, reason).then(() => {
                msg.channel.send("Slowmode Disabled").then(m => {
                    setTimeout(() => {
                        m.delete();
                    }, 5000);
                });
            });
        }

        const time = ms(args[0]) / 1000;

        if (isNaN(time)) {
            return msg.channel.send("Not a valid time, please try again!").then(m => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        }

        if (time >= 21600) {
            return msg.channel.send("That slowmode limit is too high, please enter anything lower than 6 hours.").then(m => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        }

        if (currentCooldown === time) {
            return msg.channel.send(`Slowmode is already set to ${args[0]}`).then(m => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        }

        msg.channel.setRateLimitPerUser(time, reason).then(() => {
            msg.channel.send(`Slowmode Enabled\nSlowmode: ${args[0]}\nReason: ${reason}`).then(m => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        });
    }
};
                          