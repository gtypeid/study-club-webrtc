package com.org.arc.data;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomStateEventHandler {
    public RoomStateEventHandler(){}
    public RoomStateEventHandler(Room room, HandleEvent handleEvent){
        this.room = room;
        this.handleEvent = handleEvent;
    }
    private Room room;
    private HandleEvent handleEvent;
}
