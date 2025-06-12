package com.swr302.hivsystem.hivbackend.service;

import com.swr302.hivsystem.hivbackend.dto.ChangePasswordRequest;
import com.swr302.hivsystem.hivbackend.dto.UserDTO;
import com.swr302.hivsystem.hivbackend.model.User;
import java.util.List;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    UserDTO getUserByUsername(String username);
    User getUserEntityByUsername(String username);
    void changePassword(Long userId, ChangePasswordRequest changePasswordRequest);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
} 