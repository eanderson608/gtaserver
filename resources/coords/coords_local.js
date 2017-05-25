var showCoords = true;
var pos = null;
var rot = null;
var res_x = API.getScreenResolution().Width;
var res_y = API.getScreenResolution().Height;
var player = API.getLocalPlayer();
var inVeh = null;
var camRot = null;

API.onUpdate.connect(function (sender, args) {

    if (showCoords) {
        inVeh = API.isPlayerInAnyVehicle(player);

        camRot = API.getGameplayCamRot();
        camPos = API.getGameplayCamPos();


        // if the player is in a vehicle we want to get the coords of the vechicle
        // otherwise just get coords of the player
        if (inVeh) {
          pos = API.getEntityPosition(API.getPlayerVehicle(player));
          rot = API.getEntityRotation(API.getPlayerVehicle(player));
        } else {
          pos = API.getEntityPosition(player);
          rot = API.getEntityRotation(player);
        }

        // round numbers to four decimal places
        pos_x = Math.round(pos.X * 10000)/10000;
        pos_y = Math.round(pos.Y * 10000)/10000;
        pos_z = Math.round(pos.Z * 10000)/10000;
        rot_x = Math.round(rot.X * 10000)/10000;
        rot_y = Math.round(rot.Y * 10000)/10000;
        rot_z = Math.round(rot.Z * 10000)/10000;

        camPos_x = Math.round(camPos.X * 10000)/10000;
        camPos_y = Math.round(camPos.Y * 10000)/10000;
        camPos_z = Math.round(camPos.Z * 10000)/10000;

        camRot_x = Math.round(camRot.X * 10000)/10000;
        camRot_y = Math.round(camRot.Y * 10000)/10000;
        camRot_z = Math.round(camRot.Z * 10000)/10000;

        // display on screen
        API.drawText(`Postition:\n X:${pos_x} \n Y:${pos_y} \n Z:${pos_z} \n
                      Rotation:\n X:${rot_x} \n Y:${rot_y} \n Z:${rot_z} \n
                      Camera Postion:\n X:${camPos_x} \n Y:${camPos_y} \n Z:${camPos_z} \n
                      Camera Rotation:\n X:${camRot_x} \n Y:${camRot_y} \n Z:${camRot_z}`,
                      res_x - 5, (res_y - res_y / 2), .3, 255, 255, 255, 255, 0 ,2, false, true, 0);

    }
});

API.onServerEventTrigger.connect(function (eventName, args) {

  switch (eventName) {

    case 'toggle_coord_display':

       if (showCoords) {
           showCoords = false;
           API.sendChatMessage("coords disabled");
       } else {
           showCoords = true;
           API.sendChatMessage("coords enabled");
       }

    break;
  }
});
