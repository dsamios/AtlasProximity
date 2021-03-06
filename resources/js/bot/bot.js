#!/usr/bin/env node
/*jshint esversion: 6 */

const Discord = require('discord.js');
const axios = require('axios');
const table = require('text-table');
const moment = require('moment');
const config = require('./config.json');
const client = new Discord.Client();
const Echo = require('laravel-echo');
const contactHook = new Discord.WebhookClient(config.mentionwebhook.id, config.mentionwebhook.token);
const updateHook = new Discord.WebhookClient(config.updatewebhook.id, config.updatewebhook.token);
const notificationHook = new Discord.WebhookClient(config.notificationswebhook.id, config.notificationswebhook.token);

const key = config.axioskey;

// axios.defaults.params['key'] = config.axioskey;

// Random 'Processing...' messages
const procMsgs = [
    'Warming up Beric\'s mum...',
    'Sinking some Kraken ships...',
    'Browsing /r/playatlas...',
    'Scratching my balls...',
    'Pulling a fast wank...',
    'Waking up from a drug-fueled slumber...',
    'Quickly closing the incognito window...',
    'Wobbling to 299%...',
    'Atlas CCTV REQUIRES MORE MINERALS...',
    'Untap, Upkeep, Draw...',
    'Traveling to Hanamura...',
    'TIME\'S UP - LET\'S DO THIS!...',
    'This loading is a line...',
    'They see me loading, They waiting...',
    'Start your engines...',
    'Skipping cutscenes...',
    'Shuffling the deck...',
    'Reviving dead memes...',
    'Returning the slab...',
    'Recombobulating Discombobulators...',
    'now with scratch and sniff...',
    'Now with 100% more Screenshare!...',
    'Dropping in Pochinki...',
    'Looking for the power button...',
    'Look behind you...',
    'Locating Wumpus...',
    'Loading your digital hug...',
    'Loading Simulation...',
    'Jumping to hyperspace...',
    'Is this thing on?...',
    'Initiating launch sequence...',
    'Initializing socialization...',
    'If you are reading this, you can read...',
    'I swear it\'s around here somewhere...',
    'i need healing...',
    'how do i turn this thing on...',
    'Loading machine broke...',
    'Get ready for a surprise!...',
    'Finishing this senta......',
    'Dusting the cobwebs...',
    'Do you even notice these?...',
    'Opening the loading bay doors...',
    'Atlas CCTV is my city...',
    'Disconnecting from Reality...',
    'Charging spirit bomb...',
    'Charging Limit Break...',
    'Calibrating flux capacitors...',
    'Buckle up!...',
    'Assembling Voltron...',
    'Are we there yet?...',
    'A brawl is surely brewing!...',
    'LOADING 001: ARP 303 Saw...',
    '*Elevator Music Plays*',
    'Researching cheat codes...',
    'Wizard needs food badly...',
    'Decrypting Engrams...',
    'And now for something completely different...',
    'Stopping to smell the flowers...',
    'Achieving Nirvana...',
    'Managing Inventory...',
    'Grinding up some leprechauns to make Nutella...',
    'Putting the D into the V...',
];

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`!help`);

    var data = [];
    client.guilds.forEach(function (guild) {
        // guild.name
        // guild.id

        data.push({
            name: guild.name,
            guildid: guild.id,
            users: guild.memberCount,
        });
    });

    console.log(data);

    axios.post(config.url + '/api/guilds/add', {
        key: key,
        data: data,
    }).then(function (response) {
        console.log(response.data.message);
    });
});

