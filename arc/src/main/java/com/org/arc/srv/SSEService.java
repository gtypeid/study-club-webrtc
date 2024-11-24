package com.org.arc.srv;

import com.org.arc.cap.EventCapture;
import com.org.arc.data.HandleEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SSEService {

    //private Map<String, CopyOnWriteArrayList<SseEmitter>> emitterStore = new ConcurrentHashMap<>();
    //private Map<String, SseEmitter> clientCursorEmitters = new ConcurrentHashMap<>();

    private Map<String, Map<String, SseEmitter> > roomClientEmitters = new ConcurrentHashMap<>();
    private Map<String, EventCapture> eventCaptureStore = new ConcurrentHashMap<>();

    @Autowired
    SSEService(List<EventCapture> eventCaptures){
        eventCaptures.forEach(ec -> eventCaptureStore.put(getEventType(ec), ec));
    }

    public SseEmitter spawnEmitters(String roomUuid, String clientUuid){
        // 5분
        final Long TIME = 5 * (60 * 1000L);
        
        Map<String, SseEmitter> emitters = getEmitters(roomUuid);
        SseEmitter emitter = new SseEmitter(TIME);
        emitters.put(clientUuid, emitter);
        System.out.println("[ Spawn ] \t\t" +
                "Room : " + roomUuid +
                "\tClient : " + clientUuid);
        emitter.onCompletion(() -> {
            emitters.remove(clientUuid);
            System.out.println("[ Completion ] \t" +
                    "Room : " + roomUuid +
                    "\tClient : " + clientUuid);
        });

        emitter.onTimeout(() -> {
            emitters.remove(clientUuid);
            emitter.complete();
            System.out.println("[ Timeout ] \t" +
                    "Room : " + roomUuid +
                    "\tClient : " + clientUuid);
        });

        return emitter;
    }

    public void publish(HandleEvent handleEvent){
        String roomUuid = handleEvent.getRoomUuid();
        boolean hasKey = roomClientEmitters.containsKey(roomUuid);
        if(!hasKey){
            return;
        }
        Map<String, SseEmitter> clients = roomClientEmitters.get(roomUuid);
        clients.forEach( (targetClient, emitter) ->{
            doPublish(targetClient, handleEvent, emitter, clients);
        });
    }

    private void doPublish(String targetClient, HandleEvent handleEvent, SseEmitter emitter, Map<String, SseEmitter> clients){
        String eventType = handleEvent.getEventType();

        if( eventCaptureStore.containsKey(eventType) ){
            EventCapture eventCapture = eventCaptureStore.get(eventType);
            eventCapture.doAction(targetClient, handleEvent, (data) ->{
                try {
                    System.out.println("[ <- Send ] \t" +
                            "Room : " + handleEvent.getRoomUuid() +
                            "\tEvent : " + data.getHandleEvent().getEventType() +
                            "\tClient : " + targetClient +
                            " <- " + handleEvent.getClientUuid() );
                    emitter.send(data, MediaType.APPLICATION_JSON);
                } catch (IOException e) {
                    emitter.complete();
                    clients.remove(emitter);
                    e.printStackTrace();
                }
            });
        }
    }

    private Map<String, SseEmitter> getEmitters(String roomUuid){
        boolean hasRoomKey = roomClientEmitters.containsKey(roomUuid);
        if(!hasRoomKey){
            roomClientEmitters.put(roomUuid, new ConcurrentHashMap<>() );
        }
        return roomClientEmitters.get(roomUuid);
    }

    private String getEventType(EventCapture eventCapture){
        String simpleName = eventCapture.getClass().getSimpleName().toLowerCase();
        int index = simpleName.indexOf("event");
        return simpleName.substring(0, index);
    }
}
