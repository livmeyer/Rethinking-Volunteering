package com.rethinkingvolunteering.ApplicationBackend.enums;

public enum Topic {

    // Add Topics here

    BUERGERSERVICE("Bürgerservice", "Hilfe bei Formulare und Anträgen"),
    ANMELDUNG("Anmeldung/KVR", "Hilfe bei An-/Ummeldung und mehr"),
    MVV("Öffentlicher Nahverkehr/MVV", "Hilfe zur MVV/MVG App, Tickets und Abos"),
    TECHNIK("Technische Hilfe", "Hilfe zu Smartphone, Computer, Internet & Software");


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