client.on('message', msg => {
    var author = msg.author;
    var message = msg;

    // Ignore all bot messages
    if (msg.author.bot) {
        return;
    }

    // Ignore all messages not starting with a prefix
    if (msg.content.indexOf(config.prefix) !== 0) {
        return;
    }

    // Get arguments and command
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (msg.channel.type === 'dm') {
        // Private message
        console.log('Private message received from ' + msg.author.username + '#' + msg.author.discriminator + ':\n > ' + msg.content);
        msg.author.send('Sorry, I don\'t do private messages, use me in a server ( ͡° ͜ʖ ͡°)');
        return;
    } else {
        console.log('Message received from server ' + msg.guild.name + ' by user ' + msg.author.username + '#' + msg.author.discriminator + ':\n > ' + msg.content);
    }

    // Store all commands into DB
    axios.post(config.url + '/api/command/add', {
        key: key,
        guildid: msg.guild.id,
        channelid: msg.channel.id,
        channelname: msg.channel.name,
        user: msg.author.username + '#' + msg.author.discriminator,
        command: command,
        arguments: args.join(' '),
    }).then(function (response) {
        console.log('[COMMAND] ' + response.data.message);
    }).catch(function (error) {
        console.log('[ERROR]' + error.response);
    });

    if (command === 'help' || command === 'cmdlist' || command === 'commands' || command === 'bot' || command === 'info') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            axios.get(config.url + '/api/help', {
                params: {
                    key: key,
                    guildid: message.guild.id,
                },
            }).then(function (response) {
                // var message = '';
                if (response.data) {
                    msg.edit(':dolphin: Here is the link to the documentation for this bot.\n' + response.data.url);
                } else {
                    message = '\n> Something went wrong when pulling the help information';
                    // console.log('Sent a private message to ' + msg.author.username + ':' + message);
                    msg.edit('```' + message + '```');
                }
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'version' || command === 'v') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // Poll the API for the information requested
            axios.get(config.url + '/api/version', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                },
            }).then(function (response) {
                // var message = '';
                var array = [];
                var multiple = false;

                if (response.data.version !== undefined) {
                    msg.edit(':information_source: Current bot version `' + response.data.version + '`, this update happened `' + moment(response.data.created_at * 1000).fromNow() + '`\n\n' + response.data.changes);
                } else {
                    msg.edit(':skull_crossbones: Something went wrong while trying to pull the version information');
                }

            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'faq' || command === 'frequentlyaskedquestions') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // Poll the API for the information requested
            axios.get(config.url + '/api/faq', {
                params: {
                    key: key,
                    guildid: message.guild.id,
                },
            }).then(function (response) {
                // var message = '';
                msg.delete();
                message.delete();
                var array = [];
                var multiple = false;

                author.send(':question: These are currently the most asked questions about the Atlas CCTV bot:');
                for (var faq in response.data) {
                    if (!response.data.hasOwnProperty(faq)) {
                        continue;
                    }

                    array.push(['Question: `' + response.data[faq].question + '`']);
                    array.push(['Answer: ' + response.data[faq].answer + '']);
                    array.push(['']);

                    // If the array is larger than 25 lines, push it as a message and restart the array
                    if (array.length >= 10) {
                        author.send('' + table(array) + '');
                        multiple = true;

                        array = [];
                    }
                }

                console.log('Sent a message to ' + msg.guild.name);
                if (array.length >= 1) {
                    author.send('' + table(array) + '');
                }
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'ask' || command === 'feedback' || command === 'contact' || command === 'question') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'contact [MESSAGE]';
                msg.edit('```' + message + '```');
                return false;
            }

            let input = args.join(' ');

            // Send a message to the bot owner
            console.log('User ' + author.username + '#' + author.discriminator + ' sent a message to the devs using !contact');
            msg.edit(':microphone2: We have sent your message to the bot owner!');
            contactHook.send('Someone sent you a message using the !contact command\n``` > Message: ' + input + '\n > User: ' + author.username + '#' + author.discriminator + '\n > User ID: ' + author.id + '\n > Origin server: ' + msg.guild.name + '\n > Origin channel: ' + msg.channel.name + '\n > Origin channel ID: ' + msg.channel.id + '```');
            //
            //
            // console.log(config.ownerid);
            // console.log(author.id);
            // console.log(client.users.get(config.ownerid.toString()));
            // client.users.get(config.ownerid.toString()).send();

        });

        return false;
    }

    if (command === 'setting' || command === 'settings' || command === 'config' || command === 'configs') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            let [parameter, value] = args;

            if (message.member.hasPermission('ADMINISTRATOR')) {
                // Poll the API for the information requested
                axios.get(config.url + '/api/settings', {
                    params: {
                        key: key,
                        guildid: msg.guild.id,
                        parameter: parameter,
                        value: value,
                    },
                }).then(function (response) {
                    var array = [];
                    if (response.data.returntype === 'all') {
                        array.push(['PARAMETER', 'CURRENT', 'POSSIBLE', 'TYPE']);
                        for (var type in response.data) {
                            if (type === 'returntype') {
                                continue;
                            }

                            if (!response.data.hasOwnProperty(type)) {
                                continue;
                            }

                            for (var parameter in response.data[type]) {
                                if (!response.data[type].hasOwnProperty(parameter)) {
                                    continue;
                                }

                                console.log([parameter, response.data[type][parameter].current, response.data[type][parameter].options, type]);
                                array.push([parameter, response.data[type][parameter].current, response.data[type][parameter].options, type]);
                            }
                        }
                    } else {
                        array.push(['PARAMETER', 'CURRENT', 'POSSIBLE', 'TYPE']);
                        array.push([response.data.parameter, response.data.current, response.data.options, response.data.type]);
                    }

                    msg.edit('```' + table(array) + '```\nExample command: `!setting region na`');
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                msg.edit(error.response.data.message);
                            }
                        }
                    }

                    console.log('[ERROR]' + error.response);
                });
            } else {
                msg.edit('You need `ADMINISTRATOR` permissions on this Discord server to be able to change this bot\'s settings!');
            }
        });

        return false;
    }

    if (command === 'stats' || command === 'chart') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'stats [COORDINATES:B4]';
                msg.edit('```' + message + '```');
                return false;
            }

            let [server] = args;

            if (server === undefined) {
                server = 'A1';
            }

            // Poll the API for the information requested
            axios.get(config.url + '/api/stats', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                    server: server.toUpperCase(),
                    period: 'day',
                },
            }).then(function (response) {
                // var message = '';
                var array = [];
                var multiple = false;

                if (response.data.image !== undefined) {
                    msg.edit(':chart_with_upwards_trend: This is the chart of the player on server ' + server + ' over the past 24 hours.');
                    msg.channel.send('', {
                        file: response.data.image, // Or replace with FileOptions object
                    });
                } else {
                    msg.edit(':skull_crossbones: Something went wrong while trying to pull the stats information');
                }

            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'map' || command === 'world') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // Poll the API for the information requested
            axios.get(config.url + '/api/map', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                },
            }).then(function (response) {
                // var message = '';
                var array = [];
                var multiple = false;

                if (response.data.image !== undefined) {
                    msg.edit(':map: This is the current map of the server:');
                    msg.channel.send('', {
                        file: response.data.image, // Or replace with FileOptions object
                    });
                } else {
                    msg.edit(':skull_crossbones: Something went wrong while trying to pull the map information');
                }

            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'purge' || command === 'clean' || command === 'clear') {
        if (message.member.guild.me.hasPermission('ADMINISTRATOR') || message.member.guild.me.hasPermission('MANAGE_MESSAGES')) {
            if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES')) {
                async function clear() {
                    msg.delete();
                    const fetched = await msg.channel.fetchMessages({limit: 100});
                    msg.channel.bulkDelete(fetched);
                }

                clear();
            } else {
                msg.edit('You do not have the correct permissions to use !purge (You need to be able to delete messages)');
            }
        } else {
            msg.edit('This bot doesn\'t have permissions to remove messages');
        }

        return false;
    }

    if (command === 'player' || command === 'players') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'players <SERVER:A1>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [server] = args;

            // Server (eg B4)
            if (server === undefined) {
                server = 'A1';
            } else {
                server = server.toUpperCase();
            }

            // Poll the API for the information requested
            var ogserver = server;
            axios.get(config.url + '/api/players', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                    server: server,
                },
            }).then(function (response) {
                // var message = '';
                var array = [];
                var multiple = false;

                if (response.data.players !== false) {
                    msg.edit('These are the `' + response.data.players.length + '` players on `' + ogserver + '`');
                    array.push(['USERNAME', 'PLAYTIME']);
                    for (var player in response.data.players) {
                        if (!response.data.players.hasOwnProperty(player)) {
                            continue;
                        }

                        array.push([response.data.players[player].Name, response.data.players[player].TimeF]);

                        // If the array is larger than 25 lines, push it as a message and restart the array
                        if (array.length >= 25) {
                            msg.channel.send('```' + table(array) + '```');
                            multiple = true;

                            array = [];
                            array.push(['USERNAME', 'PLAYTIME']);
                        }
                    }

                    console.log('Sent a message to ' + msg.guild.name);
                    if (array.length >= 2) {
                        msg.channel.send('```' + table(array) + '```');
                    }
                } else {
                    msg.edit(':skull_crossbones: Server ' + ogserver + ' seems to be offline');
                }

            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'pop' || command === 'population') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'pop <SERVER:A1>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [server] = args;

            // Server (eg B4)
            if (server === undefined) {
                server = 'A1';
            } else {
                server = server.toUpperCase();
            }

            // Poll the API for the information requested
            var ogserver = server;
            axios.get(config.url + '/api/population', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                    server: server,
                },
            }).then(function (response) {
                // var message = '';
                var array = [];

                array.push(['COORDINATE', 'PLAYERS', 'DIRECTION', '']);
                for (var server in response.data) {
                    if (!response.data.hasOwnProperty(server)) {
                        continue;
                    }

                    array.push([server, response.data[server].count, response.data[server].direction, String.fromCodePoint('0x' + response.data[server].unicode)]);
                }

                console.log('Sent a message to ' + msg.guild.name);
                msg.edit('\nThese are the amount of players on and around ' + ogserver + ':\n```' + table(array) + '```\n\nWant to see this data as a table? Try \'!grid ' + ogserver + '\'');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'grid') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given

                var message = '';
                message = message + config.prefix + 'pop <SERVER:A1>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [server] = args;

            // Server (eg B4)
            if (server === undefined) {
                server = 'A1';
            } else {
                server = server.toUpperCase();
            }

            var ogserver = server;
            // Poll the API for the information requested
            axios.get(config.url + '/api/population', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                    server: server,
                },
            }).then(function (response) {
                // var message = '';
                var array = [];
                var order = [[2, 3, 4], [1, 0, 5], [8, 7, 6]];

                for (var row in order) {
                    if (!order.hasOwnProperty(row)) {
                        continue;
                    }

                    var headers = [];
                    var items = [];
                    for (var column in order[row]) {
                        if (!order[row].hasOwnProperty(column)) {
                            continue;
                        }

                        var server = Object.keys(response.data)[order[row][column]];
                        headers.push(server);
                        items.push(response.data[server].count);
                    }

                    array.push(headers);
                    array.push(items);
                    if (row < 2) {
                        array.push(['', '', '']);
                    }
                }

                var message = '\nThese are the amount of players on and around ' + ogserver + ':\n```' + table(array) + '```\n\nWant to see this data as a list? Try \'!pop ' + ogserver + '\'';
                console.log('Sent a message to ' + msg.guild.name + ':' + message);
                msg.edit(message);
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'findboat' || command === 'searchboat' || command === 'whereisboat') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'findboat <BOATID:1>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [boatid] = args;

            // Poll the API for the information requested
            axios.get(config.url + '/api/findboat', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                    boatid: boatid,
                },
            }).then(function (response) {
                // var message = '';
                var array = [];
                var message = '';

                if (response.data.length) {
                    array.push(['USERNAME', 'COORDINATE', 'LAST SEEN']);
                    for (var player in response.data) {
                        if (!response.data.hasOwnProperty(player)) {
                            continue;
                        }

                        array.push([response.data[player][0].player, response.data[player][0].coordinates, moment(response.data[player][0].updated_at, 'YYYY-MM-DD HH:mm:ss').fromNow()]);
                    }

                    message = '\nWe found the following information about the players in boat #' + boatid + ' (only their last known location)\n```' + table(array) + '```';
                    console.log('Sent a message to ' + msg.guild.name + ':' + message);
                    msg.edit(message);
                }
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'find' || command === 'search' || command === 'whereis') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'find <NAME:iShot>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [username] = [args.join(' ')];

            console.log('/api/find?key=' + key + '&guildid=' + msg.guild.id + '&username=' + username);
            // Poll the API for the information requested
            axios.get(config.url + '/api/find', {
                params: {
                    key: key,
                    guildid: msg.guild.id,
                    username: username,
                },
            }).then(function (response) {
                // var message = '';
                var array = [];
                var message = '';

                if (response.data.length) {
                    array.push(['COORDINATE', 'USERNAME', 'LAST SEEN']);
                    for (var player in response.data) {
                        if (!response.data.hasOwnProperty(player)) {
                            continue;
                        }

                        // 2019-01-23 19:34:39
                        array.push([response.data[player].coordinates, response.data[player].player, moment(response.data[player].updated_at, 'YYYY-MM-DD HH:mm:ss').fromNow()]);
                    }

                    message = '\nWe found the following information for player ' + username + ' (limited to 5 last entries)\n```' + table(array) + '```';
                    console.log('Sent a message to ' + msg.guild.name + ':' + message);
                    msg.edit(message);
                } else {
                    message = '\n```> No players found with this name```';
                    console.log('Sent a message to ' + msg.guild.name + ':' + message);
                    msg.edit(message);
                }
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'unproximityall' || command === 'unproxall' || command === 'unalertall') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES')) {
                console.log(msg.guild.id, msg.channel.id, config.url + '/api/proximity/remove/all');
                // Poll the API for the information requested
                axios.post(config.url + '/api/proximity/remove/all', {
                    key: key,
                    guildid: msg.guild.id,
                    channelid: msg.channel.id,
                }).then(function (response) {
                    msg.edit('```Removed all active proximity alerts from this Discord server```');
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                msg.edit(error.response.data.message);
                            }
                        }
                    }

                    console.log('[ERROR]' + error.response);
                });
            } else {
                msg.edit('```You need message removal permissions in your Discord server to use this command```');
            }
        });

        return false;
    }

    if (command === 'unproximity' || command === 'unprox' || command === 'unalert') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'unprox <SERVER:B4>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [server] = args;

            console.log(server, config.url + '/api/proximity/remove');
            // Poll the API for the information requested
            axios.post(config.url + '/api/proximity/remove', {
                key: key,
                coordinate: server,
                guildid: msg.guild.id,
                channelid: msg.channel.id,
            }).then(function (response) {
                msg.edit('```' + 'No longer alerting on server ' + server + '```');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }
    ;

    if (command === 'proximity' || command === 'prox' || command === 'alert') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'alert <SERVER:B4>';

                // Get current tracks for this guild...
                axios.get(config.url + '/api/proximity/list', {
                    params: {
                        key: key,
                        guildid: msg.guild.id,
                    },
                }).then(function (response) {
                    message = message + '\n\n';

                    if (response.data.length) {
                        var array = [];
                        array.push(['COORDINATE', 'ADDED']);
                        for (var server in response.data) {
                            if (!response.data.hasOwnProperty(server)) {
                                continue;
                            }

                            array.push([response.data[server].coordinate, moment(response.data[server].updated_at, 'YYYY-MM-DD HH:mm:ss').fromNow()]);
                        }

                        message = message + table(array);
                    } else {
                        // No active tracks
                        message = message + 'No active proximity alerts found';
                    }

                    msg.edit('These are the active proximity alerts:\n```' + message + '```');
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                msg.edit(error.response.data.message);
                            }
                        }
                    }

                    console.log('[ERROR]' + error.response);
                });

                return false;
            }

            let [server] = args;

            console.log(server, config.url + '/api/proximity/add');
            // Poll the API for the information requested
            axios.post(config.url + '/api/proximity/add', {
                key: key,
                coordinate: server.toUpperCase(),
                guildid: msg.guild.id,
                channelid: msg.channel.id,
            }).then(function (response) {
                msg.edit('```' + 'Now alerting about ships entering server ' + server + '```');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'untrackall' || command === 'unstalkall' || command === 'unfollowall') {

        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES')) {
                console.log(msg.guild.id, msg.channel.id, config.url + '/api/track/remove/all');
                // Poll the API for the information requested
                axios.post(config.url + '/api/track/remove/all', {
                    key: key,
                    guildid: msg.guild.id,
                    channelid: msg.channel.id,
                }).then(function (response) {
                    msg.edit('```Removed all active trackings from this channel```');
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                msg.edit(error.response.data.message);
                            }
                        }
                    }

                    console.log('[ERROR]' + error.response);
                });
            } else {
                msg.edit('```You need message removal permissions in your Discord server to use this command```');
            }
        });

        return false;
    }

    if (command === 'untrack' || command === 'unstalk' || command === 'unfollow') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'untrack <NAME:iShot>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [username] = [args.join(' ')];

            console.log(username, msg.guild.id, msg.channel.id, config.url + '/api/track/remove');
            // Poll the API for the information requested
            axios.post(config.url + '/api/track/remove', {
                key: key,
                username: username,
                guildid: msg.guild.id,
                // channelid: msg.channel.id,
            }).then(function (response) {
                msg.edit('```' + 'No longer tracking ' + username + '```');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'track' || command === 'stalk' || command === 'follow') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0 || args[1] === undefined) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'track <MINUTES:30> <NAME:iShot>';

                // Get current tracks for this guild...
                axios.get(config.url + '/api/track/list', {
                    params: {
                        key: key,
                        guildid: msg.guild.id,
                    },
                }).then(function (response) {
                    message = message + '\n\n';

                    if (response.data.length) {
                        var array = [];
                        array.push(['USERNAME', 'LAST LOCATION', 'LAST SEEN', 'EXPIRES']);
                        for (var track in response.data) {
                            if (!response.data.hasOwnProperty(track)) {
                                continue;
                            }

                            var last_coordinate = response.data[track].last_coordinate;
                            if (last_coordinate === null) {
                                last_coordinate = 'Unknown';
                            }
                            array.push([response.data[track].player, last_coordinate, moment(response.data[track].updated_at, 'YYYY-MM-DD HH:mm:ss').fromNow(), moment(response.data[track].until, 'YYYY-MM-DD HH:mm:ss').fromNow()]);
                        }

                        message = message + table(array);
                    } else {
                        // No active tracks
                        message = message + 'No active trackings found';
                    }

                    msg.edit('```' + message + '```');
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                msg.edit(error.response.data.message);
                            }
                        }
                    }

                    console.log('[ERROR]' + error.response);
                });

                return false;
            }

            let [minutes, username] = [args[0], args.slice(1).join(' ')];

            console.log(username, minutes, msg.guild.id, msg.channel.id, config.url + '/api/track/add');
            // Poll the API for the information requested
            axios.post(config.url + '/api/track/add', {
                key: key,
                username: username,
                minutes: minutes,
                guildid: msg.guild.id,
                channelid: msg.channel.id,
            }).then(function (response) {
                msg.edit('```' + 'Now tracking ' + username + ' for the next ' + minutes + ' minute(s). We\'ll post a message each time we see the player move servers.' + '```');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'unmonitorall') {

        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES')) {
                console.log(msg.guild.id, msg.channel.id, config.url + '/api/monitor/remove/all');
                // Poll the API for the information requested
                axios.post(config.url + '/api/monitor/remove/all', {
                    key: key,
                    guildid: msg.guild.id,
                    channelid: msg.channel.id,
                }).then(function (response) {
                    msg.edit('```Removed all active coordinate monitors from this channel```');
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                msg.edit(error.response.data.message);
                            }
                        }
                    }

                    console.log('[ERROR]' + error.response);
                });
            } else {
                msg.edit('```You need message removal permissions in your Discord server to use this command```');
            }
        });

        return false;
    }

    if (command === 'unmonitor') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'unmonitor <COORDINATE:B4>';
                msg.edit('```' + message + '```');
                return false;
            }

            let [coordinate] = args;

            // Poll the API for the information requested
            axios.post(config.url + '/api/monitor/remove', {
                key: key,
                coordinate: coordinate,
                guildid: msg.guild.id,
            }).then(function (response) {
                msg.edit('```' + 'No longer monitoring ' + coordinate + '```');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }

    if (command === 'monitor') {
        msg.channel.send(procMsgs[Math.floor(Math.random() * procMsgs.length)] + ' (processing, please wait)').then((msg) => {
            // If no arguments, send back the usage of the command
            if (args.length === 0) {
                // No parameters given
                var message = '';
                message = message + config.prefix + 'monitor <COORDINATE:B4>';

                // Get current tracks for this guild...
                axios.get(config.url + '/api/monitor/list', {
                    params: {
                        key: key,
                        guildid: msg.guild.id,
                    },
                }).then(function (response) {
                    message = message + '\n\n';

                    if (response.data.length) {
                        var array = [];
                        array.push(['COORDINATE', 'ADDED']);
                        for (var server in response.data) {
                            if (!response.data.hasOwnProperty(server)) {
                                continue;
                            }

                            array.push([response.data[server].coordinate, moment(response.data[server].updated_at, 'YYYY-MM-DD HH:mm:ss').fromNow()]);
                        }

                        message = message + table(array);
                    } else {
                        // No active tracks
                        message = message + 'No active monitoring alerts found';
                    }

                    msg.edit('```' + message + '```');
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.message) {
                                msg.edit(error.response.data.message);
                            }
                        }
                    }

                    console.log('[ERROR]' + error.response);
                });

                return false;
            }

            let [coordinate] = args;

            // Poll the API for the information requested
            axios.post(config.url + '/api/monitor/add', {
                key: key,
                coordinate: coordinate,
                guildid: msg.guild.id,
                channelid: msg.channel.id,
            }).then(function (response) {
                msg.edit('```' + 'Now monitoring ' + coordinate + ', we\'ll post a message every time anyone joins or leaves this coordinate! This can be considered spam on popular coordinates, use !unmonitor ' + coordinate + ' to remove this monitoring.```');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.data) {
                        if (error.response.data.message) {
                            msg.edit(error.response.data.message);
                        }
                    }
                }

                console.log('[ERROR]' + error.response);
            });
        });

        return false;
    }
});

