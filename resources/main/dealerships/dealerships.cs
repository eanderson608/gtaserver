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
using Insight.Database;
using Insight.Database.Providers.MySql;
using MySql.Data.MySqlClient;

namespace Server
{
    public class dealerships : Script
    {
        private static MySqlConnectionStringBuilder _database;
        private static IVehicleRepository _vehicleRepository;

        Vehicle a;


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

        }

        public void OnClientEventTrigger(Client player, string eventName, params object[] arguments)
        {
            switch (eventName)
            {
                case "request_unlock_nearest_vehicle":
                    unlockVehicle(player, getClosestVehicleToPlayer(player, 5f));
                    break;
            }
        }

        private void OnPlayerConnected(Client player) {
            a = createVehicleHelper(VehicleHash.Virgo, new Vector3(-52.80386, -1678.298, 28.8963), new Vector3(0.2505116, 1.647955, 80.38305));

        }

        [Command("veh")]
        public void veh(Client player, VehicleHash model)
        {
            Vector3 pos = API.getEntityPosition(player);
            Vector3 rot = API.getEntityRotation(player);
            Vehicle v = createVehicleHelper(model, pos, rot, API.getEntityData(player, "CHAR_ID"));
            API.setVehicleEngineStatus(v, true);
        }

        [Command("trunk")]
        public void trunk(Client player)
        {
            NetHandle v = getClosestVehicleToPlayer(player, 5f);
            bool trunk = API.getVehicleDoorState(v, 5);
            API.setVehicleDoorState(v, 5, !trunk);
        }

        [Command("purchase")]
        public void purchase(Client player)
        {
            NetHandle v = getClosestVehicleToPlayer(player, 5f);
            if (API.hasEntityData(v, "JSON_DATA") == false) return;

            string json = API.getEntityData(v, "JSON_DATA");
            dynamic vehData = API.fromJson(json);
            if ((int)(vehData.OwnerId) == 0) {
                vehData.OwnerId = API.getEntityData(player, "CHAR_ID");
                API.setEntityData(v, "JSON_DATA", API.toJson(vehData));
                API.sendNotificationToPlayer(player, "Congratulations, you have just purchased this " + vehData.Name);
            } else if ((int)(vehData.OwnerId) == API.getEntityData(player, "CHAR_ID")) {
                API.sendNotificationToPlayer(player, "You already own this " + vehData.Name);
            }
        }



        public NetHandle getClosestVehicleToPlayer(Client player, float distance)
        {
            List<NetHandle> vehs = API.getAllVehicles();
            float d = 99999999f;
            NetHandle result = new NetHandle();
            foreach (NetHandle v in vehs)
            {
                float temp = Vector3.Distance(API.getEntityPosition(v), API.getEntityPosition(player));
                if (temp < distance)
                {
                    result = v;
                    d = temp;
                }
            }
            return result;
        }

        public void unlockVehicle(Client player, NetHandle vehicle)
        {
            if (API.hasEntityData(vehicle, "JSON_DATA") == false) return;

            API.sendChatMessageToPlayer(player, player.handle.ToString());

            bool locked = API.getVehicleLocked(vehicle);
            dynamic vehData = API.fromJson(API.getEntityData(vehicle, "JSON_DATA"));
            bool playerCanUnlock = API.getEntityData(player.handle, "CHAR_ID") == (int)(vehData.OwnerId);
            string vehName =  API.getVehicleDisplayName((VehicleHash)API.getEntityModel(vehicle));
            if (vehicle.ToString() != "0" && playerCanUnlock) {

                // unlock vehicle
                API.setVehicleLocked(vehicle, !locked);
                //API.playPlayerAnimation(player, 0, "cellphone@", "f_cellphone_text_in");

                // alert player
                if (!locked) {
                    API.sendNotificationToPlayer(player, "~r~" + vehName + " locked");
                } else {
                    API.sendNotificationToPlayer(player, "~g~" + vehName + " unlocked");
                }

                // TODO: make it so playing a mp3 multiple times does not crash the game
                // play unlock sound for nearby players
                /*
                List<Client> nearbyPlayers = API.getPlayersInRadiusOfPosition(15f, API.getEntityPosition(vehicle));
                foreach (Client p in nearbyPlayers) {
                    API.triggerClientEvent(p, "play_vehicle_unlock_sound");
                }
                */
            } else if (vehicle.ToString() != "0" && !playerCanUnlock) {
                API.sendNotificationToPlayer(player, "~r~You do not have the keys for this " + vehName);
            }
        }

        public Vehicle createVehicleHelper(VehicleHash model, Vector3 pos, Vector3 rot, int ownerId = 0)
        {
            Random r = new Random();
            int color = r.Next(0, 160);
            Vehicle vehicle = API.createVehicle(model, pos, rot, color, color);
            Veh veh = new Veh(API.getVehicleDisplayName(model), ownerId);

            // trigger client event to stream number plate info
            API.setVehicleNumberPlate(vehicle, veh.Plate);
            API.setVehicleEngineStatus(vehicle, false);
            API.setVehicleLocked(vehicle, true);
            API.setEntityData(vehicle, "JSON_DATA", API.toJson(veh));
            API.setEntitySyncedData(vehicle, "PLATE", veh.Plate);

            _database = new MySqlConnectionStringBuilder("server=localhost;user=root;database=gtanserver;port=3306;password=;");
            _vehicleRepository = _database.Connection().As<IVehicleRepository>();
            _vehicleRepository.AddNewVehicle(veh);



            return vehicle;
        }

    }
}
