package com.inventra.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "alert_notifications")
public class AlertNotification {

    @Id
    private String id;
    private String alertId;
    private Date triggeredAt;
    private boolean notificationSent;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAlertId() { return alertId; }
    public void setAlertId(String alertId) { this.alertId = alertId; }

    public Date getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(Date triggeredAt) { this.triggeredAt = triggeredAt; }

    public boolean isNotificationSent() { return notificationSent; }
    public void setNotificationSent(boolean notificationSent) { this.notificationSent = notificationSent; }
}
