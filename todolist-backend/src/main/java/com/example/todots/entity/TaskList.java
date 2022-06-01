package com.example.todots.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "task_list")
public class TaskList {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "task_list_id")
   private Integer taskListId;

   private String name;

   @Column(name = "user_id")
   private Integer userId;

   @ManyToOne
   @JoinColumn(name = "user_id", insertable = false, updatable = false)
   @JsonIgnore
   private User user;

   public TaskList() {}

   public TaskList(Integer taskListId, String name, Integer userId) {
      this.taskListId = taskListId;
      this.name = name;
      this.userId = userId;
   }

   public TaskList(String name, Integer userId) {
      this.name = name;
      this.userId = userId;
   }

   public Integer getTaskListId() {
      return taskListId;
   }

   public void setTaskListId(Integer taskListId) {
      this.taskListId = taskListId;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public Integer getUserId() {
      return userId;
   }

   public void setUserId(Integer userId) {
      this.userId = userId;
   }

   public User getUser() {
      return user;
   }

   public void setUser(User user) {
      this.user = user;
   }
}
