const BaseEvent = require("../../assets/baseEvent");

module.exports = class Ready extends BaseEvent {
    constructor(client) {
        super(client,{
            name: 'Ready',
            eventName: 'ready'
        })
    }
    async run() {
        this.client.logger.ready(`Client is ready with Username: ${this.client.user.username}`);
        let cmds = [];
        this.client.commands.forEach((cmd) => {
            if(cmd.name && cmd.description) {
                // Create a shallow copy of the command to avoid circular references
                const cmdCopy = { ...cmd };
                delete cmdCopy.client; // Remove circular reference to client

                // Add 'type' field to options if they exist
                if (cmdCopy.options) {
                    cmdCopy.options = cmdCopy.options.map(option => {
                        if (!option.type) {
                            // Default to STRING (3) if type is missing
                            option.type = 3;
                        }

                        // Check for nested options (subcommand groups)
                        if (option.options) {
                            option.options = option.options.map(subOption => {
                                if (!subOption.type) {
                                    subOption.type = 3;
                                }
                                return subOption;
                            });
                        }

                        return option;
                    });
                }

                cmds.push(cmdCopy);
            }
        });
        this.client.application?.fetch().then(async (application) => {
            await application.commands.set(cmds).catch((e) => this.client.logger.error(e)).then(() => {
                this.client.logger.ready(`Loaded the Slash for All the Guilds.`);
            });
        });
    }
}