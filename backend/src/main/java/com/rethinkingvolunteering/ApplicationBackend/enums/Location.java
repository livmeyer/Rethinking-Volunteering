package com.rethinkingvolunteering.ApplicationBackend.enums;

public enum Location {

    // Add locations here

    MUENCHEN_ZENTRUM("München Zentrum", "Hauptstraße 1"),
    MUENCHEN_NORD("München Nord", "Nordring 15"),
    MUENCHEN_SUED("München Süd", "Teststraße 14");

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
