//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// PARTE PRINCIPALE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const { Discord, MessageEmbed, MessageActionRow, MessageSelectMenu, Client, MessageButton, Modal, TextInputComponent } = require("discord.js")
const config = require("./config.json")
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const sourcebin = require('sourcebin_js');
require('events').EventEmitter.prototype._maxListeners = 100;
const moment = require('moment')
const axios = require('axios')
const m = require("moment-duration-format");
const ms = require("ms")
const os = require('os')
const cpuStat = require("cpu-stat")
const child = require('child_process');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const simplydjs = require("simply-djs");
const { InteractionWebhook } = require("discord.js")
const prefix = require("./config.json");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  CLIENT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const client = new Client({
    intents: 32767,
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  CONST PRINCIPALI
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const guild = client.guilds.cache.get(config.guildid);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// TOKEN LOGIN
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.login(config.token)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// READY
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("ready", () => {
    console.log(client.user.username + "#" + client.user.discriminator + " ON | By Cloud Devs")
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// ANTI CHRASH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
process.on('unhandledRejection', (reason, p) => {
    if (reason?.message === 'The request is missing a valid API key.') return;
    let channel = client.channels.cache.get(config.error);
    console.log(reason, p);
    channel?.send({
        embeds: [
            new MessageEmbed()
                .setTitle('Errore sconosciuto')
                .setDescription(`${reason}`)
                .setColor('2f3136')
        ],
    });
});

process.on('uncaughtException', (err, origin) => {
    let channel = client.channels.cache.get(config.error);
    console.log(err, origin);
    channel?.send({
        embeds: [
            new MessageEmbed()
                .setTitle('Errore sconosciuto')
                .setDescription(`${err}`)
                .setColor('2f3136')
        ],
    });
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    let channel = client.channels.cache.get(config.error);
    console.log(err, origin);
    channel?.send({
        embeds: [
            new MessageEmbed()
                .setTitle('Errore sconosciuto')
                .setDescription(`${err}`)
                .setColor('2f3136')
        ],
    });
});

process.on('multipleResolves', (type, promise, reason) => {
    let channel = client.channels.cache.get(config.error);
    console.log(type, promise, reason);
    channel.send({
        embeds: [
            new MessageEmbed()
                .setTitle('Errore sconosciuto')
                .setDescription(`${type}`)
                .setColor('2f3136')
        ],
    });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// STATUS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("ready", () => {
    let activities = [
        `Cloud Devs`
      ],
        i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ %

        activities.length]}`, {
        type: "STREAMING",
        url: 'Cloud Devs'
    }), 1000 * 10);
    client.user
        .setStatus("streaming")

});
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// TICKET COMMAND
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on("messageCreate", async (message) => {
        if (message.content == "!ticket") {
            const user = await (await (message.guild?.members.fetch(message.author.id))).permissions.has("ADMINISTRATOR")
            if (!user) return message.channel.send({ embeds: [new MessageEmbed().setColor("2f3136").setDescription(config.emojino + " Permessi Insufficienti")] }).then(msg => { setTimeout(() => msg.delete(), 6000) })

            var embed = new MessageEmbed()
                .setAuthor(`${message.guild.name} | TICKETS`, `https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif`, 'https://discord.gg/cloudevs')
                .setDescription(config.emojiattenction + `\`ATTENZIONE!\`\n` + config.emojifreccia + ` Non aprire un TICKET senza una motivazione valida.\n\n` + config.emojiattenction + ` \`ATTENCTION!\`\n ` + config.emojifreccia + ` Do not open a TICKET without a valid reason. Read our <#1087816466168025199> to avoid warns or bans.`)
                .setColor("#2f3136")
                .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
                .setFooter("By Cloud Devs")

            const button1 = new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("Support")
                .setEmoji("<:sasas:1174369906452615178>")
                .setCustomId("supporto")
            const button2 = new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("Buy")
                .setEmoji("<:1089629924735844393:1174369606509527210>")
                .setCustomId("buy")
            const button3 = new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("Partner")
                .setEmoji("<:1139907542840000642:1174369653720625213>")
                .setCustomId("partner")


            var row = new MessageActionRow()
                .addComponents(button1, button2, button3)

            message.delete()

            message.channel.send({ embeds: [embed], components: [row] })
        }
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// SUPPORTO
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on("interactionCreate", async (interaction) => {
        if (interaction.customId == "supporto") {

            const channels = (await interaction.guild.channels.cache.find((c) => c.topic === config.emojifreccia + ` Member ID${interaction.user.id}`))
            if (channels) return interaction.reply({ embeds: [new MessageEmbed().setColor("2f3136").setDescription(config.emojino + " You have already ticket **open**")], ephemeral: true })

            interaction.message.guild.channels.create(`📁・support-${interaction.user.username}`, {
                parent: (config.categoriasupporto),
                topic: config.emojifreccia + ` Member ID${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                    },
                    {
                        id: interaction.guild.roles.cache.get(config.idstaff),
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                    },
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                ],
                tuype: 'text',
            }).then(async channel => {

                const embedticket = new MessageEmbed()
                    .setColor("2f3136")
                    .setDescription(`<@${interaction.user.id}> Ticket created in: <#${channel.id}>`)

                interaction.reply({ embeds: [embedticket], ephemeral: true })
                channel.send(`<@${interaction.user.id}> - <@&${config.idstaff}>`)

                const embedd = new MessageEmbed()
                    .setColor("2f3136")
                    .setAuthor(`${interaction.guild.name} | TICKETS`, `https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif`, 'https://discord.gg/cloudevs')
                    .setDescription(config.emojiattenction + ` \`WELCOME\`\n<@${interaction.user.id}>, Welcome in your \`SUPPORT TICKET\`, explain why you opened the ticket as clearly as possible.`)
                    .setFooter("By Cloud Devs")
                    .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")

                const chiudi = new MessageButton()
                    .setLabel("Close the ticket")
                    .setStyle("SECONDARY")
                    .setEmoji("<:1128836287718248549:1174369620820492349>")
                    .setCustomId("chiudi")

                const staff = new MessageButton()
                    .setLabel("Staff Settings")
                    .setStyle("SECONDARY")
                    .setEmoji("<:MMG_staff_blue:1174372229627252786>")
                    .setCustomId("staff")

                const claim = new MessageButton()
                    .setLabel("Claim the ticket")
                    .setStyle("SECONDARY")
                    .setEmoji("<:claim:1174372466072760421> ")
                    .setCustomId("claim")



                const row = new MessageActionRow()
                    .addComponents(chiudi, staff, claim)
                channel.send({ embeds: [embedd], components: [row] })
            })
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// BUG
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on("interactionCreate", async (interaction) => {
        if (interaction.customId == "buy") {

            const channels = (await interaction.guild.channels.cache.find((c) => c.topic === config.emojifreccia + ` Member ID${interaction.user.id}`))
            if (channels) return interaction.reply({ embeds: [new MessageEmbed().setColor("2f3136").setDescription(config.emojino + " You have already ticket **open**")], ephemeral: true })

            interaction.message.guild.channels.create(`💸・buy-${interaction.user.username}`, {
                parent: (config.categoriabuy),
                topic: config.emojifreccia + ` Member ID${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                    },
                    {
                        id: interaction.guild.roles.cache.get(config.idstaff),
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                    },
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                ],
                tuype: 'text',
            }).then(async channel => {

                const embedticket = new MessageEmbed()
                    .setColor("2f3136")
                    .setDescription(`<@${interaction.user.id}> Ticket created in: <#${channel.id}>`)

                interaction.reply({ embeds: [embedticket], ephemeral: true })
                channel.send(`<@${interaction.user.id}> - <@&${config.idstaff}>`)

                const embedd = new MessageEmbed()
                    .setColor("2f3136")
                    .setAuthor(`${interaction.guild.name} | TICKETS`, `https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif`, 'https://discord.gg/cloudevs')
                    .setDescription(config.emojiattenction + ` \`WELCOME\`\n<@${interaction.user.id}>, Welcome in your \`BUY TICKET\`, explain why you opened the ticket as clearly as possible.`)
                    .setFooter("By Cloud Devs")
                    .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")

                const chiudi = new MessageButton()
                    .setLabel("Close the ticket")
                    .setStyle("SECONDARY")
                    .setEmoji("<:1128836287718248549:1174369620820492349>")
                    .setCustomId("chiudi")

                const staff = new MessageButton()
                    .setLabel("Staff Settings")
                    .setStyle("SECONDARY")
                    .setEmoji("<:MMG_staff_blue:1174372229627252786>")
                    .setCustomId("staff")

                const claim = new MessageButton()
                    .setLabel("Claim the ticket")
                    .setStyle("SECONDARY")
                    .setEmoji("<:claim:1174372466072760421> ")
                    .setCustomId("claim")




                const row = new MessageActionRow()
                    .addComponents(chiudi, staff, claim)
                channel.send({ embeds: [embedd], components: [row] })
            })
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// PARTNER
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on("interactionCreate", async (interaction) => {
        if (interaction.customId == "partner") {

            const channels = (await interaction.guild.channels.cache.find((c) => c.topic === config.emojifreccia + ` Member ID${interaction.user.id}`))
            if (channels) return interaction.reply({ embeds: [new MessageEmbed().setColor("2f3136").setDescription(config.emojino + " You have already ticket **open**")], ephemeral: true })

            interaction.message.guild.channels.create(`🤝・partner-${interaction.user.username}`, {
                parent: (config.categoriapartner),
                topic: config.emojifreccia + ` Member ID${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                    },
                    {
                        id: interaction.guild.roles.cache.get(config.idstaff),
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                    },
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                ],
                tuype: 'text',
            }).then(async channel => {

                const embedticket = new MessageEmbed()
                    .setColor("2f3136")
                    .setDescription(`<@${interaction.user.id}> Ticket created in: <#${channel.id}>`)

                interaction.reply({ embeds: [embedticket], ephemeral: true })
                channel.send(`<@${interaction.user.id}> - <@&${config.idstaff}>`)

                const embedd = new MessageEmbed()
                    .setColor("2f3136")
                    .setAuthor(`${interaction.guild.name} | TICKETS`, `https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif`, 'https://discord.gg/cloudevs')
                    .setDescription(config.emojiattenction + ` \`WELCOME\`\n<@${interaction.user.id}>, Welcome in your \`PARTNER TICKET\`, explain why you opened the ticket as clearly as possible.`)
                    .setFooter("By Cloud Devs")
                    .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")

                const chiudi = new MessageButton()
                    .setLabel("Close the ticket")
                    .setStyle("SECONDARY")
                    .setEmoji("<:1128836287718248549:1174369620820492349>")
                    .setCustomId("chiudi")

                const staff = new MessageButton()
                    .setLabel("Staff Settings")
                    .setStyle("SECONDARY")
                    .setEmoji("<:MMG_staff_blue:1174372229627252786>")
                    .setCustomId("staff")

                const claim = new MessageButton()
                    .setLabel("Claim the ticket")
                    .setStyle("SECONDARY")
                    .setEmoji("<:claim:1174372466072760421>")
                    .setCustomId("claim")



                const row = new MessageActionRow()
                    .addComponents(chiudi, staff, claim)
                channel.send({ embeds: [embedd], components: [row] })
            })
        }
    })
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// CHIUDI TICKET
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on("interactionCreate", async (interaction) => {
        if (interaction.customId == "chiudi") {
            interaction.deferUpdate()

            let canale2 = interaction.message.channel.topic
            canale2 = canale2.split("・")[1]
            const utente = client.users.cache.get(canale2)

            interaction.channel.permissionOverwrites.set([
                {
                    id: interaction.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                },
                {
                    id: interaction.guild.roles.cache.get(config.idstaff),
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                },
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
            ]);
            interaction.channel.setName(`⛔・closed-ticket`)

            const embedchiuso = new MessageEmbed()
                .setColor("2f3136")
                .setFooter("By Cloud Devs")
                .setDescription(config.emojiattenction + ` Ticket closed by <@${interaction.user.id}>`)

            const closeconfirmation = new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("Confirm")
                .setEmoji("<:1083093918591221912:1174369587115065364>")
                .setCustomId("conferma")

            const riapri = new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("Reopen")
                .setEmoji("<:reopen:1174373848444063805>")
                .setCustomId("riapri")

            const row = new MessageActionRow()
                .addComponents(closeconfirmation, riapri)

            interaction.channel.send({ embeds: [embedchiuso], components: [row] })
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// CONFERMA CHIUSURA TICKET
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on('interactionCreate', async interaction => {
        if (interaction.customId == 'conferma') {
            interaction.deferUpdate()
            const logticket2 = interaction.message.guild.channels.cache.find(channel => channel.id === config.idlogs)

            let channel2 = interaction.channel.topic
            channel2 = channel2.split("・")[1]
            const user = client.users.cache.get(channel2)

            clic = interaction.user.id;

            var currentdate = new Date();
            var datetime = "" + currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " | "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            const embedd = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`<a:1051995985733226536:1174369548422627389>    The ticket will be deleted in **5** seconds`)

            const embed4 = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`<a:1051995985733226536:1174369548422627389>    The ticket will be deleted in **4** seconds`)

            const embed3 = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`<a:1051995985733226536:1174369548422627389>    The ticket will be deleted in **3** seconds`)

            const embed2 = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`<a:1051995985733226536:1174369548422627389>    The ticket will be deleted in **2** seconds`)

            const embed1 = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`<a:1051995985733226536:1174369548422627389>    The ticket will be deleted in **1** second`)

            interaction.message.edit({ embeds: [embedd] })
                .then((msg) => {

                    setTimeout(function () {

                        interaction.message.edit({ embeds: [embed4] })
                        setTimeout(function () {

                            interaction.message.edit({ embeds: [embed3] })
                            setTimeout(function () {

                                interaction.message.edit({ embeds: [embed2] })
                                setTimeout(function () {

                                    interaction.message.edit({ embeds: [embed1] })
                                }, 1000)
                            }, 1000)
                        }, 1000)
                    }, 1000)
                });

            interaction.message.channel.messages.fetch().then(async (messages) => {
                const output = messages.map(m => `${new Date(m.createdAt).toLocaleString('it-IT')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

                let response;
                try {
                    response = await sourcebin.create([
                        {
                            name: ' ',
                            content: output,
                            languageId: 'text',
                        },
                    ], {
                        title: `Ticket Logs`,
                        description: 'Cloud Devs Logs - https://discord.gg/cloudevs',
                    });
                }
                catch (e) {
                    console.log(e)
                    return
                }
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Transcript URL')
                            .setStyle('LINK')
                            .setEmoji('<:transcript:1174374236069048431>')
                            .setURL(response.url)
                    )

                try {
                    const embedlog = new MessageEmbed()
                        .setColor("2f3136")
                        .setAuthor(`${interaction.guild.name} | TICKETS`, `https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif`, 'https://discord.gg/cloudevs')
                        .addField(`${config.emojifreccia} Name`, `\`${interaction.channel.name}\``, true)
                        .addField(`${config.emojifreccia} Closed by`, `<@${interaction.user.id}>`, true)
                        .addField(`${config.emojifreccia} Opened by`, `<@${user.id}>`, true)
                        .addField(`${config.emojifreccia} Transcript:`, `[\`📄 Click here\`](${response.url})`, true)
                        .addField(`${config.emojifreccia} Closed Time`, `${datetime}`, true)
                        .setFooter("By Cloud Devs")
                        .setTimestamp()
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel('Transcript URL')
                                .setStyle('LINK')
                                .setEmoji('<:transcript:1174374236069048431>')
                                .setURL(response.url)
                        )
                    logticket2.send({ embeds: [embedlog], components: [row] })
                    await sleep(5000)
                    interaction.message.channel.delete();
                } catch (err) {
                    console.log(err)
                }
            })
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// RIAPRI TICKET
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on('interactionCreate', async interaction => {
        if (interaction.customId == 'riapri') {

            await interaction.deferUpdate()

            let channel2 = interaction.message.channel.topic
            channel2 = channel2.split("・")[1]
            const user5 = client.users.cache.get(channel2)

            const userr = await client.users.fetch(user5)


            interaction.channel.permissionOverwrites.set([
                {
                    id: user5,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                },
                {
                    id: interaction.guild.roles.cache.get(config.idstaff),
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
            ])

            interaction.channel.setName(`✅・reopened-${userr.username}`)

            const apertura = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`${config.emojisi} Ticket Reopened by <@${interaction.user.id}>`)
            const dateText = `<t:${Math.round(new Date().getTime() / 1000)}>`
            interaction.channel.send({ embeds: [apertura] }).then(msg => {
                setTimeout(() => msg.delete(), 10000)
            })

            const embeddd = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`${config.emojiattenction} <@${interaction.user.id}> reopened your **TICKET**: <#${interaction.channel.id}>\n ${interaction.channel.name}\n\n${dateText}`)

            const embedddd = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`${config.emojiattenction} <@${interaction.user.id}>, your ticket has been reopened: <#${interaction.channel.id}> - \`${interaction.channel.name}\``)

            const channel = client.channels.cache.get(config.idlogs);
            channel.send({ embeds: [embeddd] })
            user5.send({ embeds: [embedddd] })
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// CLAIMA TICKET
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on('interactionCreate', async interaction => {
        if (interaction.customId == 'claim') {

            await interaction.deferUpdate()

            const userr = await (await (interaction.guild?.members.fetch(interaction.user.id))).permissions.has("MANAGE_MESSAGES")
            if(!userr) return interaction.channel.send({embeds: [new MessageEmbed() .setColor("2f3136") .setDescription("<a:arrow:1174369804858171582> Insufficient permissions") .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")]}).then(msg => { setTimeout(() => msg.delete(), 10000) })

            let channel2 = interaction.message.channel.topic
            channel2 = channel2.split("・")[1]
            const user3 = client.users.cache.get(channel2)

            const claimer = interaction.user.id;

            const claim = new MessageEmbed()

                .setDescription(`${config.emojiattenction} A staff member has **Claimed** your ticket: ${interaction.message.channel}`)
                .setColor("#2f3136")

            user3.send({ embeds: [claim] })

            const embedd = new MessageEmbed()
                .setColor("#2f3136")
                .setAuthor(`${interaction.guild.name} | TICKETS`, `https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif`, 'https://discord.gg/cloudevs')
                .setDescription(config.emojiattenction + ` \`WELCOME\`\n<@${interaction.user.id}>, Welcome in your \`TICKET\`, explain why you opened the ticket as clearly as possible.\n Claimato da <@${interaction.user.id}>`)
                .setFooter("By Cloud Devs")
                .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")

            const chiudi = new MessageButton()
                .setLabel("Close the ticket")
                .setStyle("SECONDARY")
                .setEmoji("<:1128836287718248549:1174369620820492349>")
                .setCustomId("chiudi")

            const staff = new MessageButton()
                .setLabel("Staff Settings")
                .setStyle("SECONDARY")
                .setEmoji("<:MMG_staff_blue:1174372229627252786>")
                .setCustomId("staff")

            const exit = new MessageButton()
                .setLabel("Esci dal ticket")
                .setStyle("SECONDARY")
                .setEmoji("<:claim:1174372466072760421> ")
                .setCustomId("exit")

            const row = new MessageActionRow()
                .addComponents(chiudi, staff)

            await interaction.message.edit({ embeds: [embedd], components: [row] })
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// STAFF SETTINGS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on('interactionCreate', async interaction => {
        if (interaction.customId == 'staff') {

            await interaction.deferUpdate()

            const userr = await (await (interaction.guild?.members.fetch(interaction.user.id))).permissions.has("MANAGE_MESSAGES")
            if(!userr) return interaction.channel.send({embeds: [new MessageEmbed() .setColor("2f3136") .setDescription("<a:arrow:1174369804858171582> Permessi Insufficienti") .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")]}).then(msg => { setTimeout(() => msg.delete(), 10000) })
            const extra = new MessageEmbed()
                .setAuthor(`${interaction.guild.name} | TICKETS`, `https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif`, 'https://discord.gg/cloudevs')
                .setDescription(`${config.emojiattenction} **Staff Settings**\n\n<@${interaction.user.id}> these functions can only be used by **staff**`)
                .setColor("#2f3136")
                .setFooter("By Cloud Devs")

            const renom = new MessageButton()
                .setLabel('Rename Channel')
                .setStyle('SECONDARY')
                .setEmoji('<:pencil_wumpus:1174375312398766151>')
                .setCustomId('renomm')

            const poke = new MessageButton()
                .setStyle('SECONDARY')
                .setLabel("POKE")
                .setEmoji('1004704415539810364')
                .setCustomId('poke')

            const row = new MessageActionRow()
                .addComponents(renom, poke)

            interaction.followUp({ embeds: [extra], components: [row], ephemeral: true })
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// POKE
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on("interactionCreate", async interaction => {
        if (interaction.customId == 'poke') {

            await interaction.deferUpdate()

            let channel2 = interaction.message.channel.topic
            channel2 = channel2.split("・")[1]
            const user3 = client.users.cache.get(channel2)

            const embedate = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`${config.emojiattenction} ${interaction.member.toString()} notification sent to ${user3}`)


            const embedalui = new MessageEmbed()
                .setColor("2f3136")
                .setDescription(`Hey ${user3}, ${interaction.member.toString()} asked for a response in your ticket: <#${interaction.channel.id}>, if you don't reply your ticket will automatically be **closed**`)

            const buttonalui = new MessageButton()
                .setStyle("LINK")
                .setLabel('Go to the ticket')
                .setEmoji("<:claim:1174372466072760421> ")
                .setURL(`https://discord.com/channels/${config.guildid}/${interaction.channel.id}`)

            const row = new MessageActionRow()
                .addComponents(buttonalui)

            interaction.followUp({ embeds: [embedate], ephemeral: true })
            user3.send({ embeds: [embedalui], components: [row] })
        }
    })



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// RENOM MODAL
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on('interactionCreate', async interaction => {
        if (interaction.customId == 'renomm') {
            const modal2 = new Modal()
                .setCustomId('m3')
                .setTitle('Rename the ticket');
            const id = new TextInputComponent()
                .setCustomId('name')
                .setLabel("New Name")
                .setStyle('SHORT')
                .setMaxLength(10)
                .setMinLength(3)
            const motivo = new TextInputComponent()
                .setCustomId('motivo')
                .setLabel("Reason")
                .setStyle('SHORT')
                .setMaxLength(30)
                .setMinLength(2)
            const idRow = new MessageActionRow().addComponents(id);
            const motivoRow = new MessageActionRow().addComponents(motivo);
            modal2.addComponents(idRow, motivoRow);
            await interaction.showModal(modal2);
        }
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// RENAME FUNCTION
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on('interactionCreate', async interaction => {
        if (interaction.customId == 'm3') {

            const perm = new MessageEmbed()
                .setDescription(`${config.emojino} <@${interaction.user.id}>, You do not have permission to run this command`)
                .setColor("#2f3136")

            let channel2 = interaction.message.channel.topic
            channel2 = channel2.split("・")[1]
            const user5 = client.users.cache.get(channel2)

            const userrrr = await client.users.fetch(user5)

            const userr = await (await (interaction.guild?.members.fetch(interaction.user.id))).permissions.has("MANAGE_MESSAGES")
            if (!userr) {
                return interaction.followUp({ embeds: [perm], ephemeral: true })
            }
            const name = interaction.fields.getTextInputValue('name');
            const mo = interaction.fields.getTextInputValue('motivo');
            const dateText = `<t:${Math.round(new Date().getTime() / 1000)}>`
            const canale = client.channels.cache.get(config.idlogs);

            const embeddd = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`${config.emojifreccia} <@${interaction.user.id}> renamed the ticket: ${interaction.channel} - \`${interaction.channel.name}\n${config.emojifreccia} Nuovo Nome: 👤・ticket-${name}\n\nMotivo: \`\`\`${mo}\`\`\`\n\n${dateText}`)
            const negro = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`${config.emojifreccia} <@${interaction.user.id}> you renamed the ticket, new name: ${name}`)
            canale.send({ embeds: [embeddd] });
            interaction.channel.setName(`👤・${name}-${userrrr.username}`)
            interaction.reply({ embeds: [negro], ephemeral: true })
        }
    });

  //boost-server

const { measureMemory } = require('vm');
const { match } = require('assert');
const { send } = require("process");

client.on("guildMemberBoost", (member) => {

  let canale = member.guild.channels.cache.get("1174075873293504574"); //id canale boost

  let embed = new MessageEmbed()
  .setColor("2f3136")
  .setTitle(`Boost`)
  .setFooter({text: "By Cloud Devs", iconURL: member.user.avatarURL({ dynamic: true})})
  .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
  .addFields(
      {
          name: `> User:`,
          value: `${member}`,
          inline: true
      }
  )
  .setThumbnail(member.displayAvatarURL({ dynamic: true }));

  canale.send({ embeds: [embed] });

});

//form
client.on("messageCreate", message => {
    if (message.content === "!form") {
      var embed = new MessageEmbed()
      .setAuthor("Cloud Development -  Form", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
      .setColor("2f3136")
      .setDescription("Form System / Module By Cloud Development\n\n info ==> <#1174075869376041184>")
      .setFooter("🤍 By Cloud Development", "")
      .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
  
      var bottone = new MessageButton()
      .setLabel("Form")
      .setEmoji("<:EMOJI1CLOUD:1031645695465242735>")
      .setCustomId("form")
      .setStyle("SECONDARY")
  
      var row = new MessageActionRow().addComponents(bottone)
  
      message.channel.send({ embeds: [embed], components: [row]})
    }
  })
  
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == 'form') {
      const modal = new Modal()
        .setCustomId('form')
        .setTitle('Form Section - Cloud Development');
      const nome = new TextInputComponent()
        .setCustomId('Name')
        .setLabel("Question 1")
        .setPlaceholder("Answer 1...")
        .setStyle('SHORT')
        .setMaxLength(50)
        .setMinLength(1)
      const età = new TextInputComponent()
        .setCustomId('Age')
        .setLabel("Question 2")
        .setPlaceholder("Answer 2...")
        .setStyle('SHORT')
        .setMaxLength(20)
        .setMinLength(1)
      const esperienze = new TextInputComponent()
        .setCustomId('Experience')
        .setLabel("Question 3")
        .setStyle('SHORT')
        .setPlaceholder("Answer 3...")
        .setMaxLength(300)
        .setMinLength(1)
      const competenze = new TextInputComponent()
        .setCustomId('Skills')
        .setLabel("Question 4")
        .setStyle('SHORT')
        .setPlaceholder("Answer 4...")
        .setMaxLength(600)
        .setMinLength(1)
      const idRow = new MessageActionRow().addComponents(nome);
      const id2Row = new MessageActionRow().addComponents(età);
      const punishRow = new MessageActionRow().addComponents(competenze);
      const reasonRow = new MessageActionRow().addComponents(esperienze);
      modal.addComponents(idRow, id2Row, reasonRow, punishRow);
      await interaction.showModal(modal);
    }
  })
  
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == 'form') {
    
      interaction.deferUpdate()
      const guild = client.guilds.cache.get(config.idserver); 
      const i = interaction.fields.getTextInputValue('Name');
      const i2 = interaction.fields.getTextInputValue('Age');
      const mo = interaction.fields.getTextInputValue('Experience');
      const punish = interaction.fields.getTextInputValue('Skills');
      const dateText = `<t:${Math.round(new Date().getTime() / 1000)}>`
      const logbandi = client.channels.cache.get("1174075841479712770");
      const logbandiaccorrif = client.channels.cache.get("1174075841479712770");
  
     
          const canalebando = new MessageEmbed()
            .setColor("#2f3136")
            .setAuthor("Nuovo Form Cloud Development", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif", "https://cloudevelopment")
            .setDescription(`Autore: ${interaction.user.toString()}\n\nQuestion 1: \`\`\`${i}\`\`\`\nQuestion 2: \`\`\`${i2}\`\`\`\nQuestion 3: \`\`\`${mo}\`\`\`\nQuestion 4: \`\`\`${punish}\`\`\``)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter("🤍 By Cloud Development", "")
  
          const accetta = new MessageButton()
            .setLabel('Accept Form')
            .setEmoji('<a:ok:1174369867495899177>')
            .setStyle('SUCCESS')
            .setCustomId('accettabando')
  
          const rifiuta = new MessageButton()
            .setLabel('Reject Form')
            .setEmoji('<a:no:1174369828199485531>')
            .setStyle('DANGER')
            .setCustomId('rifiutabando')
  
          const buttons = new MessageActionRow()
            .addComponents(accetta, rifiuta)
        
            logbandi.send({ embeds: [canalebando], components: [buttons] });
            interaction.user.send({ content: "You have successfully submitted your form, wait for the result in the room <#1174075894017568848>"}).catch()
    }
  });
  
  
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == "accettabando") {

        interaction.deferUpdate()

        interaction.user.send({ content: `Your form has been accepted by the staff ${interaction.user.toString()}, Well done!`}).catch()
}
  
    if (interaction.customId == "rifiutabando") {

      interaction.deferUpdate()

      interaction.user.send({ content: `Your form was rejected by the staff ${interaction.user.toString()}, you can try again!`}).catch()
    }
  })

  //verifica
  client.on('messageCreate', async message => {
    if (message.content == '!ver') {
      var button = new MessageButton()
        .setLabel('Verify')
        .setEmoji('<:1083093918591221912:1174369587115065364>')//id emoji
        .setStyle('SUCCESS')
        .setCustomId('ciaos')
      var embed = new MessageEmbed()
        .setColor('#2f3136')
        .setTitle("Cloud Devs", "cloudevs")
        .setDescription("```Verify```\n\n Press the button below to verify yourself on the **Cloud Devs** <a:discord:1174369751032664064>")
        .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
        .setFooter("By Cloud Devs")
      var row = new MessageActionRow()
        .addComponents(button)
  
        message.channel.send({ embeds: [embed], components: [row] })
    }
  })
  
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == "ciaos") {
  
   var embed2 = new MessageEmbed()
        .setTitle("**Log Verification**")
        .setColor('#2f3136')
        .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
        .setTimestamp()
        .addFields(
          {
            name: "<a:arrow:1174369804858171582> User:",
            value: `${interaction.user} - (\`${interaction.user.id} - ${interaction.user.tag}\`)`
          }
        )
        .setDescription(`<a:ok:1174369867495899177> User ${interaction.user} occurred!`)
  
      client.channels.cache.get("1174075824400502824").send({ //Id canale Log
        embeds: [
          embed2
        ]
      });
      interaction.member.roles.add('1174075761527881749')//qua metti id del ruolo 
  
      interaction.reply({ content: `${interaction.member.toString()}, you got the role <@1174075761527881749> with success. <a:ok:1174369867495899177>`, ephemeral: true })
    }
  })

  // suggest

client.on('messageCreate', async (message, args) => {
    let negro = message.content.slice(0);
    if (message.author.bot) return;
  if (message.channel.id === "1174075868700741743") { //id canale
    if (message.attachments && message.content === "") { //non mettere nulla
     message.delete()
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor("2f3136")
                    .setAuthor({ name: `New Suggestion`, iconURL: "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif" })
                    .setImage(message.attachments.first().proxyURL)
                    .setFooter(`Sent By: ${message.author.username}`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
                    .setTimestamp(),
            ],
        }).then(msg => {
          msg.react("<:1083093918591221912:1174369587115065364>")
          msg.react("<:1128836287718248549:1174369620820492349>")
        })
    } else {
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor("2f3136")
                    .setAuthor({ name: `New Suggestion`, iconURL: "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif" })
                    .setDescription(`\`\`\`${message.content}\`\`\`\nSent by: <@${message.author.id}>`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
                    .setTimestamp(),
            ],
        }).then(msg => {
          msg.react("<:1083093918591221912:1174369587115065364>")
          msg.react("<:1128836287718248549:1174369620820492349>")
        })
        message.delete()
    }
  }
});

//clear

client.on("messageCreate", async message => {
    const dateText = `<t:${Math.round(new Date().getTime() / 1000)}>` 
    var count = parseInt(message.content.split(/\s+/)[1]);
  
    var embed1 = new MessageEmbed()
    .setDescription(`<@${message.author.id}> **Insufficient permissions**`)
    .setColor("2f3136")
  
    var embed2 = new MessageEmbed()
    .setDescription(`<@${message.author.id}> I don't have permission to do this.`)
    .setColor("2f3136")
  
    var embed3 = new MessageEmbed()
    .setDescription(`<@${message.author.id}> Enter a number between 1 and 100`)
    .setColor("2f3136")
  
    var embed4 = new MessageEmbed()
    .setDescription(`<@${message.author.id}> I cannot delete more than 100 messages`)
    .setColor("2f3136")
  
    var embed4 = new MessageEmbed()
    .setDescription(`\`${count}\`` + " Deleted messages")
    .setColor("2f3136")
  
    var embed5 = new MessageEmbed()
    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`})
    .setDescription(`\`Command Used==> !clear\``)
    .addField("Deleted messages: ", `\`${count}\``, true)
    .addField("Eliminated by: ", `<@${message.author.id}>`, false)
    .addField("Date: ", `${dateText}`, true)
    .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
    .setFooter({text: "By Cloud Devs"})
    .setColor("2f3136")
  
    if (message.content.startsWith("!clear")) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            message.delete()
            return message.channel.send({ embeds: [embed1] }).then(msg => {
                setTimeout(() => msg.delete(), 4000)
              })
        }
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            message.delete()
            return message.channel.send({ embeds: [embed2] }).then(msg => {
                setTimeout(() => msg.delete(), 4000)
              })
        }
        if (!count) {
            message.delete()
            return message.channel.send({ embeds: [embed3] }).then(msg => {
                setTimeout(() => msg.delete(), 4000)
              })
        }
        if (count > 100) {
            message.delete()
            return message.channel.send({ embeds: [embed4] }).then(msg => {
                setTimeout(() => msg.delete(), 4000)
              })
        }
        message.channel.bulkDelete(count, true)
        message.channel.send({ embeds: [embed4] }).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    const guild = await client.guilds.cache.get("1163936088604287177"); //ID SERVER
    const channel = guild.channels.cache.get("1174075846525472781"); //ID CANALE
        channel.send({embeds : [embed5]})
    }
  })
  ////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////PARTNER//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  client.on("messageCreate", async (message) => {
    if (message.content == "!partner") {
      message.delete()
      const userr = await (await (message.guild?.members.fetch(message.author.id))).permissions.has("MANAGE_MESSAGES")
      if(!userr) return message.channel.send({embeds: [new MessageEmbed() .setColor("2f3136") .setDescription("<a:arrow:1174369804858171582> Insufficent Permission") .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")]}).then(msg => { setTimeout(() => msg.delete(), 10000) })
      const partnerm = new MessageEmbed()
        .setColor("2f3136")
        .setDescription("<a:arrow:1174369804858171582> Welcome to the official partner system of **💙 Cloud Development**\n\n> The partner system is automatic, **so please respond validly to all boxes in the menu**")
        .setFooter("💙 By Cloud Development")
        .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
        
      const partnermenu = new MessageButton()
        .setCustomId("menu")
        .setLabel("Start")
        .setStyle("SECONDARY")
        .setEmoji("<:1139907542840000642:1174369653720625213>")
  
      const row = new MessageActionRow()
        .addComponents(partnermenu)
  
      message.channel.send({ embeds: [partnerm], components: [row] })
    }
  })
  
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == 'menu') {
      const userr = await (await (interaction.guild?.members.fetch(interaction.user.id))).permissions.has("MANAGE_MESSAGES")
      if(!userr) return interaction.channel.send({embeds: [new MessageEmbed() .setColor("2f3136") .setDescription("<a:arrow:1174369804858171582> Permessi Insufficienti") .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")]}).then(msg => { setTimeout(() => msg.delete(), 10000) })
      const modal = new Modal()
        .setCustomId('menumodal')
        .setTitle('Partner System');
      const name = new TextInputComponent()
        .setCustomId('name')
        .setLabel("Server Name")
        .setPlaceholder("Write the server name...")
        .setStyle('SHORT')
        .setMaxLength(30)
        .setMinLength(1)
      const membri = new TextInputComponent()
        .setCustomId('membri')
        .setLabel("Number of server members")
        .setPlaceholder("Write the number of server members...")
        .setStyle('SHORT')
        .setMaxLength(5)
        .setMinLength(1)
      const invite = new TextInputComponent()
        .setCustomId('invite')
        .setLabel("Invite")
        .setStyle('SHORT')
        .setPlaceholder("Write the server invitation...")
        .setMaxLength(30)
        .setMinLength(2)
      const descrizione = new TextInputComponent()
        .setCustomId('descrizione')
        .setLabel("(OPZIONALE) Description")
        .setStyle('SHORT')
        .setPlaceholder("Write the server description...")
        .setMaxLength(400)
        .setMinLength(2)
        .setRequired(false)
      const namerow = new MessageActionRow().addComponents(name);
      const membrirow = new MessageActionRow().addComponents(membri);
      const inviterow = new MessageActionRow().addComponents(invite);
      const descrizionerow = new MessageActionRow().addComponents(descrizione);
      modal.addComponents(namerow, membrirow, inviterow, descrizionerow);
      await interaction.showModal(modal);
    }
  })
  
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == 'menumodal') {
      interaction.deferUpdate()
      const guild = await client.guilds.cache.get("1163936088604287177"); //guild id
      const name = interaction.fields.getTextInputValue('name');
      const membri = interaction.fields.getTextInputValue('membri');
      const invite = interaction.fields.getTextInputValue('invite');
      const descrizione = interaction.fields.getTextInputValue('descrizione');
      const dateText = `<t:${Math.round(new Date().getTime() / 1000)}>`
      if (!name) return interaction.reply({ content: `<a:arrow:1174369804858171582> Invalid Server Name`, ephemeral: true });
      if (!invite) return interaction.reply({ content: `<a:arrow:1174369804858171582> Invalid Server Invite`, ephemeral: true });
      if (isNaN(membri)) return interaction.reply({ content: `<a:arrow:1174369804858171582> Member Number Invalid, must be a number`, ephemeral: true });
      const canalewarn2 = client.channels.cache.get("1174399289896743053");
        const canalewarn = new MessageEmbed()
          .setColor("#2f3136")
          .setAuthor("NEW PARTNER Registrata", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif", "https://discord.gg/cloudevs")
          .addField("<a:arrow:1174369804858171582> NAME", `${name}`, true)
          .addField("<a:arrow:1174369804858171582> MEMBER", `${membri}`, true)
          .addField("<a:arrow:1174369804858171582> INVITE", `${invite}`, false)
          .addField("<a:arrow:1174369804858171582> DESCRIPTION", `${descrizione}` ? `${descrizione}` : `Nessuna Descizione`, false)
          .addField("<a:arrow:1174369804858171582> REGISTERED BY", `<@${interaction.user.id}> - \`${interaction.user.id}\``, false)
          .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
        canalewarn2.send({ embeds: [canalewarn] });
      const membri2 = interaction.fields.getTextInputValue('membri');
      if (isNaN(membri2)) return interaction.reply({ content: `<a:arrow:1174369804858171582> Member Number Invalid, must be a number`, ephemeral: true });
      const name2 = interaction.fields.getTextInputValue('name');
      const invite2 = interaction.fields.getTextInputValue('invite');
      const descrizione2 = interaction.fields.getTextInputValue('descrizione');
      if (membri2 > 1000) {
        let channel = interaction.guild.channels.create(`🤝・${name2}`, {
          parent: ('1174075850992398407'),
          topic: ``,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: ['VIEW_CHANNEL'],
            },
            {
              id: interaction.guild.id,
              deny: ['SEND_MESSAGES'],
            },
          ],
          type: 'text',
        }).then(async channel => {
          channel.send(`||@everyone||`)
          descrizione2 ? channel.send({ content: `**NEW PARTNER** - \`${name2}\`\n${descrizione2}\n${invite2}`}) : channel.send({ content: `**NEW PARTNER** - \`${name2}\`\n${invite2}`})
        });
      }
      if (membri2 == 1000) {
        let channel = interaction.guild.channels.create(`🤝・${name2}`, {
          parent: ('1174075850992398407'),
          topic: ``,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: ['VIEW_CHANNEL'],
            },
            {
              id: interaction.guild.id,
              deny: ['SEND_MESSAGES'],
            },
          ],
          type: 'text',
        }).then(async channel => {
          channel.send(`||@everyone||`)
          descrizione2 ? channel.send({ content: `**NEW PARTNER** - \`${name2}\`\n${descrizione2}\n${invite2}`}) : channel.send({ content: `**NEW PARTNER** - \`${name2}\`\n${invite2}`})
        });
      }
      if (membri2 < 1000) {
        const partnerchannel = client.channels.cache.get("1174075896639000727")
        descrizione2 ? partnerchannel.send({ content: `**NEW PARTNER** - \`${name2}\`\n${descrizione2}\n${invite2}`}) : partnerchannel.send({ content: `**NEW PARTNER** - \`${name2}\`\n${invite2}`})
      }
    }
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// BANDI STAFF
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("messageCreate", async (message) => {
    if (message.content == "!bando") {
        const embed = new MessageEmbed()
            .setAuthor("Cloud Development", 'https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif')
            .setColor("#2f3136")
            .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
            .setDescription("```STAFF APPLICATION```\n\n<a:arrow:1174369804858171582> Press the button below to complete the staff apply. You will be contacted privately if the staff apply is accepted")
       
          


            const row = new MessageActionRow()
            .addComponents(new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Start Staff Apply")
                .setCustomId("bando")
                .setEmoji("📬")
            )
      message.delete()
      message.channel.send({ embeds: [embed], components: [row] })
  }
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId == "bando") {
      const modal2 = new Modal()
          .setCustomId('modal')
          .setTitle('💙 Cloud Development');
      const domanda1 = new TextInputComponent()
          .setCustomId('domanda1')
          .setLabel("Name")
          .setStyle('SHORT')
          .setMaxLength(10)
          .setMinLength(1)
      const domanda2 = new TextInputComponent()
          .setCustomId('domanda2')
          .setLabel("Age (min 15)")
          .setStyle('SHORT')
          .setMaxLength(2)
          .setMinLength(2)
      const domanda3 = new TextInputComponent()
          .setCustomId('domanda3')
          .setLabel("Describe yourself (min 20)")
          .setStyle('SHORT')
          .setMaxLength(200)
          .setMinLength(20)
      const domanda4 = new TextInputComponent()
          .setCustomId('domanda4')
          .setLabel("Hourly Availability")
          .setStyle('SHORT')
          .setMaxLength(30)
          .setMinLength(2)
      const domanda5 = new TextInputComponent()
          .setCustomId('domanda5')
          .setLabel("Knowledge in Programming")
          .setStyle('SHORT')
          .setMaxLength(200)
          .setMinLength(2)
      
      
      const domanda1row = new MessageActionRow().addComponents(domanda1);
      const domanda2row = new MessageActionRow().addComponents(domanda2);
      const domanda3row = new MessageActionRow().addComponents(domanda3);
      const domanda4row = new MessageActionRow().addComponents(domanda4);
      const domanda5row = new MessageActionRow().addComponents(domanda5);
      
      modal2.addComponents(domanda1row, domanda2row,domanda3row,domanda4row,domanda5row);
      await interaction.showModal(modal2);
  }
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId == "modal") {

      interaction.deferUpdate()

      const domanda1 = interaction.fields.getTextInputValue("domanda1")
      const domanda2 = interaction.fields.getTextInputValue("domanda2")
      const domanda3 = interaction.fields.getTextInputValue("domanda3")
      const domanda4 = interaction.fields.getTextInputValue("domanda4")
      const domanda5 = interaction.fields.getTextInputValue("domanda5")
      

      const logbandi = client.channels.cache.get("1174075841479712770")
      
            const embed132 = new MessageEmbed()
            .setColor("#2f3136")
            .setAuthor("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
            .setTitle("<a:downdownloadarro:1174369764731261058> New Staff Apply Registered")
            .setDescription(`<:user_icon:1174369966460506254> Autor: ${interaction.user.toString()}\n\n *<a:arrow:1174369804858171582> ・Name:* \`\`\`${domanda1}\`\`\`\n *<a:arrow:1174369804858171582> ・Age:* \`\`\`${domanda2}\`\`\`\n *<a:arrow:1174369804858171582> ・Describe yourself:* \`\`\`${domanda3}\`\`\`\n *<a:arrow:1174369804858171582> ・Hourly availability:* \`\`\`${domanda4}\`\`\`\n*<a:arrow:1174369804858171582>Knowledge in Programming:* \`\`\`${domanda5}\`\`\`\n *<a:arrow:1174369804858171582>・ID:* \`\`\`${interaction.user.id.toString()}\`\`\`\n *<a:arrow:1174369804858171582>・Please note:* \`\`\`Before accepting or rejecting the announcement, remember to copy the person's ID\`\`\``)
            .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")

            const row = new MessageActionRow()
            .addComponents(new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Accept")
                .setCustomId("accetta")
                .setEmoji("<:1083093918591221912:1174369587115065364>"),
                new MessageButton()
                    .setStyle("DANGER")
                    .setCustomId("rifiuta")
                    .setLabel("Reject")
                    .setEmoji("<:1128836287718248549:1174369620820492349>")
            )

              
          logbandi.send({ embeds: [embed132], components: [row] });
          interaction.user.send({ content: "*Your **apply** has been successfully sent to the staff* <a:ok:1174369867495899177>"}).catch()

      }
  }
)
client.on("interactionCreate", async (interaction) => {
  if (interaction.customId == "accetta") {
      const modala = new Modal()
          .setCustomId('modalaccetta')
          .setTitle('💙 Cloud Development');
      const accettab2 = new TextInputComponent()
          .setCustomId('accettab')
          .setLabel("MEMBER ID")
          .setStyle('SHORT')
          .setMaxLength(400)
          .setMinLength(1)
      const accettab1 = new MessageActionRow().addComponents(accettab2);
      modala.addComponents(accettab1);
      await interaction.showModal(modala);
    
    // Disabilita i pulsanti
    const disabledRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("SECONDARY")
          .setLabel("Accept")
          .setCustomId("accetta")
          .setEmoji("<:1083093918591221912:1174369587115065364>")
          .setDisabled(true),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("rifiuta")
          .setLabel("Reject")
          .setEmoji("<:1128836287718248549:1174369620820492349>")
          .setDisabled(true)
      );

    await interaction.message.edit({ components: [disabledRow] });
  }
});
client.on("interactionCreate", async (interaction) => {
  if (interaction.customId == "modalaccetta") {

      interaction.deferUpdate()

      const accettab3 = interaction.fields.getTextInputValue("accettab")
      const channel2 = client.channels.cache.get("1174075841479712770") //id canale
      const guild = client.guilds.cache.get("1163936088604287177"); //id server
      const embed = new MessageEmbed()
          .setAuthor("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setColor("#2f3136")
          .setDescription(`${interaction.member.toString()} accepted the apply to <@${accettab3}>`)
          .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setFooter("By Cloud Devs")
      channel2.send({ embeds: [embed] })
      const channelesiti = client.channels.cache.get("1174075894017568848") //id canale
      const embedesiti = new MessageEmbed()
          .setAuthor("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setColor("#2f3136")
          .setDescription(`\`\`\`Staff Apply Results\`\`\` \n\n <a:arrow:1174369804858171582> The **staff** ${interaction.member.toString()} **accepted** the apply to <@${accettab3}>`)
          .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setFooter("By Cloud Devs")
      channelesiti.send({ embeds: [embedesiti] })
      
      let utente = guild.members.cache.get(accettab3)
      const embed5 = new MessageEmbed()
          .setAuthor("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setColor("#2f3136")
          .setDescription("Hi, to check your outcome, the staff take a look at the room <#1174075894017568848>")
          .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setFooter("By Cloud Devs")

      const buttonalui4 = new MessageButton()
          .setStyle("LINK")
          .setLabel("Go to the outcome")
          .setEmoji("<:claim:1174372466072760421> ")
          .setURL(`https://discord.com/channels/${config.guildid}/1087823174164545536`)
          const row = new MessageActionRow()
     .addComponents(buttonalui4)

      utente.send({ embeds: [embed5], components: [row] })
      utente.roles.add("1174075756087885824")

  }
})
client.on("interactionCreate", async (interaction) => {
  if (interaction.customId == "rifiuta") {
      const modala2 = new Modal()
          .setCustomId('modalrifiuta')
          .setTitle("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif");
      const rifiutab2 = new TextInputComponent()
          .setCustomId('rifiutab')
          .setLabel("MEMBER ID")
          .setStyle('SHORT')
          .setMaxLength(400)
          .setMinLength(1)
      const rifiutab1 = new MessageActionRow().addComponents(rifiutab2);
      modala2.addComponents(rifiutab1);
      await interaction.showModal(modala2);
      
    const disabledRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Accept")
        .setCustomId("accetta")
        .setEmoji("<:1083093918591221912:1174369587115065364>")
        .setDisabled(true),
      new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId("rifiuta")
        .setLabel("Reject")
        .setEmoji("<:1128836287718248549:1174369620820492349>")
        .setDisabled(true)
    );

  await interaction.message.edit({
    components: [disabledRow],
  });
}
});
client.on("interactionCreate", async (interaction) => {
  if (interaction.customId == "modalrifiuta") {

      interaction.deferUpdate()
      const guild = client.guilds.cache.get("1163936088604287177");
      const rifiutab3 = interaction.fields.getTextInputValue("rifiutab")
      const channel3 = client.channels.cache.get("1174075841479712770")

      const embed3 = new MessageEmbed()
          .setAuthor("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setColor("#2f3136")
          .setDescription(`${interaction.member.toString()} refused the apply to <@${rifiutab3}>`)
          .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setFooter("By Cloud Devs")
      channel3.send({ embeds: [embed3] })
      const channelesiti2 = client.channels.cache.get("1174075894017568848") //id canale
      const embedesiti2 = new MessageEmbed()
          .setAuthor("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setColor("#2f3136")
          .setDescription(`\`\`\`Staff Apply Results\`\`\` \n\n <a:arrow:1174369804858171582> The **staff** ${interaction.member.toString()} **refused** apply to <@${rifiutab3}>`)
          .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setFooter("By Cloud Devs")
      channelesiti2.send({ embeds: [embedesiti2] })
      let utente = guild.members.cache.get(rifiutab3)
      const embed4 = new MessageEmbed()
          .setAuthor("Cloud Devs", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setColor("#2f3136")
          .setDescription("Hi, to check your outcome, the staff take a look at the room <#1174075894017568848>")
          .setThumbnail("https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
          .setFooter("By Cloud Devs")

      const buttonalui3 = new MessageButton()
          .setStyle("LINK")
          .setLabel("Go to outcome")
          .setEmoji("<:claim:1174372466072760421> ")
          .setURL(`https://discord.com/channels/${config.guildid}/1174075894017568848`)
          const row = new MessageActionRow()
  .addComponents(buttonalui3)

      utente.send({ embeds: [embed4], components: [row] })

  }
});

//benvenuto
client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    const guild = ("1163936088604287177")
    var embed = new MessageEmbed()
  
        .setDescription(`**Welcome ${member.toString()} on Cloud Development**\nMake sure you have read the rules in <#1174075862824517654>\n**Total Member: ${member.guild.memberCount}**`)
        .setAuthor("Cloud Development", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
        .setColor("#2f3136")
        .setThumbnail(member.user.avatarURL({ dynamic: true}))
        .setFooter("By Cloud Development", "https://cdn.discordapp.com/attachments/1031619677761310780/1031623349698302012/Cloud_Gif.gif")
        
    client.channels.cache.get("1174075860819652678").send({embeds: [embed]}); //id canale benvenuto
  })
