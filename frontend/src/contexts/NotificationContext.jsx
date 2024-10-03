import React, { createContext, useState, useContext } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (type, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <div className="fixed top-4 right-4 z-50">
                {notifications.map(({ id, type, message }) => (
                    <Notification
                        key={id}
                        type={type}
                        message={message}
                        onClose={() => removeNotification(id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};