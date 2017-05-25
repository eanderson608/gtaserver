var interactionMenu = null;
var menuPool = null;
var selectionReticleVisible = false;
var hitEnt = null;
var player = API.getLocalPlayer();

API.onUpdate.connect(function (sender, args) {

    // do not show reticle
    API.callNative("HIDE_HUD_COMPONENT_THIS_FRAME", 14);

    if (menuPool != null) {
        menuPool.ProcessMenus();
    }

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

});

API.onKeyDown.connect(function (sender, e) {
    if (e.KeyCode === Keys.E) {
        selectionReticleVisible = true;
    }
});

API.onKeyUp.connect(function (sender, e) {
    if (e.KeyCode === Keys.E) {
        selectionReticleVisible = false;
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

    menuPool = API.getMenuPool();

    interactionMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(interactionMenu, "Interaction Menu");

    interactionMenu.OnItemSelect.connect(function(sender, item, index) {


    });

    menuPool.Add(interactionMenu);
    interactionMenu.Visible = false;
}
