function PrimaryWorkspace() {
  return (
    <section className="primary-workspace">
      <article className="card">
        <h2>Primary Workspace</h2>
        <p>
          This area contains the main product interaction for the selected step. Content stays predictable and
          uncluttered to support focused execution.
        </p>
        <div className="input-group">
          <label htmlFor="goal">Current Goal</label>
          <input id="goal" type="text" placeholder="Describe the step objective" />
        </div>
        <div className="input-group">
          <label htmlFor="output">Expected Output</label>
          <textarea id="output" rows="5" placeholder="Define expected result criteria" />
        </div>
        <div className="button-row">
          <button className="btn btn-primary" type="button">Save Step Draft</button>
          <button className="btn btn-secondary" type="button">Reset Fields</button>
        </div>
      </article>

      <article className="card card--state">
        <h3>Empty State</h3>
        <p>No step artifacts are attached yet. Add your first artifact in the secondary panel to continue.</p>
      </article>

      <article className="card card--state card--error">
        <h3>Error State</h3>
        <p>
          Validation could not complete because required proof fields are missing. Add proof for each checklist item,
          then retry validation.
        </p>
      </article>
    </section>
  );
}

export default PrimaryWorkspace;
