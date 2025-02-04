package com.example.demo.common;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    public static final String CODE_SUCCESS = "200";
    public static final String CODE_AUTH_ERROR = "401";
    public static final String CODE_SYSTEM_ERROR = "500";

    private String code;
    private String msg;
    private Object data;

    public static Result success() {
        return new Result(CODE_SUCCESS, "success", null);
    }
    public static Result success(Object data) {
        return new Result(CODE_SUCCESS, "success", data);
    }
    public static Result error(String msg) {
        return new Result(CODE_SYSTEM_ERROR, msg, null);
    }
    public static Result error(String code,String msg) {
        return new Result(code, msg, null);
    }
    public static Result error() {
        return new Result(CODE_SYSTEM_ERROR, "systemError", null);
    }
}
