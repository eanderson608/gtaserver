using GrandTheftMultiplayer.Server;
using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Constant;
using GrandTheftMultiplayer.Server.Managers;
using GrandTheftMultiplayer.Shared;
using GrandTheftMultiplayer.Shared.Math;
using System.Collections.Generic;
using System;

namespace Server
{
    public interface IVehicleRepository
    {

    }

    public class Veh
    {
        public Veh(VehicleHash model)
        {
            Random r = new Random();

            int vin = r.Next(10000, 1000000);
            string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            // create a plate with 3 random numbers and 3 random letters
            int num = r.Next(0,26);
            string plate = r.Next(0,10).ToString() + r.Next(0,10).ToString() + r.Next(0,10).ToString() + " " + letters[r.Next(0,26)].ToString() + letters[r.Next(0,26)].ToString() + letters[r.Next(0,26)].ToString();

            this.Vin = vin;
            this.Plate = plate;
            this.Model = model;
        }

        public int Vin;
        private VehicleHash Model;
        public string Plate;
        public int OwnerId { get; set; }
    }
}
