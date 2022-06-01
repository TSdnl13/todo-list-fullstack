package com.example.todots.entity;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {

   @Id
   @Column(name = "user_id")
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Integer userId;

   private String name;
   private String email;
   private String password;

   public User() {
   }

   public User(Integer userId, String name, String email, String password) {
      this.userId = userId;
      this.name = name;
      this.email = email;
      this.password = password;
   }

   public User(String name, String email, String password) {
      this.name = name;
      this.email = email;
      this.password = password;
   }

   public Integer getUserId() {
      return userId;
   }

   public void setUserId(Integer userId) {
      this.userId = userId;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getPassword() {
      return password;
   }

   public void setPassword(String password) {
      this.password = password;
   }
}
