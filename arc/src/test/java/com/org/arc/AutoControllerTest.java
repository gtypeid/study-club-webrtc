package com.org.arc;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
public class AutoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void signal() throws Exception {
        String path = "/signal";
        mockMvc.perform(MockMvcRequestBuilders.get(path) )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("hello"));
    }

    @Test
    public void cam() throws Exception {
        String path = "/cam";
        mockMvc.perform(MockMvcRequestBuilders.get(path) )
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

}
