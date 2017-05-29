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

                    List<Veh> vehs = _vehicleRepository.GetVehicleByPlate(args[0].ToString());
                    API.triggerClientEvent(player, "does_player_have_access_to_vehicle", charId == vehs[0].OwnerId);
                    break;

                case "request_toggle_trunk":
                    List<Veh> vehs = _vehicleRepository.GetVehicleByPlate(args[0].ToString());
                    bool trunk = API.getVehicleDoorState(v, 5);
                    API.setVehicleDoorState(v, 5, !trunk);
                    break;
            }
        }

    }
}
