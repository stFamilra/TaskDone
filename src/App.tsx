import React from "react";

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = "TaskDone" }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default App;
