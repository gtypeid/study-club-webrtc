package com.org.arc.srv;

import com.org.arc.data.CamClient;
import com.org.arc.data.Room;
import com.org.arc.data.RoomAccessInfo;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {
    private Map<String, Room> roomStore = new ConcurrentHashMap<>();
    private char currentLetter = 'A';

    public Map<String, Room> getRoomStore(){
        return roomStore;
    }

    public String getClientUuid() {
        if (currentLetter > 'Z') {
            return null; // 더 이상 발행할 문자가 없을 경우 null 반환
        }
        return String.valueOf(currentLetter++);
    }

    public CamClient spawnClient(String type){
        CamClient camClient = new CamClient();
        camClient.setType(type);
        // camClient.setClientUuid(UUID.randomUUID().toString());
        camClient.setClientUuid(getClientUuid());
        return camClient;
    }

    public Room spawnRoom(CamClient hostClient){
        Room room = new Room();
        // room.setRoomUuid( UUID.randomUUID().toString() );
        room.setRoomUuid( String.valueOf( roomStore.size() + 1 ) );
        room.setHostClient(hostClient);
        return room;
    }

    public RoomAccessInfo createRoom(){
        CamClient camClient = spawnClient("host");
        Room room = spawnRoom(camClient);
        roomStore.put(room.getRoomUuid(), room);
        return new RoomAccessInfo(room, camClient);
    }

    public RoomAccessInfo joinRoom(String roomUuid){
        CamClient camClient = spawnClient("client");
        Room room = roomStore.get(roomUuid);
        room.addClient(camClient);
        return new RoomAccessInfo(room, camClient);
    }

    public Boolean isInvalidRoom(String roomUuid){
        return roomUuid == null || roomUuid.isEmpty() || !getRoomStore().containsKey(roomUuid);
    }
}
