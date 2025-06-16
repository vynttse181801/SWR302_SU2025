package com.swr302.hivsystem.hivbackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ConsultationRequestDTO {
    private Long doctorId;
    private LocalDate date;
    private Long timeSlotId;
    private String symptoms;
    private String notes;
    private Long consultationTypeId; // Assuming a fixed consultation type for now, or it can be selected from frontend
} 