package com.example.demo.controller;

import com.example.demo.common.Result;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;


    @PostMapping ("/register")
    public Result register(@RequestBody  User user) {
        try{
            userService.insertUser(user);
        }catch (Exception e){
            if(e instanceof MyBatisSystemException){
                return Result.success(user);
//                return Result.error("数据库错误");
            }
            return Result.error("数据错误");
        }
        return Result.success();
    }
}
