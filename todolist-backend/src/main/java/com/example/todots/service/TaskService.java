package com.example.todots.service;

import com.example.todots.entity.Task;
import com.example.todots.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

   @Autowired
   private final TaskRepository taskRepository;

   public TaskService(TaskRepository taskRepository) {
      this.taskRepository = taskRepository;
   }

   public List<Task> getTasks() {
      return taskRepository.findAll();
   }

   public Optional<List<Task>> getTasksByTaskListId(Integer taskListId) {
      return Optional.of(taskRepository.findByTaskListId(taskListId));
   }

   public Optional<Task> getTaskById(Integer taskId) {
      return taskRepository.findById(taskId);
   }

   public Optional<Task> saveTask(Task task){
      return Optional.of(taskRepository.save(task));
   }

   public Optional<Task> updateTask(Integer taskId, Task task){
      Optional<Task> optionalTask = taskRepository.findById(taskId);

      if (optionalTask.isEmpty()) {
         return Optional.empty();
      }

      Task existingTask = optionalTask.get();
      existingTask.setCompletedAt(task.getCompletedAt());
      existingTask.setImportant(task.getImportant());
      existingTask.setName(task.getName());
      existingTask.setNote(task.getNote());
      existingTask.setState(task.getState());
      existingTask.setDueDate(task.getDueDate());
      existingTask.setTaskListId(task.getTaskListId());

      return Optional.of(taskRepository.save(existingTask));
   }

   public boolean deleteTaskById(Integer taskId) {
      boolean isTaskPresent = taskRepository.findById(taskId).isPresent();

      if (isTaskPresent) {
         taskRepository.deleteById(taskId);
         return true;
      }
      return false;
   }

   public Optional<List<Task>> getImportantTasksByUserId(Integer userId) {
      return taskRepository.findImportantTasksByUserId(userId);
   }
}
