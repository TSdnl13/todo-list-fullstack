package com.example.todots.controller;

import com.example.todots.entity.TaskList;
import com.example.todots.service.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "api/taskList")
public class TaskListController {

   @Autowired
   private final TaskListService taskListService;

   public TaskListController(TaskListService taskListService) {
      this.taskListService = taskListService;
   }

   @GetMapping
   public ResponseEntity<List<TaskList>> getAllTaskList() {
      return new ResponseEntity<>(taskListService.getAllTaskList(), HttpStatus.OK);
   }

   @GetMapping(path = "/user")
   public ResponseEntity<List<TaskList>> getAllTaskListByUserId(@RequestParam("id") Integer userId) {
      return taskListService.getAllTaskListByUser(userId)
              .map(allUserTaskList -> new ResponseEntity<>(allUserTaskList, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @GetMapping(path = "/{taskListId}")
   public ResponseEntity<TaskList> getTaskListById(@PathVariable("taskListId") Integer taskListId) {
      return taskListService.getTaskListById(taskListId)
              .map(taskList -> new ResponseEntity<>(taskList, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @PutMapping(path = "/{taskListId}")
   public ResponseEntity<TaskList> updateTaskList(@PathVariable("taskListId") Integer taskListId,
                                                  @RequestBody TaskList taskList) {
      return taskListService.updateTaskList(taskListId, taskList)
              .map(updatedTaskList -> new ResponseEntity<>(updatedTaskList, HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
   }

   @PostMapping
   public ResponseEntity<TaskList> saveTaskList(@RequestBody TaskList taskList) {
      return taskListService.saveTaskList(taskList)
              .map(savedTaskList -> new ResponseEntity<>(savedTaskList, HttpStatus.CREATED))
              .orElse(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
   }

   @DeleteMapping(path = "/delete/{taskListId}")
   public ResponseEntity deleteTaskListById(@PathVariable("taskListId") Integer taskListId) {
      if (taskListService.deleteTaskListById(taskListId)) {
         return new ResponseEntity(HttpStatus.OK);
      }

      return new ResponseEntity(HttpStatus.NOT_FOUND);
   }

}
