package com.example.demo.controller;

import com.example.demo.common.Result;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebController {

    @RequestMapping
    public Result hello() {
        return Result.success("hello");
    }
}
