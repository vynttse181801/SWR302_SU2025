package com.swr302.hivsystem.hivbackend.service;

import com.swr302.hivsystem.hivbackend.model.TreatmentReminder;
import com.swr302.hivsystem.hivbackend.repository.TreatmentReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.time.temporal.ChronoUnit;

@Component
public class ReminderScheduler {
    @Autowired
    private TreatmentReminderRepository treatmentReminderRepository;

    // Chạy mỗi 20 giây
    @Scheduled(fixedRate = 20000)
    public void updateRemindersStatus() {
        System.out.println("Backend timezone: " + java.util.TimeZone.getDefault().getID());
        System.out.println("Server LocalDateTime.now(): " + java.time.LocalDateTime.now());
        LocalDateTime nowPlus5 = LocalDateTime.now().plusMinutes(5);
        List<TreatmentReminder> dueReminders = treatmentReminderRepository
            .findByStatusAndReminderDateBefore("PENDING", nowPlus5);
        System.out.println("Scheduler running at " + LocalDateTime.now() + ", found " + dueReminders.size() + " reminders to update.");
        for (TreatmentReminder reminder : dueReminders) {
            reminder.setStatus("SENT");
            treatmentReminderRepository.save(reminder);
            System.out.println("Updated reminder id " + reminder.getId() + " to SENT");
            // TODO: Gửi thông báo/email nếu muốn
        }
    }
} 