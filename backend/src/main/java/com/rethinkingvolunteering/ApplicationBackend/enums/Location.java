package com.rethinkingvolunteering.ApplicationBackend.enums;

public enum Location {

    // Add locations here

    CENTRAL_LIBRARY("Central Library", "Rosenheimer Str. 5, 81667 München"),
    MOOSACH_LIBRARY("Moosach Library", "Pelkovenstr. 145, 80992 München"),
    SENDLING_SENIOR_CENTER("Sendling Senior Center", "Gotzinger Str. 45, 81369 München");

    private final String displayName;
    private final String address;

    Location(String displayName, String address) {
        this.displayName = displayName;
        this.address = address;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getAddress() {
        return address;
    }
}
