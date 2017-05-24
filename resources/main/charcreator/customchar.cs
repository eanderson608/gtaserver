using System;
using System.IO;
using System.Collections.Generic;
using GrandTheftMultiplayer.Server;
using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Constant;
using GrandTheftMultiplayer.Server.Managers;
using GrandTheftMultiplayer.Shared;
using GrandTheftMultiplayer.Shared.Math;

namespace Character
{
    public class customchar : Script
    {
        public customchar()
        {
            API.onClientEventTrigger += OnClientEventTrigger;
            API.onPlayerFinishedDownload += OnPlayerFinishedDownload;
        }


        private void OnPlayerFinishedDownload(Client player)
        {
            string text = File.ReadAllText("character_customization.txt");
            API.triggerClientEvent(player, "customize_char", text);
        }


        public void OnClientEventTrigger(Client player, string eventName, params object[] args) {
            if (eventName == "save_char")
            {
                StreamWriter file;
                if (!File.Exists("char.txt")) {

                    file = new StreamWriter("char.txt");
                } else {

                    file = File.AppendText("char.txt");
                }

                file.WriteLine(args[0]);
                file.Close();
            }
        }
    }
}
