package com.example.todots.service;

import com.example.todots.entity.User;
import com.example.todots.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

   private final UserRepository userRepository;

   @Autowired
   public UserService(UserRepository userRepository) {
      this.userRepository = userRepository;
   }

   public List<User> getUsers() {
      return userRepository.findAll();
   }

   public Optional<User> getUserById(Integer userId) {
      return userRepository.findById(userId);
   }

   public Optional<User> saveUser(User user) {
      boolean existingUser = userRepository.findByEmail(user.getEmail()).isPresent();

      if (existingUser) {
         return Optional.empty();
      }

      return Optional.of(userRepository.save(user));
   }

   public Optional<User> updateUSer(Integer userId, User userUpdate) {
      Optional<User> optionalUser = userRepository.findById(userId);

      if (optionalUser.isEmpty()) {
         return Optional.empty();
      }
      User user = optionalUser.get();
      user.setPassword(userUpdate.getPassword());
      user.setName(userUpdate.getName());
      return Optional.of(userRepository.save(user));
   }
}
