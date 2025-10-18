package com.medease.backend.dto;

import com.medease.backend.entity.Role;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private UserInfo user;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public UserInfo getUser() {
        return user;
    }
    
    public void setUser(UserInfo user) {
        this.user = user;
    }
    
    // Inner class for user info
    public static class UserInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private Role role;
        
        // Constructors
        public UserInfo() {}
        
        public UserInfo(Long id, String firstName, String lastName, String email, Role role) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.role = role;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public Role getRole() {
            return role;
        }
        
        public void setRole(Role role) {
            this.role = role;
        }
    }
}
