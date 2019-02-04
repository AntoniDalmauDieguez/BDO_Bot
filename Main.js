import express from 'express'
import request from 'request'

import { getCommand } from './structCommands'
import { getBoss } from './structBosses'
import { getDayTimetable } from './structBossTimetable'
import { getSurvey } from './structSurveys'

const { PORT, DISCORD_API_TOKEN, PROJECT_DOMAIN } = process.env

// Bot
var Discord = require("discord.js");
var bot = new Discord.Client();


const printBossSpawn = function(d, msg) {
  //msg.channel.send((d.getHours()+1+d.getMinutes()/100))
  //msg.channel.send(d.getMinutes()/100)
  //msg.channel.send(getDayTimetable('horas').hora7)
  //msg.channel.send((d.getHours()+1) < getDayTimetable('horas').hora7)
  var x = " will spawn at: "
  if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora0) x = getDayTimetable('dia'+d.getDay()).hora0+x+getDayTimetable('horas').hora0+'h'
  else if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora1) x = getDayTimetable('dia'+d.getDay()).hora1+x+getDayTimetable('horas').hora1+'h'
  else if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora2) x = getDayTimetable('dia'+d.getDay()).hora2+x+getDayTimetable('horas').hora2+'h'
  else if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora3) x = getDayTimetable('dia'+d.getDay()).hora3+x+getDayTimetable('horas').hora3+'h'
  else if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora4) x = getDayTimetable('dia'+d.getDay()).hora4+x+getDayTimetable('horas').hora4+'h'
  else if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora5) x = getDayTimetable('dia'+d.getDay()).hora5+x+getDayTimetable('horas').hora5+'h'
  else if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora6) x = getDayTimetable('dia'+d.getDay()).hora6+x+getDayTimetable('horas').hora6+'h'
  else if((d.getHours()+1+d.getMinutes()/100) < getDayTimetable('horas').hora7) x = getDayTimetable('dia'+d.getDay()).hora7+x+getDayTimetable('horas').hora7+'h'
  else if((d.getDay()+1) === 6) x = getDayTimetable('dia0').hora0+x+getDayTimetable('horas').hora0+'h'
  else x = getDayTimetable('dia'+(d.getDay()+1)).hora0+x+getDayTimetable('horas').hora0+'h'
  msg.channel.send(x)
}

// This code will run once the bot receives any message.
bot.on("message", function (msg) {
  if(msg.content === '!comandos' || msg.content === '!commands') msg.channel.send(getCommand('comandos').content)
  else if(msg.content === '!cooking' || msg.content === '!cocina') msg.channel.send(getCommand('cooking').content)
  else if(msg.content === '!trade' || msg.content === '!tradeo') msg.channel.send(getCommand('trade').content)
  else if(msg.content === '!alchemy' || msg.content === '!alquimia') msg.channel.send(getCommand('alchemy').content)
  else if(msg.content === '!necklace' || msg.content === '!collar') msg.channel.send(getCommand('necklace').content)
  else if(msg.content === '!epheria') msg.channel.send(getCommand('epheria').content)
  else if(msg.content === '!gramverre' || msg.content === '!caballo') msg.channel.send(getCommand('gramverre').content)
  else if(msg.content === '!wagon' || msg.content === '!carro') msg.channel.send(getCommand('wagon').content)
  else if(msg.content === '!afk') msg.channel.send(getCommand('afk').content)
  else if(msg.content === '!normas') msg.channel.send(getCommand('normas').content)
  else if(msg.content === '!encuesta') {
    msg.channel.send(getSurvey('bossSurvey').content).then(function(msg) {
      msg.react("👎")
      msg.react("👍")
      msg.pin()
    });
  }
  else if(msg.content === '!boss') {
    var d = new Date()
    printBossSpawn(d, msg)
  }
});
bot.login(DISCORD_API_TOKEN)

// Web server
const webServer = express()
const keepalive = () => 
  PROJECT_DOMAIN &&
  request(
    { url: `https://${PROJECT_DOMAIN}.glitch.me/glitch-alive` },
    () => setTimeout(keepalive, 55000),
  )

webServer.use('/', express.static('public'))

if (PROJECT_DOMAIN)
  webServer.get('/glitch-alive', (req, res) => res.send(`I'm alive`))

webServer.listen(
  PORT,
  () => console.log(`[Express]-Listening on port ${PORT}!`) || keepalive(),
)
