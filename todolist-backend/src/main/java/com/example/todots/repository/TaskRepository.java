package com.example.todots.repository;

import com.example.todots.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {

   List<Task> findByTaskListId(Integer taskListId);

   @Query(value = "SELECT t.* FROM task t LEFT JOIN task_list tl ON tl.task_list_id=t.task_list_id LEFT JOIN users u " +
                  " ON u.user_id=tl.user_id WHERE u.user_id= ?1 AND t.is_important=true",
         nativeQuery = true)
   Optional<List<Task>> findImportantTasksByUserId(Integer userId);
}