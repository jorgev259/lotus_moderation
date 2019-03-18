let lastID = {}

module.exports = {
  events: {
    async ready (client, db, moduleName) {
      client.guilds.each(async guild => {
        let log = (await guild.fetchAuditLogs({ limit: 1, type: 72 })).entries.first()
        lastID[guild.id] = log.id || undefined
      })

      // client.channels.find(c => c.name === 'admin').send('Killer of wonder has restarted!')
    },

    async messageDelete (client, db, moduleName, msg) {
      let log = (await msg.guild.fetchAuditLogs({
        limit: 1,
        type: 72
      })).entries.first()

      if (log.id !== lastID[msg.guild.id]) {
        lastID[msg.guild.id] = log.id
        let embed = {
          embed: {
            description: `${log.executor.tag} deleted a message from ${
              log.target.tag
            } on #${log.extra.channel.name}`,
            color: 13556890,
            fields: [
              {
                name: 'Deleted Message',
                value: msg.content
              }
            ]
          }
        }

        if (msg.attachments.size > 0) {
          embed.files = msg.attachments.map(function (att) {
            return { name: att.file ? att.file.name : 'unknown', attachment: att.proxyURL }
          })
        }
        if (embed.embed.fields[0].value) { msg.guild.channels.find(c => c.name === 'admin-log').send(embed) }
      }
    }
  }
}
