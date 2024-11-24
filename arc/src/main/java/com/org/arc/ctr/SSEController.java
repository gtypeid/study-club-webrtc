package com.org.arc.ctr;

import com.org.arc.data.HandleEvent;
import com.org.arc.data.Room;
import com.org.arc.data.RoomAccessInfo;
import com.org.arc.srv.RoomService;
import com.org.arc.srv.SSEService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@RestController
public class SSEController {

    private final RoomService roomService;
    private final SSEService sseService;

    @Autowired
    public SSEController(RoomService roomService, SSEService sseService){
        this.roomService = roomService;
        this.sseService = sseService;
    }

    @GetMapping("/sse-event/{roomUuid}/{clientUuid}")
    public SseEmitter sseEventBind(
            @PathVariable("roomUuid") String roomUuid ,
            @PathVariable("clientUuid") String clientUuid) {

        System.out.println("[ Event Bind ] \t" +
                "Room : " + roomUuid +
                "\tClient : " + clientUuid);
        return sseService.spawnEmitters(roomUuid, clientUuid);
    }

    @PostMapping("/handler")
    public HttpStatus handler(@RequestBody HandleEvent handleEvent){
        System.out.println("[ -> Handler ] \t" +
                "Room : " + handleEvent.getRoomUuid() +
                "\tEvent : " + handleEvent.getEventType() +
                "\tClient : " + handleEvent.getClientUuid() +
                " -> " + handleEvent.getTargetUuid() );
        sseService.publish(handleEvent);
        return HttpStatus.OK;
    }
}