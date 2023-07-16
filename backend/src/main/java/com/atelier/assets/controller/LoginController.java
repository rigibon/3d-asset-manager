package com.atelier.assets.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.atelier.assets.dao.UserRepository;
import com.atelier.assets.entity.User;
import com.atelier.assets.entity.UserRegistrationRequest;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "${allowed.origins}")
public class LoginController {

    private final UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody UserRegistrationRequest userRequest) {
        User newUser = new User();
        newUser.setUserName(userRequest.name);
        newUser.setEmail(userRequest.email);
        newUser.setPassword(new BCryptPasswordEncoder().encode(userRequest.password));
        userRepository.save(newUser);

        return newUser;
    }
}
