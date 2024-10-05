class UserPermissions:
    permissions = db.Column(db.JSON, default=[])

    def has_permission(self, permission):
        return permission in self.permissions

    def add_permission(self, permission):
        if permission not in self.permissions:
            self.permissions.append(permission)

    def remove_permission(self, permission):
        if permission in self.permissions:
            self.permissions.remove(permission)

    def add_active_session(self, jti, device_info):
        self.active_sessions.append({
            'jti': jti,
            'device_info': device_info,
            'created_at': datetime.utcnow().isoformat()
        })

    def remove_active_session(self, jti):
        self.active_sessions = [session for session in self.active_sessions if session['jti'] != jti]