package com.org.arc.cap;

import com.org.arc.data.HandleEvent;
import com.org.arc.data.Room;
import com.org.arc.data.RoomStateEventHandler;
import com.org.arc.srv.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class OfferEvent implements EventCapture{

    private final RoomService roomService;

    @Autowired
    public OfferEvent(RoomService roomService){
        this.roomService = roomService;
    }

    @Override
    public void doAction(String targetClient, HandleEvent handleEvent, Consumer<RoomStateEventHandler> consumer) {

        if(targetClient.equals(handleEvent.getTargetUuid())){
            HandleEvent data = new HandleEvent(handleEvent);
            Room room = roomService.getRoomStore().get( handleEvent.getRoomUuid() );

            RoomStateEventHandler roomStateEventHandler = new RoomStateEventHandler(room, data);
            consumer.accept(roomStateEventHandler);
        }
    }
}
