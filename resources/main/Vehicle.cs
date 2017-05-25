using GrandTheftMultiplayer.Server;
using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Constant;
using GrandTheftMultiplayer.Server.Managers;
using GrandTheftMultiplayer.Shared;
using GrandTheftMultiplayer.Shared.Math;
using System.Collections.Generic;
using System;
using Insight.Database;
using Insight.Database.Providers.MySql;
using MySql.Data.MySqlClient;

namespace Server
{
    public interface IVehicleRepository
    {
        List<Vehicle> GetVehicleByPlate(string _plate);
        List<Vehicle> GetVehicleByVin(int _vin);
        Veh AddNewVehicle(Veh veh);
    }

    public class Veh
    {
        private static MySqlConnectionStringBuilder _database;
        private static IVehicleRepository _vehicleRepository;

        public Veh(string name, int ownerId)
        {
            Random r = new Random();

            _database = new MySqlConnectionStringBuilder("server=localhost;user=root;database=gtanserver;port=3306;password=;");
            _vehicleRepository = _database.Connection().As<IVehicleRepository>();

            int vin = r.Next(100000, 1000000);
            List<Vehicle> temp = _vehicleRepository.GetVehicleByVin(vin);
            while (temp.Count > 0) {
                vin = r.Next(100000, 1000000);
                temp = _vehicleRepository.GetVehicleByVin(vin);
            }

            // create a plate with 3 random numbers and 3 random letters and make sure it isnt already taken
            string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string plate = r.Next(0,10).ToString() + r.Next(0,10).ToString() + r.Next(0,10).ToString() + " " + letters[r.Next(0,26)].ToString() + letters[r.Next(0,26)].ToString() + letters[r.Next(0,26)].ToString();
            temp = _vehicleRepository.GetVehicleByPlate(plate);
            while (temp.Count > 0) {
                plate = r.Next(0,10).ToString() + r.Next(0,10).ToString() + r.Next(0,10).ToString() + " " + letters[r.Next(0,26)].ToString() + letters[r.Next(0,26)].ToString() + letters[r.Next(0,26)].ToString();
                temp = _vehicleRepository.GetVehicleByPlate(plate);
            }

            this.Plate = plate;
            this.Vin = vin;
            this.Inventory = "{}";
            this.Name = name;
            this.OwnerId = ownerId;
        }

        public int Vin;
        public string Plate;
        public string Name;
        public int OwnerId { get; set; }
        public string Inventory { get; set; }
    }
}
