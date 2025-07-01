package com.swr302.hivsystem.hivbackend.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class MeetingLinkService {
    
    /**
     * Tạo link meet tự động cho online consultation
     * @param doctorName Tên bác sĩ
     * @param patientName Tên bệnh nhân
     * @param startTime Thời gian bắt đầu
     * @return Link meet được tạo
     */
    public String generateMeetingLink(String doctorName, String patientName, LocalDateTime startTime) {
        // Tạo một ID duy nhất cho cuộc họp
        String meetingId = UUID.randomUUID().toString().substring(0, 8);
        
        // Format thời gian
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd-HHmm");
        String timeString = startTime.format(formatter);
        
        // Tạo tên cuộc họp
        String meetingName = String.format("HIV-Consultation-%s-%s-%s", 
            doctorName.replaceAll("\\s+", ""), 
            patientName.replaceAll("\\s+", ""), 
            timeString);
        
        // Tạo link Google Meet (format mẫu)
        String meetingLink = String.format("https://meet.google.com/%s-%s-%s", 
            meetingId.substring(0, 3), 
            meetingId.substring(3, 6), 
            meetingId.substring(6, 8));
        
        return meetingLink;
    }
    
    /**
     * Tạo link meet với thông tin chi tiết hơn
     * @param consultationId ID của consultation
     * @param doctorName Tên bác sĩ
     * @param patientName Tên bệnh nhân
     * @param startTime Thời gian bắt đầu
     * @return Link meet được tạo
     */
    public String generateMeetingLinkWithDetails(Long consultationId, String doctorName, String patientName, LocalDateTime startTime) {
        // Tạo một ID duy nhất dựa trên consultation ID
        String baseId = String.format("%06d", consultationId);
        String randomId = UUID.randomUUID().toString().substring(0, 6);
        
        // Format thời gian
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMdd-HHmm");
        String timeString = startTime.format(formatter);
        
        // Tạo link Google Meet với format: https://meet.google.com/xxx-xxxx-xxx
        String meetingLink = String.format("https://meet.google.com/%s-%s-%s", 
            baseId.substring(0, 3), 
            randomId.substring(0, 4), 
            timeString.substring(0, 3));
        
        return meetingLink;
    }
    
    /**
     * Tạo link meet đơn giản với UUID
     * @return Link meet được tạo
     */
    public String generateSimpleMeetingLink() {
        String meetingId = UUID.randomUUID().toString().substring(0, 12);
        
        // Format: https://meet.google.com/xxx-xxxx-xxxx
        String meetingLink = String.format("https://meet.google.com/%s-%s-%s", 
            meetingId.substring(0, 3), 
            meetingId.substring(3, 7), 
            meetingId.substring(7, 11));
        
        return meetingLink;
    }
} 