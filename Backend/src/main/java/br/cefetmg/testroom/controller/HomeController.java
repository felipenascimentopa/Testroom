package br.cefetmg.testroom.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/home")

public class HomeController {
    @GetMapping("")
    public String getHome(){
        return "oi";
    }
}
