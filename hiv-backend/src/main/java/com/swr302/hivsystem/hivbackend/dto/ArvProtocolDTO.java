package com.swr302.hivsystem.hivbackend.dto;

public class ArvProtocolDTO {
    private Long id;
    private String name;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // fromEntity
    public static ArvProtocolDTO fromEntity(com.swr302.hivsystem.hivbackend.model.ArvProtocol protocol) {
        ArvProtocolDTO dto = new ArvProtocolDTO();
        dto.setId(protocol.getId());
        dto.setName(protocol.getName());
        return dto;
    }
} 