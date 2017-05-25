API.onUpdate.connect(function (sender, args) {


});

API.onResourceStart.connect(function (sender, args) {

    API.setWeather(0);

});

API.onServerEventTrigger.connect(function (eventName, args) {

    switch (eventName) {

        case "play_vehicle_unlock_sound":
            API.startMusic("car_door_lock.mp3", false);
            break;
    }

});

API.onKeyUp.connect(function (sender, e) {
    if (e.KeyCode === Keys.E) {
        API.triggerServerEvent("request_unlock_nearest_vehicle");
    }
})
