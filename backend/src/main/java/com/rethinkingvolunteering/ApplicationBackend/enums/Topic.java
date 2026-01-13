package com.rethinkingvolunteering.ApplicationBackend.enums;

public enum Topic {

    // Add Topics here

    DOCUMENTS("Documents & Registration", "Government, IDs, Registration"),
    TRAVEL("Tickets & Travel", "MVV, Deutschlandticket, Parking"),
    NEW_IN_MUNICH("New in Munich", "Registration, Integration, Orientation"),
    GENERAL("General Questions", "Other digital assistance");


    private final String displayName;
    private final String description;

    Topic(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
