package com.example.todots.service;

import com.example.todots.entity.User;
import com.example.todots.entity.projections.UserSummary;
import com.example.todots.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

   private final UserRepository userRepository;
   private final BCryptPasswordEncoder bCryptPasswordEncoder;

   @Autowired
   public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
      this.userRepository = userRepository;
      this.bCryptPasswordEncoder = bCryptPasswordEncoder;
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
      String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
      user.setPassword(encodedPassword);
      return Optional.of(userRepository.save(user));
   }

   public Optional<User> updateUser(Integer userId, User userUpdate) {
      Optional<User> optionalUser = userRepository.findById(userId);

      if (optionalUser.isEmpty()) {
         return Optional.empty();
      }
      User user = optionalUser.get();
      if (!bCryptPasswordEncoder.matches(userUpdate.getPassword(), user.getPassword())) {
         String encodedPassword = bCryptPasswordEncoder.encode(userUpdate.getPassword());
         user.setPassword(encodedPassword);
      }
      user.setName(userUpdate.getName());
      return Optional.of(userRepository.save(user));
   }

   public boolean deleteUserById(Integer userId) {
      boolean existingUser = userRepository.findById(userId).isPresent();

      if (existingUser) {
         userRepository.deleteById(userId);
         return true;
      }
      return false;
   }

   public Optional<UserSummary> getUserByEmail(String email) {
      return userRepository.findUserSummaryByEmail(email);
   }

   public boolean signIn(User userToLogin, UserSummary existingUser) {
      if (bCryptPasswordEncoder.matches(userToLogin.getPassword(), existingUser.getPassword())) {
         return true;
      }
      return false;
   }
}
