package com.example.todots.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "task")
public class Task {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "task_id")
   private Integer taskId;

   @Column(name = "name", columnDefinition = "TEXT", nullable = false)
   private String name;

   private Boolean state;
   private LocalDateTime createdAt;

   @Column(name = "due_date")
   private LocalDate dueDate;

   @Column(columnDefinition = "TEXT")
   private String note;

   @Column(name = "is_important")
   private Boolean isImportant;

   @Column(name = "completed_at")
   private LocalDateTime completedAt;

   @Column(name = "task_list_id", nullable = false)
   private Integer taskListId;

   @ManyToOne
   @JoinColumn(name = "task_list_id", insertable = false, updatable = false)
   @JsonIgnore
   private TaskList taskList;

   public Task() {
   }

   public Task(String name, Boolean state,
               LocalDateTime createdAt, LocalDate dueDate,
               String note, Boolean isImportant,
               LocalDateTime completedAt, Integer taskListId) {
      this.name = name;
      this.state = state;
      this.createdAt = createdAt;
      this.dueDate = dueDate;
      this.note = note;
      this.isImportant = isImportant;
      this.completedAt = completedAt;
      this.taskListId = taskListId;
   }

   public Task(String name,
               Boolean state, LocalDateTime createdAt,
               Integer taskListId) {
      this.name = name;
      this.state = state;
      this.createdAt = createdAt;
      this.taskListId = taskListId;
   }

   public Integer getTaskId() {
      return taskId;
   }

   public void setTaskId(Integer taskId) {
      this.taskId = taskId;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public Boolean getState() {
      return state;
   }

   public void setState(Boolean state) {
      this.state = state;
   }

   public LocalDateTime getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
   }

   public LocalDate getDueDate() {
      return dueDate;
   }

   public void setDueDate(LocalDate dueDate) {
      this.dueDate = dueDate;
   }

   public String getNote() {
      return note;
   }

   public void setNote(String note) {
      this.note = note;
   }

   public Boolean getImportant() {
      return isImportant;
   }

   public void setImportant(Boolean important) {
      isImportant = important;
   }

   public LocalDateTime getCompletedAt() {
      return completedAt;
   }

   public void setCompletedAt(LocalDateTime completedAt) {
      this.completedAt = completedAt;
   }

   public Integer getTaskListId() {
      return taskListId;
   }

   public void setTaskListId(Integer taskListId) {
      this.taskListId = taskListId;
   }

   public TaskList getTaskList() {
      return taskList;
   }

   public void setTaskList(TaskList taskList) {
      this.taskList = taskList;
   }
}