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
                    // Check if options is an array
                    if (Array.isArray(cmdCopy.options)) {
                        cmdCopy.options = cmdCopy.options.map(option => {
                            // Convert string options to proper option objects
                            if (typeof option === 'string') {
                                // Parse the string option format like "type <PLAYING/WATCHING/LISTENING/STREAMING>"
                                const match = option.match(/([a-zA-Z]+)(?: <(.+)>)?/);
                                if (match) {
                                    const name = match[1].toLowerCase();
                                    const description = match[2] ? `${name} ${match[2]}` : name;
                                    return {
                                        name: name,
                                        description: description,
                                        type: 3 // STRING type
                                    };
                                } else {
                                    return {
                                        name: option.toLowerCase().replace(/\s+/g, '-'),
                                        description: option,
                                        type: 3 // STRING type
                                    };
                                }
                            } else if (typeof option === 'object' && option !== null) {
                                // Make sure existing object has all required fields
                                if (!option.type) {
                                    option.type = 3; // Default to STRING
                                }
                                
                                if (!option.name) {
                                    option.name = "option";
                                }
                                
                                if (!option.description) {
                                    option.description = "Command option";
                                }

                                // Check for nested options (subcommand groups)
                                if (option.options) {
                                    option.options = option.options.map(subOption => {
                                        if (typeof subOption === 'string') {
                                            return {
                                                name: subOption.toLowerCase().replace(/\s+/g, '-'),
                                                description: subOption,
                                                type: 3 // STRING type
                                            };
                                        } else if (typeof subOption === 'object' && subOption !== null) {
                                            if (!subOption.type) subOption.type = 3;
                                            if (!subOption.name) subOption.name = "suboption";
                                            if (!subOption.description) subOption.description = "Command suboption";
                                        }
                                        return subOption;
                                    });
                                }
                            }
                            return option;
                        });
                    } else {
                        // If options is not an array, convert it to an empty array
                        cmdCopy.options = [];
                    }
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