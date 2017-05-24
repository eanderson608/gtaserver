var menuPool = null;
var mainCharMenu = null;

var faceMenu = null;
var faceModelSelection = 0;
var faceFeatureScale = 0;

var shirtMenu = null;
var shirtModelSelection = 0;
var shirtTextureSelection = 0;

var undershirtMenu = null;
var undershirtModelSelection = 0;
var undershirtTextureSelection = 0;

var pantsMenu = null;
var pantsModelSelection = 0;
var pantsTextureSelection = 0;

var shoesMenu = null;
var shoesModelSelection = 0;
var shoesTextureSelection = 0;

var torsoMenu = null;
var torsoModelSelection = 0;
var torsoTextureSelection = 0;

var hairMenu = null;
var hairModelSelection = 0;
var hairTextureSelection1 = 0;
var hairTextureSelection2 = 0;
var facialHairModelSelection = 0;
var facialHairTextureSelection1 = 0;
var facialHairTextureSelection2 = 0;

var hatMenu = null;
var hatModelSelection = 0;
var hatTextureSelection = 0;

var glassesMenu = null;
var glassesModelSelection = 0;
var glassesTextureSelection = 0;

var earringsMenu = null;
var earringsModelSelection = 0;
var earringsTextureSelection = 0;

var accessoryMenu = null;
var accessoryModelSelection = 0;
var accessoryTextureSelection = 0;

var maskMenu = null;
var maskModelSelection = 0;
var maskTextureSelection = 0;

var characterName = "None";

API.setPlayerSkin(1885233650);
var face1 = 0;
var face2 = 21;
var faceShapeMix = 0;
var faceSkinMix = 0;
API.callNative("SET_PED_HEAD_BLEND_DATA", API.getLocalPlayer(), face1, face2, 0, face1, face2, 0, API.f(faceShapeMix), API.f(faceSkinMix), 0, false);

var genderMenu = null;
var playerGender = "M";

var char_data = null;

var data = {};
data.m = null;
data.t = [];

API.onServerEventTrigger.connect(function (eventName, args) {

    switch (eventName) {

        case 'customize_char':

            char_data = JSON.parse(args[0]);

            menuPool = API.getMenuPool();

            createGenderMenu();

            genderMenu.Visible = true;

            break;
    }
});

API.onResourceStart.connect(function (sender, args) {



});

API.onKeyUp.connect(function (sender, e) {
    if (e.KeyCode === Keys.E) {

        data.t.push(maskTextureSelection);
    }

    if (e.KeyCode === Keys.M) {
        data.m = maskModelSelection.toString();
        API.triggerServerEvent("save_char", '{"m" : ' + data.m + ', "t" : [' + data.t.toString() + ']},');
        data.t = [];
        data.m = null;
    }
})

API.onUpdate.connect(function (sender, args) {
    if (menuPool != null) {
        menuPool.ProcessMenus();
    }

    // change torso texture if left control just pressed
    if (API.isControlJustPressed(174) && torsoMenu.Visible) {
        if (torsoTextureSelection > 0) {
            torsoTextureSelection -= 1;
            API.setPlayerClothes(API.getLocalPlayer(), 3, torsoModelSelection, torsoTextureSelection);
        }
    }

    // change torso texture if right control just pressed
    if (API.isControlJustPressed(175) && torsoMenu.Visible) {
        if (torsoTextureSelection < 20) {
            torsoTextureSelection += 1;
            API.setPlayerClothes(API.getLocalPlayer(), 3, torsoModelSelection, torsoTextureSelection);
        }
    }
});

function createGenderMenu() {

    genderMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(genderMenu, "Gender");
    API.setMenuBannerRectangle(genderMenu, 200, 66, 131, 244);

    genderMenu.AddItem(API.createMenuItem("Male", ""));
    genderMenu.AddItem(API.createMenuItem("Female", ""));

    genderMenu.CurrentSelection = 0;

    genderMenu.OnIndexChange.connect(function (sender, index) {
        if (index == 0) {
            API.setPlayerSkin(1885233650);
            API.callNative("SET_PED_HEAD_BLEND_DATA", API.getLocalPlayer(), face1, face2, 0, face1, face2, 0, API.f(faceShapeMix), API.f(faceSkinMix), 0, false);
            playerGender = "M";
        } else {
            API.setPlayerSkin(-1667301416);
            API.callNative("SET_PED_HEAD_BLEND_DATA", API.getLocalPlayer(), face1, face2, 0, face1, face2, 0, API.f(faceShapeMix), API.f(faceSkinMix), 0, false);
            playerGender = "F";
        }
    });

    // when gender is selected move on to mainChar menu
    genderMenu.OnItemSelect.connect(function(sender, item, index) {

        menuPool = API.getMenuPool();

        createMainCharMenu();
        createFaceMenu();
        createHairMenu();
        createHatMenu();
        createMaskMenu();
        createGlassesMenu();
        createAccessoryMenu();
        createEarringsMenu();
        createTorsoMenu();
        createUndershirtMenu();
        createShirtMenu();
        createPantsMenu();
        createShoesMenu();

        mainCharMenu.Visible = true;
    });

    menuPool.Add(genderMenu);
    genderMenu.Visible = false;

}

