package com.example.todots.controller;

import com.example.todots.entity.Task;
import com.example.todots.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "api/task")
public class TaskController {

   @Autowired
   private final TaskService taskService;

   public TaskController(TaskService taskService) {
      this.taskService = taskService;
   }

   @GetMapping
   public ResponseEntity<List<Task>> getAllTasks() {
      return new ResponseEntity<>(taskService.getTasks(), HttpStatus.OK);
   }

   @GetMapping(path = "/taskList")
   public ResponseEntity<List<Task>> getAllTaskByTaskListId(@RequestParam("id") Integer taskListId) {
      return taskService.getTasksByTaskListId(taskListId)
              .map(taskListTasks -> new ResponseEntity<>(taskListTasks, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @GetMapping(path = "/{taskId}")
   public ResponseEntity<Task> getTaskById(@PathVariable("taskId") Integer taskId) {
      return taskService.getTaskById(taskId)
              .map(task -> new ResponseEntity<>(task, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @PutMapping(path = "/{taskId}")
   public ResponseEntity<Task> updateTask(@PathVariable("taskId") Integer taskId,
                                          @RequestBody Task task) {
      return taskService.updateTask(taskId, task)
              .map(updatedTask -> new ResponseEntity<>(updatedTask, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @PostMapping
   public ResponseEntity<Task> saveTask(@RequestBody Task task) {
      return taskService.saveTask(task)
              .map(updatedTask -> new ResponseEntity<>(updatedTask, HttpStatus.CREATED))
              .orElse(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
   }

   @DeleteMapping(path = "/delete/{taskId}")
   public ResponseEntity deleteTaskById(@PathVariable("taskId") Integer taskId) {
      if (taskService.deleteTaskById(taskId)) {
         return new ResponseEntity(HttpStatus.OK);
      }
      return new ResponseEntity(HttpStatus.NOT_FOUND);
   }
}
