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
    public class interactionmenu : Script
    {

        private static MySqlConnectionStringBuilder _database;
        private static IVehicleRepository _vehicleRepository;
        private List<Veh> vehs;

        public interactionmenu()
        {
             API.onResourceStart += OnResourceStart;
             API.onClientEventTrigger += OnClientEventTrigger;
        }

        public void OnResourceStart()
        {
            MySqlInsightDbProvider.RegisterProvider();
            _database = new MySqlConnectionStringBuilder("server=localhost;user=root;database=gtanserver;port=3306;password=;");
            _vehicleRepository = _database.Connection().As<IVehicleRepository>();
        }

        private void OnClientEventTrigger(Client player, string eventName, params object[] args)
        {
            switch (eventName) {

                case "query_server_for_vehicle_owner":
                    int charId = API.getEntityData(player.handle, "CHAR_ID");

                    vehs = _vehicleRepository.GetVehicleByPlate(args[0].ToString());
                    API.triggerClientEvent(player, "does_player_have_access_to_vehicle", charId == vehs[0].OwnerId);
                    break;

                case "request_toggle_engine":

                    vehs = _vehicleRepository.GetVehicleByPlate(args[0].ToString());
                    if (API.getEntityData(player.handle, "CHAR_ID") == vehs[0].OwnerId) {

                        NetHandle h = new NetHandle(vehs[0].Handle);
                        Vehicle v = API.getEntityFromHandle<Vehicle>(h);
                        bool engine = API.getVehicleEngineStatus(v);
                        API.setVehicleEngineStatus(v, !engine);

                    }
                    break;


                case "request_toggle_trunk":

                    vehs = _vehicleRepository.GetVehicleByPlate(args[0].ToString());
                    if (API.getEntityData(player.handle, "CHAR_ID") == vehs[0].OwnerId) {

                        NetHandle h = new NetHandle(vehs[0].Handle);
                        Vehicle v = API.getEntityFromHandle<Vehicle>(h);
                        bool trunk = API.getVehicleDoorState(v, 5);
                        API.setVehicleDoorState(v, 5, !trunk);
                    }
                    break;

                case "request_toggle_door_locks":

                    vehs = _vehicleRepository.GetVehicleByPlate(args[0].ToString());
                    if (API.getEntityData(player.handle, "CHAR_ID") == vehs[0].OwnerId) {

                        NetHandle h = new NetHandle(vehs[0].Handle);
                        Vehicle v = API.getEntityFromHandle<Vehicle>(h);
                        bool locked = API.getVehicleLocked(v);
                        API.setVehicleLocked(v, !locked);

                        // alert player
                        string vehName =  API.getVehicleDisplayName((VehicleHash)API.getEntityModel(v));
                        if (!locked) {
                            API.sendNativeToAllPlayers(Hash.SET_VEHICLE_DOORS_LOCKED, v, 2);
                            API.sendNotificationToPlayer(player, "~r~" + vehName + " locked");
                        } else {
                            API.sendNativeToAllPlayers(Hash.SET_VEHICLE_DOORS_LOCKED, v, 0);
                            API.sendNotificationToPlayer(player, "~g~" + vehName + " unlocked");
                        }
                    }
                    break;

            }
        }

    }
}
