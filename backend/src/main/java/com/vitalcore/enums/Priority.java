package com.vitalcore.enums;

public enum Priority {
    CRITICAL(1), URGENT(2), NORMAL(3);

    private final int sortOrder;

    Priority(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
