function ProofFooter() {
  return (
    <footer className="proof-footer">
      <h2>Proof Checklist</h2>
      <div className="proof-grid">
        <label className="proof-item"><input type="checkbox" /> UI Built <input type="text" placeholder="Add proof link or note" /></label>
        <label className="proof-item"><input type="checkbox" /> Logic Working <input type="text" placeholder="Add proof link or note" /></label>
        <label className="proof-item"><input type="checkbox" /> Test Passed <input type="text" placeholder="Add proof link or note" /></label>
        <label className="proof-item"><input type="checkbox" /> Deployed <input type="text" placeholder="Add proof link or note" /></label>
      </div>
    </footer>
  );
}

export default ProofFooter;
