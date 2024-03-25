const config = require('../config.json');
const {Webhook, MessageBuilder} = require('discord-webhook-node');

module.exports = function(app, connection, faxtrack) {

    faxtrack.on('issueSolved', function(userObject, solveObject, issueObject) {
        connection.query(`SELECT * FROM projects WHERE id = ${issueObject?.proId || 0}`, function(err, project) {
            if(err) throw err;
            if(!project[0]) return;
            if(project[0]?.discordWebhook?.startsWith('https://')) {
                connection.query(`SELECT id,username FROM users WHERE id = ${issueObject?.userId || 0}`, function(err, user) {
                    if(!user[0]) user[0] = {username: 'Unknown User', id: 1};
                    if(solveObject.status == 'Solved') {
                        hook = new Webhook(project[0]?.discordWebhook)
                        let embed = new MessageBuilder()
                            .setURL(`${config.siteInformation.domain}/i/${issueObject.id}`)
                            .setTitle(`Issue Solved`)
                            .setColor('#90BE6D')
                            .setDescription(`[${issueObject.title}](${config.siteInformation.domain}/i/${issueObject.id}) has been fixed on version \`v${solveObject.fixversion}\`.\n*Shoutout to [${user[0].username}](${config.siteInformation.domain}/account/${user[0].id}) for reporting this issue!*`);
                        hook.send(embed).catch(err => {});
                    } else if(solveObject.status == 'Work In Progress') {
                        hook = new Webhook(project[0]?.discordWebhook)
                        let embed = new MessageBuilder()
                            .setURL(`${config.siteInformation.domain}/i/${issueObject.id}`)
                            .setTitle(`Work In Progress`)
                            .setColor('#F9C74F')
                            .setDescription(`[${issueObject.title}](${config.siteInformation.domain}/i/${issueObject.id}) has been updated to status 'Work In Progress'. Updates to come soon.`);
                        hook.send(embed).catch(err => {});
                    } else if(solveObject.status == 'Awaiting Reply') {
                        hook = new Webhook(project[0]?.discordWebhook)
                        let embed = new MessageBuilder()
                            .setURL(`${config.siteInformation.domain}/i/${issueObject.id}`)
                            .setTitle(`Awaiting Reply`)
                            .setColor('#277da1')
                            .setDescription(`[${issueObject.title}](${config.siteInformation.domain}/i/${issueObject.id}) is now awaiting reply from the [reporting party](${config.siteInformation.domain}/account/${user[0].id}).`);
                        hook.send(embed).catch(err => {});
                    }
                });
            }
        });
    });
    faxtrack.on('feedbackSolved', function(userObject, solveObject, issueObject) {
        connection.query(`SELECT * FROM projects WHERE id = ${issueObject?.proId || 0}`, function(err, project) {
            if(!project[0]) return;
            if(project[0]?.discordWebhook?.startsWith('https://')) {
                connection.query(`SELECT id,username FROM users WHERE id = ${issueObject?.userId || 0}`, function(err, user) {
                    if(!user[0]) user[0] = {username: 'Unknown User', id: 1};
                    if(solveObject.status == 'Solved') {
                        hook = new Webhook(project[0]?.discordWebhook)
                        let embed = new MessageBuilder()
                            .setURL(`${config.siteInformation.domain}/i/${issueObject.id}`)
                            .setTitle(`Feedback Closed`)
                            .setColor('#90BE6D')
                            .setDescription(`[${issueObject.title}](${config.siteInformation.domain}/f/${issueObject.id}) has been resolved on version \`v${solveObject.fixversion}\`.\n*Shoutout to [${user[0].username}](${config.siteInformation.domain}/account/${user[0].id}) for the feedback!*`);
                        hook.send(embed).catch(err => {});
                    } else if(solveObject.status == 'Work In Progress') {
                        hook = new Webhook(project[0]?.discordWebhook)
                        let embed = new MessageBuilder()
                            .setURL(`${config.siteInformation.domain}/i/${issueObject.id}`)
                            .setTitle(`Work In Progress`)
                            .setColor('#F9C74F')
                            .setDescription(`[${issueObject.title}](${config.siteInformation.domain}/i/${issueObject.id}) has been updated to status 'Work In Progress'. Updates to come soon.`);
                        hook.send(embed).catch(err => {});
                    } else if(solveObject.status == 'Awaiting Reply') {
                        hook = new Webhook(project[0]?.discordWebhook)
                        let embed = new MessageBuilder()
                            .setURL(`${config.siteInformation.domain}/i/${issueObject.id}`)
                            .setTitle(`Awaiting Reply`)
                            .setColor('#277da1')
                            .setDescription(`[${issueObject.title}](${config.siteInformation.domain}/i/${issueObject.id}) is now awaiting reply from the [reporting party](${config.siteInformation.domain}/account/${user[0].id}).`);
                        hook.send(embed).catch(err => {});
                    }
                });
            }
        });
    });
}