client.on('guildCreate', guild => {
    // This event triggers when the bot joins a guild.
    notificationHook.send(':heavy_plus_sign: The Atlas CCTV bot was added to server `' + guild.name + '` (id: `' + guild.id + '`, members: `' + guild.memberCount + '`). We are now active on `' + client.guilds.size + '` servers!');

    axios.post(config.url + '/api/guild/add', {
        key: key,
        users: guild.memberCount,
        name: guild.name,
        guildid: guild.id,
    }).then(function (response) {
        console.log('Added or updated guild ' + guild.name + ' in the database');
    });
    // client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildDelete', guild => {
    // this event triggers when the bot is removed from a guild.
    notificationHook.send(':heavy_minus_sign: The Atlas CCTV bot was removed from server `' + guild.name + '` (id: `' + guild.id + '`, members: `' + guild.memberCount + '`). We are now active on only `' + client.guilds.size + '` servers!');

    axios.post(config.url + '/api/guild/remove', {
        key: key,
        guildid: guild.id,
    }).then(function (response) {
        console.log('Removed guild ' + guild.name + ' from the database');
    });
    // client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('error', (e) => console.error(e));

client.login(config.token);

// ECHO
const io = require('socket.io-client');
this.Echo = new Echo({
    broadcaster: 'socket.io',
    host: config.url + ':' + config.socketport,
    client: io,
});

this.Echo.channel(`public`)
    .listen('.tracked.player.moved', (e) => {
        console.log('[TRACKING] Sent message to ' + e.guildid + ' about player ' + e.player);
        if (client.channels.get(e.channelid)) {
            client.channels.get(e.channelid).send(':spy::skin-tone-4: Tracked player `' + e.player + '` has moved from `' + e.from + '` to `' + e.to + '` heading `' + e.direction + '`');
        } else {
            console.log('[TRACKING] Tried to send message to channelid ' + e.channelid + ' but it failed, couldn\'t find channel');
        }
    })
    .listen('.tracked.player.lost', (e) => {
        console.log('[TRACKING] Sent tracking lost message to ' + e.guildid + ' about player ' + e.player);
        if (client.channels.get(e.channelid)) {
            client.channels.get(e.channelid).send(':sleeping: We suspect that tracked player `' + e.player + '` has gone offline. Last known location: `' + e.last + '`');
        } else {
            console.log('[TRACKING] Tried to send message to channelid ' + e.channelid + ' but it failed, couldn\'t find channel');
        }
    })
    .listen('.tracked.player.refound', (e) => {
        console.log('[TRACKING] Sent tracking refound message to ' + e.guildid + ' about player ' + e.player);
        if (client.channels.get(e.channelid)) {
            client.channels.get(e.channelid).send(':spy::skin-tone-4: Tracked player `' + e.player + '` came back online in location: `' + e.last + '`');
        } else {
            console.log('[TRACKING] Tried to send message to channelid ' + e.channelid + ' but it failed, couldn\'t find channel');
        }
    })
    .listen('.track.expired', (e) => {
        console.log('[TRACKING] Sent track expired message to ' + e.guildid + ' about player ' + e.player);
        if (client.channels.get(e.channelid)) {
            client.channels.get(e.channelid).send(':timer: Tracking for player `' + e.player + '` has expired. Last known location: `' + e.last + '`');
        } else {
            console.log('[TRACKING] Tried to send message to channelid ' + e.channelid + ' but it failed, couldn\'t find channel');
        }
    })
    .listen('.bot.updated', (e) => {
        console.log('[UPDATE] We noticed an update happened and sent a message to the webhook');
        updateHook.send(':satellite: The Atlas CCTV bot has just been updated!\n > Current version: `' + e.version + '`\n\n' + e.changes + '');
    })
    .listen('.faq.created', (e) => {
        console.log('[FAQ] We noticed a new FAQ appeared!');
        updateHook.send(':question: A new frequently asked question was added to the !faq command!\n\n`' + e.question + '`\n' + e.answer + '');
    })
    .listen('.tracked.server.boat', (e) => {
        console.log('[TRACKING] Sent boat warning message to ' + e.guildid + ' about coordinate ' + e.to);
        if (client.channels.get(e.channelid)) {
            client.channels.get(e.channelid).send(':anchor: A suspected boat entered coordinate `' + e.to + '`. They came from the `' + e.direction + '` (`' + e.from + '`). Player(s) on the boat:\n```\n' + e.players.join('\n') + '```\nUse `!findboat ' + e.boatid + '` to show the current location of the players on this boat.');
        } else {
            console.log('[TRACKING] Tried to send message to channelid ' + e.channelid + ' but it failed, couldn\'t find channel');
        }
    })
    .listen('.announcement', (e) => {
        console.log(e);
        console.log(e.channels);

        var success = [];
        var fail = [];

        if (e.channels.length) {
            for (var channelid in e.channels) {
                if (!e.channels.hasOwnProperty(channelid)) {
                    continue;
                }

                if (client.channels.get(e.channels[channelid])) {
                    if (e.mention !== null) {
                        if (client.channels.get(e.channels[channelid]).members.get(e.mention)) {
                            client.channels.get(e.channels[channelid]).send('<@' + e.mention + '>\n' + e.title + '\n\n' + e.message + '\n\n\nThanks for reading,\n\n**Atlas Discord Bot**');
                            success.push(e.channels[channelid]);
                        } else {
                            console.log('[ANNOUNCEMENT] Tried to mention a user that doesn\'t exist on the channel');
                            fail.push(e.channels[channelid]);
                        }
                    } else {
                        client.channels.get(e.channels[channelid]).send(e.title + '\n\n' + e.message + '\n\n\nThanks for reading,\n\n**Atlas Discord Bot**');
                        success.push(e.channels[channelid]);
                    }
                    console.log('[ANNOUNCEMENT] Sent message to channelid ' + e.channels[channelid] + '');
                } else {
                    console.log('[ANNOUNCEMENT] Tried to send message to channelid ' + e.channels[channelid] + ' but it failed, couldn\'t find channel');
                    fail.push(e.channels[channelid]);
                }
            }

            // Post to callback the results of the announcement
            axios.post(e.callback, {
                key: key,
                success: success,
                fail: fail,
            }).then(function (response) {
                console.log('[ANNOUNCEMENT] Posted results of the announcement to the callback URL.');
            }).catch(function (error) {
                console.log('[ERROR] Failed to post the results of the announcement to the callback URL.');
            });
        }
    });