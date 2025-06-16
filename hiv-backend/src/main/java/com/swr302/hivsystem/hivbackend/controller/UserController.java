package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.dto.AuthRequest;
import com.swr302.hivsystem.hivbackend.dto.AuthResponse;
import com.swr302.hivsystem.hivbackend.dto.ChangePasswordRequest;
import com.swr302.hivsystem.hivbackend.dto.UserDTO;
import com.swr302.hivsystem.hivbackend.exception.EmailAlreadyExistsException;
import com.swr302.hivsystem.hivbackend.exception.UsernameAlreadyExistsException;
import com.swr302.hivsystem.hivbackend.model.User;
import com.swr302.hivsystem.hivbackend.repository.UserRepository;
import com.swr302.hivsystem.hivbackend.security.JwtTokenProvider;
import com.swr302.hivsystem.hivbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Use userService to handle registration, which includes uniqueness checks
            userService.createUser(convertToDTO(user));
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (UsernameAlreadyExistsException | EmailAlreadyExistsException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception ex) {
            return new ResponseEntity<>("Đã xảy ra lỗi không mong muốn trong quá trình đăng ký.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            // Retrieve full user details after authentication
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userService.getUserEntityByUsername(userDetails.getUsername());

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole().getRoleName() // Assuming getRoleName() exists on Role entity
            ));
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Tên người dùng hoặc mật khẩu không hợp lệ.", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Đã xảy ra lỗi trong quá trình xác thực.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        // This endpoint will be used for ADMIN to create users, will rely on UserService for validation
        return ResponseEntity.ok(userService.createUser(userDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO));
    }

    @PutMapping("/{id}/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            userService.changePassword(id, changePasswordRequest);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        return ResponseEntity.ok(userService.existsByUsername(username));
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        return ResponseEntity.ok(userService.existsByEmail(email));
    }

    private UserDTO convertToDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFullName(user.getFullName());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setPassword(user.getPassword()); // Only for registration DTO
        userDTO.setRole(user.getRole());
        return userDTO;
    }
} 