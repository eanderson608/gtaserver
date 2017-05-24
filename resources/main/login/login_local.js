var loginBrowser = null;
var player = API.getLocalPlayer();

var menuPool = null;
var charSelectMenu = null;

API.onUpdate.connect(function (sender, args) {

    if (menuPool != null) {
        menuPool.ProcessMenus();
    }

    API.disableAllControlsThisFrame();
});

API.onServerEventTrigger.connect(function (eventName, args) {

    switch (eventName) {

        case "show_login_screen":

            // turn off chat
            API.setCanOpenChat(false);
            //API.setChatVisible(false);

            // create login camera and switch to it
            var loginCam = API.createCamera(new Vector3(-2107, 4549, 83), new Vector3(-8, 0, -80));
            API.setActiveCamera(loginCam);

            var res = API.getScreenResolution();
            loginBrowser = API.createCefBrowser(500, 500);
            API.waitUntilCefBrowserInit(loginBrowser);
            API.setCefBrowserPosition(loginBrowser, (res.Width / 2) - 250, (res.Height / 2) - 250);
            API.loadPageCefBrowser(loginBrowser, "login.html");
            API.showCursor(true);
            break;

        // handle events for a successful login (destroy browser and load
        // character selection/creation)
        case "login_successful":
            API.sendNotification("Login Successful");

            // destroy browser
            API.showCursor(false);
            API.destroyCefBrowser(loginBrowser);
            API.setCanOpenChat(false);
            loginBrowser = null;

            // create charSelect camera and switch to it
            var playerPos = API.getEntityPosition(player);
            var charSelectCam = API.createCamera(new Vector3(), new Vector3());
            var charSelectCam = API.createCamera(API.getOffsetInWorldCoords(player, new Vector3(0, 2.5, .5)), new Vector3());
            API.pointCameraAtPosition(charSelectCam, playerPos);
            API.setActiveCamera(charSelectCam);

            // create charSelect menu
            var charList = JSON.parse(args[0]);
            menuPool = API.getMenuPool();
            createCharSelectMenu(charList);

            break;

        case "invalid_username_or_password":

            loginBrowser.call("invalidUsernameOrPassword");
            break;

        case "register_username_taken":
            loginBrowser.call("usernameTaken");
            break;

        case "registration_successful":
            API.sendNotification("Registration successful!");
            loginBrowser.call("switchToLogin");
            break;

    }
});

function login(username, password) {
    API.triggerServerEvent("log_in", username, password);
}

function register(username, password) {
    API.triggerServerEvent("register", username, password);
}

function createCharSelectMenu(charList) {

    charSelectMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(charSelectMenu, "Select Character");

    // create menu items for current characters
    for (i = 0; i < charList.length; i++) {
        charSelectMenu.AddItem(API.createMenuItem(charList[i].Name, "Select this character."));
    }

    // fill rest of slots with menu items taht let a user create a new character
    for (i = charList.length; i < 2; i++) {
        charSelectMenu.AddItem(API.createMenuItem("EMPTY SLOT", "Create a new character."));
    }

    charSelectMenu.OnItemSelect.connect(function(sender, item, index) {

        if (item.Text == "EMPTY SLOT") {
            API.sendChatMessage("create new character");
        } else {
            API.sendChatMessage("choose existing character");
            API.triggerServerEvent("choose_existing_character", index);
        }
    });

    menuPool.Add(charSelectMenu);
    charSelectMenu.ParentMenu = charSelectMenu;
    charSelectMenu.Visible = true;
}
