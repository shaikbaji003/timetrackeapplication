import React, { useEffect, useState } from "react";
import "./SingleTask.css";

export default function SingleTask({ task, deleteTask, updateTask, index }) {
  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const [time, setTime] = useState(task?.time);
  const [history, setHistory] = useState(task?.history || []);

  useEffect(() => {
    let interval;
    if (task?.started) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      if (!task?.history) {
        // Add start time to history when task is started
        setHistory([{ type: "start", time: new Date() }]);
      }
    } else {
      clearInterval(interval);
      if (task?.history && task?.history.length > 0) {
        // Add stop time to history when task is stopped
        setHistory((prevHistory) => [
          ...prevHistory,
          { type: "stop", time: new Date() },
        ]);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [time, task?.started, task?.history]); // Include task?.history in the dependency array

  const handleStartStop = () => {
    updateTask("started", !task?.started, index);

    // Add history entry when task is started or stopped
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        type: task?.started ? "stop" : "start",
        time: new Date(),
      },
    ]);
  };

  return (
    <div className="single-task-container">
      <div className="flex-space-between-center">
        <p style={{ width: "calc(100% - 330px)" }} className="task-text">
          {task?.title}
        </p>

        <div
          style={{ width: "330px" }}
          className="flex-space-between-center timer-container "
        >
          <p className="time-for-task">{formatDuration(time)}</p>

          <div className="flex-flex-start-center">
            <div
              onClick={handleStartStop}
              style={{ background: task?.started ? "#ED5050" : "#5056ED" }}
              className="start-stop-button cursor-p mr-16px"
            >
              {task?.started ? "Stop" : "Start"}
            </div>
            <div
              onClick={() => {
                deleteTask(index);
              }}
              className="delete-task cursor-p flex-center-center"
            >
              X
            </div>
          </div>
        </div>
      </div>

      <div className="history-container  flex-flex-start-flex-start flex-column">
        <p className="history-container-text">History</p>

        <div className="mt-8px">
          {history.length === 0 ? (
            <p className="history-container-logs">
              No History Found, Click on the start button to track the timer
            </p>
          ) : (
            history.map((entry, idx) => (
              <p key={idx} className="history-container-logs">
                {entry.type === "stop" &&
                `Started the timer at ${entry.time.toLocaleString()} (Active)`}
                {entry.type === "start" &&
                `Stopped the timer at ${new Date().toLocaleString()}, (Inactive)`}
                
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}






//up3


