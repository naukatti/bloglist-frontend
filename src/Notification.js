import React from "react";
import "./notification.css";

export const Notification = ({ notification }) => {
  const { message, status } = notification;
  if (message === "") {
    return null;
  }

  return (
    <div className={status}>
      <p>{message}</p>
    </div>
  );
};
