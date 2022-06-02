package com.example.todots.service;

import com.example.todots.entity.TaskList;
import com.example.todots.repository.TaskListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskListService {

   @Autowired
   private final TaskListRepository taskListRepository;

   public TaskListService(TaskListRepository taskListRepository) {
      this.taskListRepository = taskListRepository;
   }

   public List<TaskList> getAllTaskList() {
      return taskListRepository.findAll();
   }

   public Optional<List<TaskList>> getAllTaskListByUser(Integer userId) {
      return Optional.of(taskListRepository.findByUserId(userId));
   }

   public Optional<TaskList> getTaskListById(Integer taskListId) {
      return taskListRepository.findById(taskListId);
   }

   public Optional<TaskList> saveTaskList(TaskList taskList){
      return Optional.of(taskListRepository.save(taskList));
   }

   public Optional<TaskList> updateTaskList(Integer taskListId, TaskList taskList) {
      Optional<TaskList> taskListOptional = taskListRepository.findById(taskListId);

      if (taskListOptional.isEmpty()) {
         return Optional.empty();
      }
      taskListOptional.get().setName(taskList.getName());
      return Optional.of(taskListRepository.save(taskListOptional.get()));
   }

   public boolean deleteTaskListById(Integer taskListId) {
      boolean existingTaskList = taskListRepository.findById(taskListId).isPresent();

      if (existingTaskList) {
         taskListRepository.deleteById(taskListId);
         return true;
      }
      return false;
   }
}
