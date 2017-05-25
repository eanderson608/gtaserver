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
using System.Collections.Generic;

using BCr = BCrypt.Net;

namespace Server
{
    public class Login : Script
    {

        private static MySqlConnectionStringBuilder _database;
        private static IUserRepository _userRepository;
        private static ICharacterRepository _characterRepository;
        private static List<Character> charList;

        public Login()
        {
            API.onResourceStart += API_onResourceStart;
            API.onPlayerFinishedDownload += API_onPlayerFinishedDownload;
            API.onClientEventTrigger += API_onClientEventTrigger;
            API.onPlayerConnected += API_onPlayerConnected;
        }

        private void API_onResourceStart()
        {
            API.requestIpl("SP1_10_real_interior");
            MySqlInsightDbProvider.RegisterProvider();
            _database = new MySqlConnectionStringBuilder("server=localhost;user=root;database=gtanserver;port=3306;password=;");
            _userRepository = _database.Connection().As<IUserRepository>();
        }

        // when player connects make them collisionless and invisible,
        // move to location of login camera
        private void API_onPlayerConnected(Client player) {
            API.setEntityPositionFrozen(player, true);
            API.setEntityCollisionless(player, true);
            API.setEntityTransparency(player, 0);
            API.setEntityPosition(player, new Vector3(-2107, 4549, 83));

        }

        //cannot trigger client events for some reason in onPlayerConnected
        // so have to trigger login scree here
        private void API_onPlayerFinishedDownload(Client player)
        {
            API.triggerClientEvent(player, "show_login_screen");
        }

        private void API_onClientEventTrigger(Client player, string eventName, params object[] args)
        {
            if (eventName == "log_in") {

                string username = args[0].ToString();
                string password = args[1].ToString();

                UserAccount account = _userRepository.GetAccount(username);
                if (account == null)
                {
                    API.triggerClientEvent(player, "invalid_username_or_password");
                    return;
                }

                bool isPasswordCorrect = BCr.BCrypt.Verify(password, account.Hash);
                if (isPasswordCorrect)
                {

                    // get users characters
                    _characterRepository = _database.Connection().As<ICharacterRepository>();
                    charList = _characterRepository.GetAllCharactersWithOwnerId(account.Id);

                    // move player to char select location
                    API.setEntityPositionFrozen(player, false);
                    API.setEntityCollisionless(player, false);
                    API.setEntityTransparency(player, 255);
                    API.setEntityRotation(player, new Vector3(0, 0, -15));
                    API.setEntityPosition(player, new Vector3(-235.4913, -2002.9574, 24.6));
                    API.triggerClientEvent(player, "login_successful", API.toJson(charList));
                }
                else
                {
                    API.triggerClientEvent(player, "invalid_username_or_password");
                }
            }

            else if (eventName == "register") {

                string username = args[0].ToString();
                string password = args[1].ToString();

                // check to see if username already exists
                UserAccount account = _userRepository.GetAccount(username);
                if (account != null)
                {
                    API.triggerClientEvent(player, "register_username_taken");
                }
                else
                {
                    var hash = BCr.BCrypt.HashPassword(password, BCr.BCrypt.GenerateSalt(12));

                    account = new UserAccount
                    {
                        Username = username,
                        Hash = hash
                    };

                    _userRepository.RegisterAccount(account);
                    API.triggerClientEvent(player, "registration_successful");
                }
            }

            else if (eventName == "choose_existing_character")
            {
                dynamic c = charList[(int)args[0]];
                API.setEntityData(player.handle, "CHAR_ID", c.Id);
                API.setEntityPosition(player, new Vector3(-45.70197, -1680.367, 29.4101));
                API.sendChatMessageToPlayer(player, "Logged in as " + c.Name + " with ID: " + c.Id.ToString());
            }
        }
    }
}
