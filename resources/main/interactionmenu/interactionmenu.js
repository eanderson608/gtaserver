var interactionMenu = null;
var menuPool = null;

API.onUpdate.connect(function (sender, args) {

    if (menuPool != null) {
        menuPool.ProcessMenus();
    }

    if (API.isControlJustPressed(172)) {
        interactionMenu.Visible = !interactionMenu.Visible;
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
