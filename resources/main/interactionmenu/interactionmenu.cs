using System;
using System.IO;
using System.Collections.Generic;
using System.Collections;
using GrandTheftMultiplayer.Server;
using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Constant;
using GrandTheftMultiplayer.Server.Managers;
using GrandTheftMultiplayer.Shared;
using GrandTheftMultiplayer.Shared.Math;



namespace Server
{
    public class interactionmenu : Script
    {

        public interactionmenu()
        {
             API.onResourceStart += OnResourceStart;
        }

        public void OnResourceStart()
        {
          // nothing
        }
    }
}
