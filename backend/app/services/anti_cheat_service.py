class AntiCheatService:
    @staticmethod
    def evaluate_event(event_type: str) -> dict:
        """
        Evaluate the severity of an anti-cheat event.
        Events: tab_switch, focus_loss, exit_fullscreen, camera_disabled, microphone_muted
        """
        severity_map = {
            "tab_switch": "high",
            "focus_loss": "medium",
            "exit_fullscreen": "high",
            "camera_disabled": "critical",
            "microphone_muted": "medium",
            "multiple_monitor_detected": "critical"
        }
        
        severity = severity_map.get(event_type, "low")
        
        # Decide if we need to auto-pause the interview
        action = "log"
        if severity == "critical":
            action = "pause_interview"
        elif severity == "high":
            action = "warn_candidate"
            
        return {
            "severity": severity,
            "action": action,
            "message": f"Anti-cheat alert: {event_type} detected. Severity: {severity}."
        }
