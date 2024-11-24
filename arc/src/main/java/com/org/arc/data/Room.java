package com.org.arc.data;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;


@Getter
@Setter
@ToString
public class Room {
    public Room(){}

    private String roomUuid;
    private CamClient hostClient;
    private Map<Integer, CamClient> camClients = new HashMap<>();
    private int lastModified;
    private int maxUser = 4;

    public boolean addClient(CamClient client){
        int index = ++lastModified;
        client.setIndex(index);
        camClients.put(index, client);

        return true;
    }

    public boolean removeClient(CamClient client){
        camClients.remove(client.getIndex());
        ++this.lastModified;

        return true;
    }
}
