import logging
from datetime import datetime, timedelta
from collections import defaultdict

logger = logging.getLogger(__name__)

class ErrorMonitor:
    def __init__(self):
        self.error_counts = defaultdict(int)
        self.last_reset = datetime.now()

    def log_error(self, error_type):
        self.error_counts[error_type] += 1
        self._check_and_report()

    def _check_and_report(self):
        if datetime.now() - self.last_reset > timedelta(hours=1):
            total_errors = sum(self.error_counts.values())
            if total_errors > 100:  # Umbral arbitrario, ajustar según necesidades
                logger.critical(f"Alto número de errores en la última hora: {total_errors}")
                for error_type, count in self.error_counts.items():
                    logger.error(f"  {error_type}: {count}")
            self.error_counts.clear()
            self.last_reset = datetime.now()

error_monitor = ErrorMonitor()

def monitor_error(error_type):
    error_monitor.log_error(error_type)