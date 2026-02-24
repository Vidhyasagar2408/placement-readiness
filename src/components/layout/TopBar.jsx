function TopBar({ projectName, currentStep, totalSteps, status }) {
  const statusClass = {
    "Not Started": "status-badge--not-started",
    "In Progress": "status-badge--in-progress",
    Shipped: "status-badge--shipped",
  }[status] || "status-badge--not-started";

  return (
    <header className="top-bar">
      <div className="top-bar__left">{projectName}</div>
      <div className="top-bar__center">Step {currentStep} / {totalSteps}</div>
      <div className={`status-badge ${statusClass}`}>{status}</div>
    </header>
  );
}

export default TopBar;
