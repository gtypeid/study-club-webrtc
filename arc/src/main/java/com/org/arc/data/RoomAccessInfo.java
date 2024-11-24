package com.org.arc.data;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomAccessInfo {
    public RoomAccessInfo(){}
    public RoomAccessInfo(Room room, CamClient rsProfile){
        this.room = room;
        this.rsProfile = rsProfile;
    }

    private Room room;
    private CamClient rsProfile;
}
