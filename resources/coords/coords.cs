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



namespace coords
{
   public class coords : Script
   {

      public coords()
      {

         API.onResourceStart += myResourceStart;
      }

      public void myResourceStart()
      {
          // nothing
      }

    [Command("coords")]
    public void displayCoords(Client player)
    {
        API.triggerClientEvent(player, "toggle_coord_display");
    }

    [Command("save_coords")]
    public void saveCoords(Client player, String coordName)
    {
        bool inVeh = API.isPlayerInAnyVehicle(player);

        // with help from https://forum.gtanet.work/index.php?threads/save-coords-to-txt-file.3498/
        StreamWriter file;
        if (!File.Exists("coordinates.txt")) {

            file = new StreamWriter("coordinates.txt");
        } else {

            file = File.AppendText("coordinates.txt");
        }

        // if the player is in a vechicle we want to get the coords of the vechicle
        // otherwise just get coords of the player
        if (inVeh) {

            int vehicle = API.getEntityModel(API.getPlayerVehicle(player));
            var pos = API.getEntityPosition(API.getPlayerVehicle(player));
            var rot = API.getEntityRotation(API.getPlayerVehicle(player));

            file.WriteLine(coordName + ":\tAPI.createVehicle((VehicleHash)(" + vehicle + "), " + "new Vector3(" + pos.X + ", " + pos.Y + ", " + pos.Z + "), new Vector3(" + rot.X + ", " + rot.Y + ", " + rot.Z + "), 0, 0);");

        } else {

            var pos = API.getEntityPosition(player);
            var rot = API.getEntityRotation(player);

            file.WriteLine(coordName + ":\tAPI.createSphereColShape(new Vector3(" + pos.X + ", " + pos.Y + ", " + pos.Z + "), 5f);");
            file.WriteLine("\t\tAPI.createMarker(1, new Vector3(" + pos.X + ", " + pos.Y + ", " + pos.Z + "), new Vector3(), new Vector3(), new Vector3(1, 1, 1), 255, 255, 0, 0, 0);");
            file.WriteLine("\t\tAPI.createBlip(new Vector3(" + pos.X + ", " + pos.Y + ", " + pos.Z + "));");

        }


        API.sendChatMessageToPlayer(player, "~r~Coordinates have been saved!");
        file.Close();

    }

  }

}
