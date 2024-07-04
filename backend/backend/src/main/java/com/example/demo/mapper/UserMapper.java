package com.example.demo.mapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    @Insert({"INSERT INTO `user` (username, account, password) VALUES (#{username}, #{account}, #{password})"})
    void insertUser( User user);
}
