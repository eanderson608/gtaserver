var interactionMenu = null;
var interactionMenuPool = null;
var selectionReticleVisible = false;
var hitEnt = null;
var player = API.getLocalPlayer();

API.onUpdate.connect(function (sender, args) {

    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 14); // hide reticle
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 7);  // hide area name
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 9);  // hide street name
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 6); // hide vehicle name
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 8); // hide vehicle class

    if (interactionMenuPool != null) {
        interactionMenuPool.ProcessMenus();
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
        interactionMenu.Visible = !interactionMenu.Visible;  // toggle interaction menu
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

    interactionMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(interactionMenu, "Interaction Menu");

    interactionMenu.OnItemSelect.connect(function(sender, item, index) {


    });

    interactionMenuPool.Add(interactionMenu);
    interactionMenu.Visible = false;
}
