function SecondaryPanel() {
  return (
    <aside className="secondary-panel">
      <article className="card">
        <h2>Step Guidance</h2>
        <p>Complete one step at a time. Keep instructions concise, then verify proof before status changes.</p>

        <label htmlFor="prompt">Copyable Prompt</label>
        <textarea
          id="prompt"
          rows="8"
          readOnly
          value="Implement only the active step. Preserve design system rules. Capture proof before checking completion."
        />

        <div className="button-stack">
          <button className="btn btn-primary" type="button">Copy</button>
          <button className="btn btn-secondary" type="button">Build in Lovable</button>
          <button className="btn btn-secondary" type="button">It Worked</button>
          <button className="btn btn-secondary" type="button">Error</button>
          <button className="btn btn-secondary" type="button">Add Screenshot</button>
        </div>
      </article>
    </aside>
  );
}

export default SecondaryPanel;
