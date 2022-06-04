package com.example.todots.repository;

import com.example.todots.entity.User;
import com.example.todots.entity.projections.UserSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

   Optional<User> findByEmail(String email);

   @Query("select u from User u where u.email = ?1")
   Optional<UserSummary> findUserSummaryByEmail(String email);

}
