var interactionMenu = null;
var interactionMenuPool = null;
var selectionReticleVisible = false;
var hitEnt = null;
var player = API.getLocalPlayer();
var vehicles = null;
var vehMarker = null;

API.onUpdate.connect(function (sender, args) {

    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 14); // hide reticle
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 7);  // hide area name
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 9);  // hide street name
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 6); // hide vehicle name
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 8); // hide vehicle class

    if (interactionMenuPool != null) {
        interactionMenuPool.ProcessMenus();
    }

    if (interactionMenu.Visible) {

        /*
        API.disableAllControlsThisFrame();
        API.enableControlThisFrame(21);
        API.enableControlThisFrame(30);
        API.enableControlThisFrame(31);
        API.enableControlThisFrame(237);
        API.enableControlThisFrame(238);
        API.enableControlThisFrame(239);
        API.enableControlThisFrame(240);
        */

        // only disable looking and shooting when interaction menu is open
        API.disableControlThisFrame(1);
        API.disableControlThisFrame(2);
        API.disableControlThisFrame(24);
        API.disableControlThisFrame(257);
        API.disableControlThisFrame(106);

        API.disableControlThisFrame(16); // weapon wheel
        API.disableControlThisFrame(17);
        API.disableControlThisFrame(81);
        API.disableControlThisFrame(82);

    }


    // selection reticle raycast
    /*
    if (selectionReticleVisible) {
        API.callNative("SHOW_HUD_COMPONENT_THIS_FRAME", 14);
        API.disableControlThisFrame(25);
        API.disableControlThisFrame(24);
        API.disableControlThisFrame(257);
        API.disableControlThisFrame(263);
        API.disableControlThisFrame(264);
        API.forceSendAimData(true);

        var aimingCoords = API.getPlayerAimCoords(player);
        var rayCast = API.createRaycast(API.getEntityPosition(player), aimingCoords, 10 | 4, null);
        if (rayCast.didHitEntity) {
            hitEnt = rayCast.hitEntity;
            API.setEntityTransparency(hitEnt, 200);
        }
        else if (!rayCast.didHitEntity && hitEnt != null) {
            API.setEntityTransparency(hitEnt, 255);
        }

    } else if (hitEnt != null) {
        API.setEntityTransparency(hitEnt, 255);
    }
    */

});

API.onKeyUp.connect(function (sender, e) {

    if (e.KeyCode === Keys.E && resource.login_local.charChosen) {

        if (!interactionMenu.Visible) {

            // disable chat
            API.setCanOpenChat(false);

            // get nearby VehicleHash
            vehicles = getVehiclesInRadius(50);

            // if there are vehicles nearby, add them to a menu
            if (vehicles.length > 0) {

                // add marker over first item in list
                vehMarker = API.createMarker(3, new Vector3(), new Vector3(), new Vector3(0, 0, 0), new Vector3(1, 1, 1), 255, 0, 0, 255);
                API.attachEntity(vehicles[0], vehMarker, "0", new Vector3(0, 0, 1.25), new Vector3());

                API.sendChatMessage(API.getEntityPosition(vehMarker).X.toString());

                var vehList = new List(String);
                for (var i = 0; i < vehicles.length; i++) {

                    var vehName = API.getVehicleDisplayName(API.getEntityModel(vehicles[i]));

                    vehList.Add(vehName);
                }

                var vehListItem = API.createListItem("Vehicle", "", vehList, 0);
                interactionMenu.AddItem(vehListItem);
            }


            interactionMenu.OnListChange.connect(function (sender, item, index) {

                if (item == vehListItem) {

                    // move marker when different vehicles are selected
                    API.attachEntity(vehMarker, vehicles[index], "0", new Vector3(0, 0, 1.25), new Vector3());
                }
            });

            interactionMenu.Visible = true;
        }
        else {
            API.deleteEntity(vehMarker);
            API.setCanOpenChat(true);
            interactionMenu.Visible = false;
            interactionMenu.Clear();
        }


    }
});

API.onServerEventTrigger.connect(function (eventName, args) {

    switch (eventName) {

    }
});

API.onResourceStart.connect(function (sender, args) {
    createInteractionMenu();

});

function createInteractionMenu() {

    interactionMenuPool = API.getMenuPool();

    interactionMenu = API.createMenu("", 50, 0, 6);
    API.setMenuTitle(interactionMenu, "Interaction Menu");

    interactionMenu.OnItemSelect.connect(function(sender, item, index) {


    });

    interactionMenu.ResetKey(menuControl.Back);
    interactionMenu.DisableInstructionalButtons(true);
    interactionMenu.ScaleWithSafezone = true;

    interactionMenuPool.Add(interactionMenu);
    interactionMenu.Visible = false;
}

function getVehiclesInRadius(radius) {

    var v = API.getStreamedVehicles();

    var vehList = [];
    var playerPos = API.getEntityPosition(player);

    for (var i = 0; i < v.Length; i++) {

        var vehPos = API.getEntityPosition(v[i]);
        if (playerPos.DistanceTo(vehPos) < radius) {

            vehList.push(v[i]);
        }
    }

    // sort by distance to player
    vehList.sort( function(a, b) {
        return playerPos.DistanceTo(API.getEntityPosition(a)) - playerPos.DistanceTo(API.getEntityPosition(b))
    });

    return vehList;
}

function getEntityPositionOffset(ent, offset) {
    var pos = API.getEntityPosition(ent);
    var result = new Vector3(pos.X + offset.X, pos.Y + offset.Y, pos.Z + offset.Z);
    return result;
}
