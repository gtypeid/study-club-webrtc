package com.org.arc;


import com.org.arc.ctr.CamController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@WebMvcTest(CamController.class)
public class CamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testCreateRoom() throws Exception {
        String path = "/create-room/1234234";
        mockMvc.perform(MockMvcRequestBuilders.get(path) )
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testJoin() throws Exception {
        String path = "/join-room/1234234";
        mockMvc.perform(MockMvcRequestBuilders.get(path) )
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
