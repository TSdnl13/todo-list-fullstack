package com.example.todots.repository;

import com.example.todots.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskListRepository extends JpaRepository<TaskList, Integer> {

   List<TaskList> findByUserId(Integer userId);
}
