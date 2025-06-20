package com.swr302.hivsystem.hivbackend.repository;

import com.swr302.hivsystem.hivbackend.model.AppointmentReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentReminderRepository extends JpaRepository<AppointmentReminder, Long> {
} 