import logging
from datetime import datetime, timedelta
from collections import defaultdict

logger = logging.getLogger(__name__)

class ErrorMonitor:
    def __init__(self):
        self.error_counts = defaultdict(int)
        self.last_reset = datetime.now()
        self.alert_threshold = 100  # Umbral para alertas
        self.reset_interval = timedelta(hours=1)

    def log_error(self, error_type):
        self.error_counts[error_type] += 1
        self._check_and_report()

    def _check_and_report(self):
        if datetime.now() - self.last_reset > self.reset_interval:
            total_errors = sum(self.error_counts.values())
            if total_errors > self.alert_threshold:
                self._send_alert(total_errors)
            self._reset_counts()

    def _send_alert(self, total_errors):
        logger.critical(f"Alto número de errores en la última hora: {total_errors}")
        for error_type, count in self.error_counts.items():
            logger.error(f"  {error_type}: {count}")
        # Aquí se podría implementar el envío de alertas por email o a un sistema de monitoreo

    def _reset_counts(self):
        self.error_counts.clear()
        self.last_reset = datetime.now()

error_monitor = ErrorMonitor()

def monitor_error(error_type):
    error_monitor.log_error(error_type)