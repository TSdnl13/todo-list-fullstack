package com.example.todots.controller;

import com.example.todots.entity.User;
import com.example.todots.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/user")
public class UserController {

   private final UserService userService;

   @Autowired
   public UserController(UserService userService) {
      this.userService = userService;
   }

   @GetMapping
   public ResponseEntity<List<User>> getUsers() {
      return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);
   }

   @GetMapping(path = "{userId}")
   public ResponseEntity<User> getUserById(@PathVariable("userId") Integer userId) {
      return userService.getUserById(userId)
              .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @PutMapping(path = "/{userId}")
   public ResponseEntity<User> updateUser(@PathVariable("userId") Integer userId,
                                          @RequestBody User user) {
      return userService.updateUSer(userId, user)
              .map(updatedUser -> new ResponseEntity<>(updatedUser, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @PostMapping
   public ResponseEntity<User> saveUser(@RequestBody User user) {
      return userService.saveUser(user)
              .map(savedUser -> new ResponseEntity<>(savedUser, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.CONFLICT));
   }
}
