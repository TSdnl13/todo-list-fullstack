package com.example.todots.repository;

import com.example.todots.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

   List<Task> findByTaskListId(Integer taskListId);
}