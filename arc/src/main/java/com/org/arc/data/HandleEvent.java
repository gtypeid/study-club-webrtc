package com.org.arc.data;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class HandleEvent {
    public HandleEvent(){}
    public HandleEvent(HandleEvent original) {
        this.eventType = original.eventType;
        this.roomUuid = original.roomUuid;
        this.clientUuid = original.clientUuid;
        this.targetUuid = original.targetUuid;
        this.data = original.data;
    }

    private String eventType;
    private String roomUuid;
    private String clientUuid;
    private String targetUuid;
    private String data;
}
