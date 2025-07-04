package com.swr302.hivsystem.hivbackend.service.impl;

import com.swr302.hivsystem.hivbackend.dto.ChangePasswordRequest;
import com.swr302.hivsystem.hivbackend.dto.UserDTO;
import com.swr302.hivsystem.hivbackend.exception.EmailAlreadyExistsException;
import com.swr302.hivsystem.hivbackend.exception.UsernameAlreadyExistsException;
import com.swr302.hivsystem.hivbackend.model.Role;
import com.swr302.hivsystem.hivbackend.model.User;
import com.swr302.hivsystem.hivbackend.repository.RoleRepository;
import com.swr302.hivsystem.hivbackend.repository.UserRepository;
import com.swr302.hivsystem.hivbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if (existsByUsername(userDTO.getUsername())) {
            throw new UsernameAlreadyExistsException("Tên người dùng đã tồn tại: " + userDTO.getUsername());
        }
        if (existsByEmail(userDTO.getEmail())) {
            throw new EmailAlreadyExistsException("Email đã tồn tại: " + userDTO.getEmail());
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setFullName(userDTO.getFullName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // Find the Role entity from the database using roleName from DTO
        Role assignedRole = roleRepository.findByRoleName(userDTO.getRole().getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found: " + userDTO.getRole().getRoleName()));
        user.setRole(assignedRole);

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check for username and email uniqueness if they are changed
        if (!existingUser.getUsername().equals(userDTO.getUsername()) && existsByUsername(userDTO.getUsername())) {
            throw new UsernameAlreadyExistsException("Tên người dùng đã tồn tại: " + userDTO.getUsername());
        }
        if (!existingUser.getEmail().equals(userDTO.getEmail()) && existsByEmail(userDTO.getEmail())) {
            throw new EmailAlreadyExistsException("Email đã tồn tại: " + userDTO.getEmail());
        }

        existingUser.setUsername(userDTO.getUsername());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setFullName(userDTO.getFullName());
        existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        // Update role only if provided and different
        if (userDTO.getRole() != null && !existingUser.getRole().getRoleName().equals(userDTO.getRole().getRoleName())) {
            Role newRole = roleRepository.findByRoleName(userDTO.getRole().getRoleName())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + userDTO.getRole().getRoleName()));
            existingUser.setRole(newRole);
        }
        // Nếu user đang INACTIVE thì chuyển lại thành ACTIVE khi cập nhật
        if (existingUser.getStatus() != null && existingUser.getStatus().name().equals("INACTIVE")) {
            existingUser.setStatus(com.swr302.hivsystem.hivbackend.model.UserStatus.ACTIVE);
        }

        User updatedUser = userRepository.save(existingUser);
        return convertToDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDTO(user);
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return convertToDTO(user);
    }

    @Override
    public User getUserEntityByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest changePasswordRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify current password
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng.");
        }

        // Encode and set new password
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserDTO deactivateUser(Long id) {
        User user = userRepository.findById(id)
            .orElse(null);
        if (user == null) {
            return null;
        }
        user.setStatus(com.swr302.hivsystem.hivbackend.model.UserStatus.INACTIVE);
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    private UserDTO convertToDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        userDTO.setStatus(user.getStatus());
        return userDTO;
    }
} 