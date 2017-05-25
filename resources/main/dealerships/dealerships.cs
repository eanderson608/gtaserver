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
    public class dealerships : Script
    {
        Veh v = null;
        Vehicle rebel = null;
        bool trunk = false;

        public dealerships()
        {
            API.onResourceStart += OnResourceStart;
            API.onPlayerConnected += OnPlayerConnected;
            API.onClientEventTrigger += OnClientEventTrigger;
        }

        public void OnResourceStart()
        {
            /*
            usedcar1:	API.createVehicle((VehicleHash)(-1883002148), new Vector3(-52.80386, -1678.298, 28.8963), new Vector3(0.2505116, 1.647955, 80.38305), 0, 0);
            usedcar2:	API.createVehicle((VehicleHash)(-1207771834), new Vector3(-55.16485, -1681.798, 29.06924), new Vector3(0.2327982, 0.3996114, 81.87687), 0, 0);
            usedcar4:	API.createVehicle((VehicleHash)(-685276541), new Vector3(-42.22864, -1690.444, 28.8665), new Vector3(-0.5214157, -0.643451, 166.3602), 0, 0);
            usedcar3:	API.createVehicle((VehicleHash)(-685276541), new Vector3(-59.5282, -1685.646, 28.9933), new Vector3(-0.04334274, 0.06487716, 86.07674), 0, 0);
            usedcar6:	API.createVehicle((VehicleHash)(-2124201592), new Vector3(-50.65365, -1693.3, 28.98547), new Vector3(0.1528653, -0.3687081, 176.5055), 0, 0);
            usedcar5:	API.createVehicle((VehicleHash)(-1150599089), new Vector3(-46.29678, -1691.577, 28.94879), new Vector3(0.7361314, -0.9302989, 175.7981), 0, 0);
            */

            Random r = new Random();
            rebel = API.createVehicle((VehicleHash)(-1883002148), new Vector3(-52.80386, -1678.298, 28.8963), new Vector3(0.2505116, 1.647955, 80.38305), r.Next(0, 64), r.Next(0, 64));
            v = new Veh(VehicleHash.Rebel);
            API.setVehicleEngineStatus(rebel, false);
            API.setVehicleNumberPlate(rebel, v.Plate);
            API.setVehicleLocked(rebel, true);

        }

        public void OnClientEventTrigger(Client player, string eventName, params object[] arguments)
        {
            switch (eventName)
            {
                case "request_unlock_nearest_vehicle":
                    unlockVehicle(player, getClosestVehicleFromPlayer(player, 5f));
                    break;
            }
        }

        private void OnPlayerConnected(Client player) {

        }

        [Command("test")]
        public void test(Client player)
        {
            API.sendChatMessageToPlayer(player, v.Vin.ToString());
            API.sendChatMessageToPlayer(player, rebel.handle.ToString());
            API.setVehicleDoorState(rebel, 5, !trunk);
            trunk = !trunk;
        }

        public NetHandle getClosestVehicleFromPlayer(Client player, float distance)
        {
            List<NetHandle> vehs = API.getAllVehicles();
            float d = 99999999f;
            NetHandle result = new NetHandle();
            foreach (NetHandle v in vehs)
            {
                float temp = Vector3.Distance(API.getEntityPosition(v), API.getEntityPosition(player));
                if (temp < 5 && temp < distance)
                {
                    result = v;
                    d = temp;
                }
            }
            return result;
        }

        public void unlockVehicle(Client player, NetHandle vehicle)
        {
            NetHandle c = getClosestVehicleFromPlayer(player, 5f);
            bool locked = API.getVehicleLocked(vehicle);
            if (c != null) {

                // unlock vehicle
                API.setVehicleLocked(c, !locked);

                // alert player
                if (locked) {
                    API.sendNotificationToPlayer(player, "~g~Vehicle unlocked");
                } else {
                    API.sendNotificationToPlayer(player, "~r~Vehicle locked");
                }


                List<Client> nearbyPlayers = API.getPlayersInRadiusOfPosition(15f, API.getEntityPosition(c));
                foreach (Client p in nearbyPlayers) {
                    API.triggerClientEvent(p, "play_vehicle_unlock_sound");
                }
            }

        }

    }
}
