package com.org.arc.data;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CamClient {
    public CamClient(){}

    private String clientUuid;
    private String type;
    private int index;
}
