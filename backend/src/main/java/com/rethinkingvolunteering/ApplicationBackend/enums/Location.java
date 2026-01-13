package com.rethinkingvolunteering.ApplicationBackend.enums;

public enum Location {

    // Add locations here

    CENTRAL_LIBRARY("Central Library", "Rosenheimer Str. 5, 81667 München"),
    MOOSACH("Moosach Library", "Pelkovenstr. 145, 80992 München"),
    SENDLING("Sendling Senior Center", "Gotzinger Str. 45, 81369 München"),
    SCHWABING("Schwabing Community Center", "Belgradstr. 169, 80804 Münchnen");

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
