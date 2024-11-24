package com.org.arc.cap;

import com.org.arc.data.HandleEvent;
import com.org.arc.data.RoomStateEventHandler;

import java.util.function.Consumer;


@FunctionalInterface
public interface EventCapture {
    void doAction(String targetClient, HandleEvent handleEvent, Consumer<RoomStateEventHandler> consumer);
}