function createMainCharMenu() {

    mainCharMenu = API.createMenu(characterName, 0, 0, 6);
    API.setMenuTitle(mainCharMenu, "Character");
    API.setMenuBannerRectangle(mainCharMenu, 200, 66, 131, 244);

    // Name
    var nameMenuItem = API.createMenuItem("Name", "");
    nameMenuItem.SetRightLabel(characterName);

    // change name
    nameMenuItem.Activated.connect(function(menu, item) {
        characterName = API.getUserInput(characterName, 32);
        item.SetRightLabel(characterName);
    });
    mainCharMenu.AddItem(nameMenuItem);

    //face
    var faceMenuItem = API.createMenuItem("Face", "");
    faceMenuItem.Activated.connect(function(menu, item) {
        showFaceMenu();
    });
    mainCharMenu.AddItem(faceMenuItem);

    //hair
    var hairMenuItem = API.createMenuItem("Hair", "");
    hairMenuItem.Activated.connect(function(menu, item) {
        showHairMenu();
    });
    mainCharMenu.AddItem(hairMenuItem);

    //hat
    var hatMenuItem = API.createMenuItem("Hat", "");
    hatMenuItem.Activated.connect(function(menu, item) {
        showHatMenu();
    });
    mainCharMenu.AddItem(hatMenuItem);

    //hat
    var maskMenuItem = API.createMenuItem("Mask", "");
    maskMenuItem.Activated.connect(function(menu, item) {
        showMaskMenu();
    });
    mainCharMenu.AddItem(maskMenuItem);

    //accessory
    var accessoryMenuItem = API.createMenuItem("Accessory", "");
    accessoryMenuItem.Activated.connect(function(menu, item) {
        showAccessoryMenu();
    });
    mainCharMenu.AddItem(accessoryMenuItem);

    //accessory
    var earringsMenuItem = API.createMenuItem("Earrings", "");
    earringsMenuItem.Activated.connect(function(menu, item) {
        showEarringsMenu();
    });
    mainCharMenu.AddItem(earringsMenuItem);

    //glasses
    var glassesMenuItem = API.createMenuItem("Glasses", "");
    glassesMenuItem.Activated.connect(function(menu, item) {
        showGlassesMenu();
    });
    mainCharMenu.AddItem(glassesMenuItem);

    //torso
    var torsoMenuItem = API.createMenuItem("Torso", "");
    torsoMenuItem.Activated.connect(function(menu, item) {
        showTorsoMenu();
    });
    mainCharMenu.AddItem(torsoMenuItem);

    //undershirt
    var undershirtMenuItem = API.createMenuItem("Undershirt", "");
    undershirtMenuItem.Activated.connect(function(menu, item) {
        showUndershirtMenu();
    });
    mainCharMenu.AddItem(undershirtMenuItem);

    //shirt
    var shirtMenuItem = API.createMenuItem("Shirt", "");
    shirtMenuItem.Activated.connect(function(menu, item) {
        showShirtMenu();
    });
    mainCharMenu.AddItem(shirtMenuItem);

    //pants
    var pantsMenuItem = API.createMenuItem("Pants", "");
    pantsMenuItem.Activated.connect(function(menu, item) {
        showPantsMenu();
    });
    mainCharMenu.AddItem(pantsMenuItem);

    //shoes
    var shoesMenuItem = API.createMenuItem("Shoes", "");
    shoesMenuItem.Activated.connect(function(menu, item) {
        showShoesMenu();
    });
    mainCharMenu.AddItem(shoesMenuItem);

    mainCharMenu.ParentMenu = genderMenu;

    menuPool.Add(mainCharMenu);
    mainCharMenu.Visible = false;
}

function showMainCharMenu() {
    genderMenu.Visible = false;
    mainCharMenu.Visible = true;
}

