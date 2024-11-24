package com.org.arc.cap;

import com.org.arc.data.HandleEvent;
import com.org.arc.data.RoomStateEventHandler;
import com.org.arc.srv.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class ConnectEvent implements EventCapture{

    private final RoomService roomService;

    @Autowired
    public ConnectEvent(RoomService roomService){
        this.roomService = roomService;
    }

    @Override
    public void doAction(String targetClient, HandleEvent handleEvent, Consumer<RoomStateEventHandler> consumer) {

        if(targetClient.equals(handleEvent.getClientUuid())){
            System.out.println("[  ] Event : \t" + handleEvent.getEventType() +
                    "\tClient : " + targetClient +
                    " < == > " + handleEvent.getTargetUuid());
        }
    }
}