function createPantsMenu() {

    pantsMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(pantsMenu, "Pants");
    API.setMenuBannerRectangle(pantsMenu, 200, 66, 131, 244);

    var pantsData = null;
    if (playerGender == "M") {
        pantsData = char_data.male.pants;
    } else {
        pantsData = char_data.female.pants;
    }

    var pantsModelList = new List(String);
    for (var i = 0; i < pantsData.length; i++) {
        pantsModelList.Add(pantsData[i].m.toString());
    }

    var pantsTextureList = new List(String);
    for (var i = 0; i < pantsData[0].t.length; i++) {
        var a = pantsData[0].t;
        pantsTextureList.Add(a[i].toString());
    }

    var pantsModelMenuItem = API.createListItem("Type", "", pantsModelList, 0);
    var pantsTextureMenuItem = API.createListItem("Color", "", pantsTextureList , 0);

    pantsMenu.AddItem(pantsModelMenuItem);
    pantsMenu.AddItem(pantsTextureMenuItem);

    pantsMenu.OnListChange.connect(function (sender, item, index) {

        if (item == pantsModelMenuItem) {

            pantsModelSelection = parseInt(item.IndexToItem(index));

            pantsTextureList = new List(String);
            for (var i = 0; i < pantsData[index].t.length; i++) {
                var a = pantsData[index].t;
                pantsTextureList.Add(a[i].toString());
            }

            pantsTextureSelection = parseInt(pantsTextureList[0]);

            pantsMenu.RemoveItemAt(1);
            pantsTextureMenuItem = API.createListItem("Color", "", pantsTextureList , 0);
            pantsMenu.AddItem(pantsTextureMenuItem);


            API.setPlayerClothes(API.getLocalPlayer(), 4, pantsModelSelection, pantsTextureSelection);
        }

        if (item == pantsTextureMenuItem) {

            pantsTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerClothes(API.getLocalPlayer(), 4, pantsModelSelection, pantsTextureSelection);
        }
    });

    // when item is selected go back to main menu
    pantsMenu.OnItemSelect.connect(function(sender, item, index) {
        pantsMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    pantsMenu.ParentMenu = mainCharMenu;

    menuPool.Add(pantsMenu);
    pantsMenu.Visible = false;

}

function showPantsMenu() {
    mainCharMenu.Visible = false;
    pantsMenu.Visible = true;
}

function createShirtMenu() {

    shirtMenu = API.createMenu("SHIRT", 0, 0, 6);
    API.setMenuTitle(shirtMenu, "Character");
    API.setMenuBannerRectangle(shirtMenu, 200, 66, 131, 244);

    var shirtData = null;
    if (playerGender == "M") {
        shirtData = char_data.male.shirt;
    } else {
        shirtData = char_data.female.shirt;
    }

    var shirtModelList = new List(String);
    for (var i = 0; i < shirtData.length; i++) {
        shirtModelList.Add(shirtData[i].m.toString());
    }

    var shirtTextureList = new List(String);
    for (var i = 0; i < shirtData[0].t.length; i++) {
        var a = shirtData[0].t;
        shirtTextureList.Add(a[i].toString());
    }

    var shirtModelMenuItem = API.createListItem("Type", "", shirtModelList, 0);
    var shirtTextureMenuItem = API.createListItem("Color", "", shirtTextureList , 0);

    shirtMenu.AddItem(shirtModelMenuItem);
    shirtMenu.AddItem(shirtTextureMenuItem);

    shirtMenu.OnListChange.connect(function (sender, item, index) {

        if (item == shirtModelMenuItem) {

            shirtModelSelection = parseInt(item.IndexToItem(index));

            shirtTextureList = new List(String);
            for (var i = 0; i < shirtData[index].t.length; i++) {
                var a = shirtData[index].t;
                shirtTextureList.Add(a[i].toString());
            }

            shirtTextureSelection = parseInt(shirtTextureList[0]);

            shirtMenu.RemoveItemAt(1);
            shirtTextureMenuItem = API.createListItem("Color", "", shirtTextureList , 0);
            shirtMenu.AddItem(shirtTextureMenuItem);


            API.setPlayerClothes(API.getLocalPlayer(), 11, shirtModelSelection, shirtTextureSelection);
        }

        if (item == shirtTextureMenuItem) {

            shirtTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerClothes(API.getLocalPlayer(), 11, shirtModelSelection, shirtTextureSelection);
        }
    });

    // when item is selected go back to main menu
    shirtMenu.OnItemSelect.connect(function(sender, item, index) {
        shirtMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    shirtMenu.ParentMenu = mainCharMenu;

    menuPool.Add(shirtMenu);
    shirtMenu.Visible = false;

}

function showShirtMenu() {
    mainCharMenu.Visible = false;
    shirtMenu.Visible = true;
}

function createUndershirtMenu() {

    undershirtMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(undershirtMenu, "Undershirt");
    API.setMenuBannerRectangle(undershirtMenu, 200, 66, 131, 244);

    var undershirtData = null;
    if (playerGender == "M") {
        undershirtData = char_data.male.undershirt;
    } else {
        undershirtData = char_data.female.undershirt;
    }

    var undershirtModelList = new List(String);
    for (var i = 0; i < undershirtData.length; i++) {
        undershirtModelList.Add(undershirtData[i].m.toString());
    }

    var undershirtTextureList = new List(String);
    for (var i = 0; i < undershirtData[0].t.length; i++) {
        var a = undershirtData[0].t;
        undershirtTextureList.Add(a[i].toString());
    }

    var undershirtModelMenuItem = API.createListItem("Type", "", undershirtModelList, 0);
    var undershirtTextureMenuItem = API.createListItem("Color", "", undershirtTextureList , 0);

    undershirtMenu.AddItem(undershirtModelMenuItem);
    undershirtMenu.AddItem(undershirtTextureMenuItem);

    undershirtMenu.OnListChange.connect(function (sender, item, index) {

        if (item == undershirtModelMenuItem) {

            undershirtModelSelection = parseInt(item.IndexToItem(index));

            undershirtTextureList = new List(String);
            for (var i = 0; i < undershirtData[index].t.length; i++) {
                var a = undershirtData[index].t;
                undershirtTextureList.Add(a[i].toString());
            }

            undershirtTextureSelection = parseInt(undershirtTextureList[0]);

            undershirtMenu.RemoveItemAt(1);
            undershirtTextureMenuItem = API.createListItem("Color", "", undershirtTextureList , 0);
            undershirtMenu.AddItem(undershirtTextureMenuItem);


            API.setPlayerClothes(API.getLocalPlayer(), 8, undershirtModelSelection, undershirtTextureSelection);
        }

        if (item == undershirtTextureMenuItem) {

            undershirtTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerClothes(API.getLocalPlayer(), 8, undershirtModelSelection, undershirtTextureSelection);
        }
    });

    // when item is selected go back to main menu
    undershirtMenu.OnItemSelect.connect(function(sender, item, index) {
        undershirtMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    undershirtMenu.ParentMenu = mainCharMenu;

    menuPool.Add(undershirtMenu);
    undershirtMenu.Visible = false;

}

function showUndershirtMenu() {
    mainCharMenu.Visible = false;
    undershirtMenu.Visible = true;
}

function createShoesMenu() {

    shoesMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(shoesMenu, "Undershirt");
    API.setMenuBannerRectangle(shoesMenu, 200, 66, 131, 244);

    var shoesData = null;
    if (playerGender == "M") {
        shoesData = char_data.male.shoes;
    } else {
        shoesData = char_data.female.shoes;
    }

    var shoesModelList = new List(String);
    for (var i = 0; i < shoesData.length; i++) {
        shoesModelList.Add(shoesData[i].m.toString());
    }

    var shoesTextureList = new List(String);
    for (var i = 0; i < shoesData[0].t.length; i++) {
        var a = shoesData[0].t;
        shoesTextureList.Add(a[i].toString());
    }

    var shoesModelMenuItem = API.createListItem("Type", "", shoesModelList, 0);
    var shoesTextureMenuItem = API.createListItem("Color", "", shoesTextureList , 0);

    shoesMenu.AddItem(shoesModelMenuItem);
    shoesMenu.AddItem(shoesTextureMenuItem);

    shoesMenu.OnListChange.connect(function (sender, item, index) {

        if (item == shoesModelMenuItem) {

            shoesModelSelection = parseInt(item.IndexToItem(index));

            shoesTextureList = new List(String);
            for (var i = 0; i < shoesData[index].t.length; i++) {
                var a = shoesData[index].t;
                shoesTextureList.Add(a[i].toString());
            }

            shoesTextureSelection = parseInt(shoesTextureList[0]);

            shoesMenu.RemoveItemAt(1);
            shoesTextureMenuItem = API.createListItem("Color", "", shoesTextureList , 0);
            shoesMenu.AddItem(shoesTextureMenuItem);


            API.setPlayerClothes(API.getLocalPlayer(), 6, shoesModelSelection, shoesTextureSelection);
        }

        if (item == shoesTextureMenuItem) {

            shoesTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerClothes(API.getLocalPlayer(), 6, shoesModelSelection, shoesTextureSelection);
        }
    });

    // when item is selected go back to main menu
    shoesMenu.OnItemSelect.connect(function(sender, item, index) {
        shoesMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    shoesMenu.ParentMenu = mainCharMenu;

    menuPool.Add(shoesMenu);
    shoesMenu.Visible = false;

}

function showShoesMenu() {
    mainCharMenu.Visible = false;
    shoesMenu.Visible = true;
}

function createFaceMenu() {

    faceMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(faceMenu, "Face");
    API.setMenuBannerRectangle(faceMenu, 200, 66, 131, 244);

    // create parent face lists
    var face1List = new List(String);
    var face2List = new List(String);
    for (var i = 0; i < 46; i++) {
        face1List.Add(i.toString());
        face2List.Add(i.toString());
    }
    var face1ListItem = API.createListItem("Face 1", "", face1List, face1);
    var face2ListItem = API.createListItem("Face 2", "", face2List, face2);

    var faceShapeMixList = new List(String);
    faceShapeMixList.Add("0.0");
    faceShapeMixList.Add("0.1");
    faceShapeMixList.Add("0.2");
    faceShapeMixList.Add("0.3");
    faceShapeMixList.Add("0.4");
    faceShapeMixList.Add("0.5");
    faceShapeMixList.Add("0.6");
    faceShapeMixList.Add("0.7");
    faceShapeMixList.Add("0.8");
    faceShapeMixList.Add("0.9");
    faceShapeMixList.Add("1.0");

    var faceSkinMixList = new List(String);
    faceSkinMixList.Add("0.0");
    faceSkinMixList.Add("0.1");
    faceSkinMixList.Add("0.2");
    faceSkinMixList.Add("0.3");
    faceSkinMixList.Add("0.4");
    faceSkinMixList.Add("0.5");
    faceSkinMixList.Add("0.6");
    faceSkinMixList.Add("0.7");
    faceSkinMixList.Add("0.8");
    faceSkinMixList.Add("0.9");
    faceSkinMixList.Add("1.0");

    var faceShapeMixListItem = API.createListItem("Shape Blend", "Number from 0 to 1 indicating face shape. Numbers closer to 0 will be more similar to face 1 in shape while numbers closer to 1 to be more similar to face 2", faceShapeMixList, faceShapeMix);
    var faceSkinMixListItem = API.createListItem("Skin Blend", "Number from 0 to 1 indicating face skin. Numbers closer to 0 will be more similar to face 1 in color while numbers closer to 1 to be more similar to face 2", faceSkinMixList, faceSkinMix);

    faceMenu.AddItem(face1ListItem);
    faceMenu.AddItem(face2ListItem);
    faceMenu.AddItem(faceShapeMixListItem);
    faceMenu.AddItem(faceSkinMixListItem);

    faceMenu.CurrentSelection = 0;

    faceMenu.OnListChange.connect(function(sender, item, index){

        switch (item) {

            case face1ListItem:
                face1 = index;
                break;

            case face2ListItem:
                face2 = index;
                break;

            case faceShapeMixListItem:
                if (index != 0) {
                    faceShapeMix = index / 10;
                } else {
                    faceShapeMix = 0;
                }
                break;

            case faceSkinMixListItem:
                if (index != 0) {
                    faceSkinMix = index / 10;
                } else {
                    faceSkinMix = 0;
                }
                break;
        }
        API.callNative("SET_PED_HEAD_BLEND_DATA", API.getLocalPlayer(), face1, face2, 0, face1, face2, 0, API.f(faceShapeMix), API.f(faceSkinMix), 0, false);
    });

    faceMenu.ParentMenu = mainCharMenu;

    menuPool.Add(faceMenu);
    faceMenu.Visible = false;

}

function showFaceMenu() {
    mainCharMenu.Visible = false;
    faceMenu.Visible = true;
}

function createTorsoMenu() {

    torsoMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(torsoMenu, "Torso");
    API.setMenuBannerRectangle(torsoMenu, 200, 66, 131, 244);

    for (var i = 0; i < 100; i++) {
        torsoMenu.AddItem(API.createMenuItem(i.toString(), i.toString() + "/" + 16));
    }

    torsoMenu.CurrentSelection = 0;

    torsoMenu.OnIndexChange.connect(function (sender, index) {
        torsoModelSelection = index;
        torsoTextureSelection = 0;
        API.callNative("SET_PED_HEAD_OVERLAY", API.getLocalPlayer(), 13, torsoModelSelection, API.f(1));
    });

    // when item is selected go back to main menu
    torsoMenu.OnItemSelect.connect(function(sender, item, index) {
        torsoMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    torsoMenu.ParentMenu = mainCharMenu;

    menuPool.Add(torsoMenu);
    torsoMenu.Visible = false;

}

function showTorsoMenu() {
    mainCharMenu.Visible = false;
    torsoMenu.Visible = true;
}

function createHairMenu() {

    hairMenu = API.createMenu("HAIR", 0, 0, 6);
    API.setMenuTitle(hairMenu, "Character");
    API.setMenuBannerRectangle(hairMenu, 200, 66, 131, 244);

    var hairModelList = new List(String);
    if (playerGender == "M") {

        for (var i = 0; i < 37; i++) {
            if (i == 23) continue;
            hairModelList.Add(i.toString());
        }
    } else {

        for (var i = 0; i < 39; i++) {
            if (i == 24) continue;
            hairModelList.Add(i.toString());
        }
    }

    var facialHairModelList = new List(String);
    for (var i = 0; i < 29; i++) {
        facialHairModelList.Add(i.toString());
    }


    var hairTextureList1 = new List(String);
    var hairTextureList2 = new List(String);
    for (var i = 0; i < 64; i++) {
        hairTextureList1.Add(i.toString());
        hairTextureList2.Add(i.toString());
    }

    var facialHairTextureList1 = new List(String);
    var facialHairTextureList2 = new List(String);
    for (var i = 0; i < 64; i++) {
        facialHairTextureList1.Add(i.toString());
        facialHairTextureList2.Add(i.toString());
    }

    var hairModelMenuItem = API.createListItem("Style", "", hairModelList, 0);
    var hairTexture1MenuItem = API.createListItem("Color", "", hairTextureList1 , 0);
    var hairTexture2MenuItem = API.createListItem("Highlight", "", hairTextureList2 , 0);
    var facialHairModelMenuItem = API.createListItem("Style", "", facialHairModelList, 0);
    var facialHairTexture1MenuItem = API.createListItem("Color", "", facialHairTextureList1 , 0);
    var facialHairTexture2MenuItem = API.createListItem("Highlight", "", facialHairTextureList2 , 0);

    hairMenu.AddItem(hairModelMenuItem);
    hairMenu.AddItem(hairTexture1MenuItem);
    hairMenu.AddItem(hairTexture2MenuItem);

    hairMenu.AddItem(facialHairModelMenuItem);
    hairMenu.AddItem(facialHairTexture1MenuItem);
    hairMenu.AddItem(facialHairTexture2MenuItem);

    hairMenu.CurrentSelection = 0;

    hairMenu.OnListChange.connect(function (sender, item, index) {

        if (item == hairModelMenuItem) {

            hairModelSelection = parseInt(item.IndexToItem(index));
            API.setPlayerClothes(API.getLocalPlayer(), 2, hairModelSelection, 0);
            API.callNative("_SET_PED_HAIR_COLOR", API.getLocalPlayer(), hairTextureSelection1, hairTextureSelection2);
        }

        if (item == hairTexture1MenuItem) {
            hairTextureSelection1 = parseInt(item.IndexToItem(index));
            API.callNative("_SET_PED_HAIR_COLOR", API.getLocalPlayer(), hairTextureSelection1, hairTextureSelection2);
        }

        if (item == hairTexture2MenuItem) {
            hairTextureSelection2 = parseInt(item.IndexToItem(index));
            API.callNative("_SET_PED_HAIR_COLOR", API.getLocalPlayer(), hairTextureSelection1, hairTextureSelection2);
        }

        if (item == facialHairModelMenuItem) {

            facialHairModelSelection = parseInt(item.IndexToItem(index));
            API.callNative("SET_PED_HEAD_OVERLAY", API.getLocalPlayer(), 1, facialHairModelSelection, API.f(1));
        }

        if (item == facialHairTexture1MenuItem) {
            facialHairTextureSelection1 = parseInt(item.IndexToItem(index));
            API.callNative("_SET_PED_HEAD_OVERLAY_COLOR", API.getLocalPlayer(), 1, 2, facialHairTextureSelection1, facialHairTextureSelection2);
        }

        if (item == facialHairTexture2MenuItem) {
            facialHairTextureSelection2 = parseInt(item.IndexToItem(index));
            API.callNative("_SET_PED_HEAD_OVERLAY_COLOR", API.getLocalPlayer(), 1, 2, facialHairTextureSelection1, facialHairTextureSelection2);
        }
    });

    // when item is selected go back to main menu
    hairMenu.OnItemSelect.connect(function(sender, item, index) {
        hairMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    hairMenu.ParentMenu = mainCharMenu;

    menuPool.Add(hairMenu);
    hairMenu.Visible = false;

}

function showHairMenu() {
    mainCharMenu.Visible = false;
    hairMenu.Visible = true;
}

function createHatMenu() {

    hatMenu = API.createMenu("HAT", 0, 0, 6);
    API.setMenuTitle(hatMenu, "Character");
    API.setMenuBannerRectangle(hatMenu, 200, 66, 131, 244);

    var hatData = null;
    if (playerGender == "M") {
        hatData = char_data.male.hat;
    } else {
        hatData = char_data.female.hat;
    }

    var hatModelList = new List(String);
    for (var i = 0; i < hatData.length; i++) {
        hatModelList.Add(hatData[i].m.toString());
    }

    var hatTextureList = new List(String);
    for (var i = 0; i < hatData[0].t.length; i++) {
        var a = hatData[0].t;
        hatTextureList.Add(a[i].toString());
    }

    var hatModelMenuItem = API.createListItem("Type", "", hatModelList, 0);
    var hatTextureMenuItem = API.createListItem("Color", "", hatTextureList , 0);

    hatMenu.AddItem(hatModelMenuItem);
    hatMenu.AddItem(hatTextureMenuItem);

    hatMenu.OnListChange.connect(function (sender, item, index) {

        if (item == hatModelMenuItem) {

            hatModelSelection = parseInt(item.IndexToItem(index));

            hatTextureList = new List(String);
            for (var i = 0; i < hatData[index].t.length; i++) {
                var a = hatData[index].t;
                hatTextureList.Add(a[i].toString());
            }

            hatTextureSelection = parseInt(hatTextureList[0]);

            hatMenu.RemoveItemAt(1);
            hatTextureMenuItem = API.createListItem("Color", "", hatTextureList , 0);
            hatMenu.AddItem(hatTextureMenuItem);


            API.setPlayerAccessory(API.getLocalPlayer(), 0, hatModelSelection, hatTextureSelection);
        }

        if (item == hatTextureMenuItem) {

            hatTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerAccessory(API.getLocalPlayer(), 0, hatModelSelection, hatTextureSelection);
        }
    });

    // when item is selected go back to main menu
    hatMenu.OnItemSelect.connect(function(sender, item, index) {
        hatMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    hatMenu.ParentMenu = mainCharMenu;

    menuPool.Add(hatMenu);
    hatMenu.Visible = false;

}

function showHatMenu() {
    mainCharMenu.Visible = false;
    hatMenu.Visible = true;
}

function createGlassesMenu() {

    glassesMenu = API.createMenu("GLASSES", 0, 0, 6);
    API.setMenuTitle(glassesMenu, "Character");
    API.setMenuBannerRectangle(glassesMenu, 200, 66, 131, 244);

    var glassesData = null;
    if (playerGender == "M") {
        glassesData = char_data.male.glasses;
    } else {
        glassesData = char_data.female.glasses;
    }

    var glassesModelList = new List(String);
    for (var i = 0; i < glassesData.length; i++) {
        glassesModelList.Add(glassesData[i].m.toString());
    }

    var glassesTextureList = new List(String);
    for (var i = 0; i < glassesData[0].t.length; i++) {
        var a = glassesData[0].t;
        glassesTextureList.Add(a[i].toString());
    }

    var glassesModelMenuItem = API.createListItem("Type", "", glassesModelList, 0);
    var glassesTextureMenuItem = API.createListItem("Color", "", glassesTextureList , 0);

    glassesMenu.AddItem(glassesModelMenuItem);
    glassesMenu.AddItem(glassesTextureMenuItem);

    glassesMenu.OnListChange.connect(function (sender, item, index) {

        if (item == glassesModelMenuItem) {

            glassesModelSelection = parseInt(item.IndexToItem(index));

            glassesTextureList = new List(String);
            for (var i = 0; i < glassesData[index].t.length; i++) {
                var a = glassesData[index].t;
                glassesTextureList.Add(a[i].toString());
            }

            glassesTextureSelection = parseInt(glassesTextureList[0]);

            glassesMenu.RemoveItemAt(1);
            glassesTextureMenuItem = API.createListItem("Color", "", glassesTextureList , 0);
            glassesMenu.AddItem(glassesTextureMenuItem);


            API.setPlayerAccessory(API.getLocalPlayer(), 1, glassesModelSelection, glassesTextureSelection);
        }

        if (item == glassesTextureMenuItem) {

            glassesTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerAccessory(API.getLocalPlayer(), 1, glassesModelSelection, glassesTextureSelection);
        }
    });

    // when item is selected go back to main menu
    glassesMenu.OnItemSelect.connect(function(sender, item, index) {
        glassesMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    glassesMenu.ParentMenu = mainCharMenu;

    menuPool.Add(glassesMenu);
    glassesMenu.Visible = false;

}

function showGlassesMenu() {
    mainCharMenu.Visible = false;
    glassesMenu.Visible = true;
}

function createAccessoryMenu() {

    accessoryMenu = API.createMenu("ACCESSORY", 0, 0, 6);
    API.setMenuTitle(accessoryMenu, "Character");
    API.setMenuBannerRectangle(accessoryMenu, 200, 66, 131, 244);

    var accessoryData = null;
    if (playerGender == "M") {
        accessoryData = char_data.male.accessory;
    } else {
        accessoryData = char_data.female.accessory;
    }

    var accessoryModelList = new List(String);
    for (var i = 0; i < accessoryData.length; i++) {
        accessoryModelList.Add(accessoryData[i].m.toString());
    }

    var accessoryTextureList = new List(String);
    for (var i = 0; i < accessoryData[0].t.length; i++) {
        var a = accessoryData[0].t;
        accessoryTextureList.Add(a[i].toString());
    }

    var accessoryModelMenuItem = API.createListItem("Type", "", accessoryModelList, 0);
    var accessoryTextureMenuItem = API.createListItem("Color", "", accessoryTextureList , 0);

    accessoryMenu.AddItem(accessoryModelMenuItem);
    accessoryMenu.AddItem(accessoryTextureMenuItem);

    accessoryMenu.OnListChange.connect(function (sender, item, index) {

        if (item == accessoryModelMenuItem) {

            accessoryModelSelection = parseInt(item.IndexToItem(index));

            accessoryTextureList = new List(String);
            for (var i = 0; i < accessoryData[index].t.length; i++) {
                var a = accessoryData[index].t;
                accessoryTextureList.Add(a[i].toString());
            }

            accessoryTextureSelection = parseInt(accessoryTextureList[0]);

            accessoryMenu.RemoveItemAt(1);
            accessoryTextureMenuItem = API.createListItem("Color", "", accessoryTextureList , 0);
            accessoryMenu.AddItem(accessoryTextureMenuItem);


            API.setPlayerClothes(API.getLocalPlayer(), 7, accessoryModelSelection, accessoryTextureSelection);
        }

        if (item == accessoryTextureMenuItem) {

            accessoryTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerClothes(API.getLocalPlayer(), 7, accessoryModelSelection, accessoryTextureSelection);
        }
    });

    // when item is selected go back to main menu
    accessoryMenu.OnItemSelect.connect(function(sender, item, index) {
        accessoryMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    accessoryMenu.ParentMenu = mainCharMenu;

    menuPool.Add(accessoryMenu);
    accessoryMenu.Visible = false;

}

function showAccessoryMenu() {
    mainCharMenu.Visible = false;
    accessoryMenu.Visible = true;
}

function createMaskMenu() {

    maskMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(maskMenu, "Mask");
    API.setMenuBannerRectangle(maskMenu, 200, 66, 131, 244);

    var maskData = char_data.masks;

    var maskModelList = new List(String);
    for (var i = 0; i < maskData.length; i++) {
        maskModelList.Add(maskData[i].m.toString());
    }

    var maskTextureList = new List(String);
    for (var i = 0; i < maskData[0].t.length; i++) {
        var a = maskData[0].t;
        maskTextureList.Add(a[i].toString());
    }

    var maskModelMenuItem = API.createListItem("Type", "", maskModelList, 0);
    var maskTextureMenuItem = API.createListItem("Color", "", maskTextureList , 0);

    maskMenu.AddItem(maskModelMenuItem);
    maskMenu.AddItem(maskTextureMenuItem);

    maskMenu.OnListChange.connect(function (sender, item, index) {

        if (item == maskModelMenuItem) {

            maskModelSelection = parseInt(item.IndexToItem(index));

            maskTextureList = new List(String);
            for (var i = 0; i < maskData[index].t.length; i++) {
                var a = maskData[index].t;
                maskTextureList.Add(a[i].toString());
            }

            maskTextureSelection = parseInt(maskTextureList[0]);

            maskMenu.RemoveItemAt(1);
            maskTextureMenuItem = API.createListItem("Color", "", maskTextureList , 0);
            maskMenu.AddItem(maskTextureMenuItem);


            API.setPlayerClothes(API.getLocalPlayer(), 1, maskModelSelection, maskTextureSelection);
        }

        if (item == maskTextureMenuItem) {

            maskTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerClothes(API.getLocalPlayer(), 1, maskModelSelection, maskTextureSelection);
        }
    });

    // when item is selected go back to main menu
    maskMenu.OnItemSelect.connect(function(sender, item, index) {
        maskMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    maskMenu.ParentMenu = mainCharMenu;

    menuPool.Add(maskMenu);
    maskMenu.Visible = false;

}

function showMaskMenu() {
    mainCharMenu.Visible = false;
    maskMenu.Visible = true;
}

function createEarringsMenu() {

    earringsMenu = API.createMenu("", 0, 0, 6);
    API.setMenuTitle(earringsMenu, "Earrings");
    API.setMenuBannerRectangle(earringsMenu, 200, 66, 131, 244);

    var earringsData = null;
    if (playerGender == "M") {
        earringsData = char_data.male.earrings;
    } else {
        earringsData = char_data.female.earrings;
    }

    var earringsModelList = new List(String);
    for (var i = 0; i < earringsData.length; i++) {
        earringsModelList.Add(earringsData[i].m.toString());
    }

    var earringsTextureList = new List(String);
    for (var i = 0; i < earringsData[0].t.length; i++) {
        var a = earringsData[0].t;
        earringsTextureList.Add(a[i].toString());
    }

    var earringsModelMenuItem = API.createListItem("Type", "", earringsModelList, 0);
    var earringsTextureMenuItem = API.createListItem("Color", "", earringsTextureList , 0);

    earringsMenu.AddItem(earringsModelMenuItem);
    earringsMenu.AddItem(earringsTextureMenuItem);

    earringsMenu.OnListChange.connect(function (sender, item, index) {

        if (item == earringsModelMenuItem) {

            earringsModelSelection = parseInt(item.IndexToItem(index));

            earringsTextureList = new List(String);
            for (var i = 0; i < earringsData[index].t.length; i++) {
                var a = earringsData[index].t;
                earringsTextureList.Add(a[i].toString());
            }

            earringsTextureSelection = parseInt(earringsTextureList[0]);

            earringsMenu.RemoveItemAt(1);
            earringsTextureMenuItem = API.createListItem("Color", "", earringsTextureList , 0);
            earringsMenu.AddItem(earringsTextureMenuItem);


            API.setPlayerAccessory(API.getLocalPlayer(), 2, earringsModelSelection, earringsTextureSelection);
        }

        if (item == earringsTextureMenuItem) {

            earringsTextureSelection = parseInt(item.IndexToItem(index));
            API.setPlayerAccessory(API.getLocalPlayer(), 2, earringsModelSelection, earringsTextureSelection);
        }
    });

    // when item is selected go back to main menu
    earringsMenu.OnItemSelect.connect(function(sender, item, index) {
        earringsMenu.Visible = false;
        mainCharMenu.Visible = true;
    });

    // also go back to the main menu when closed
    earringsMenu.ParentMenu = mainCharMenu;

    menuPool.Add(earringsMenu);
    earringsMenu.Visible = false;

}

function showEarringsMenu() {
    mainCharMenu.Visible = false;
    earringsMenu.Visible = true;
}
