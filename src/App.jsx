import TopBar from "./components/layout/TopBar";
import ContextHeader from "./components/layout/ContextHeader";
import PrimaryWorkspace from "./components/workspace/PrimaryWorkspace";
import SecondaryPanel from "./components/workspace/SecondaryPanel";
import ProofFooter from "./components/layout/ProofFooter";

function App() {
  return (
    <div className="app-shell">
      <TopBar projectName="KodNest Premium Build System" currentStep={1} totalSteps={4} status="Not Started" />
      <ContextHeader
        title="Build with deliberate quality and measurable proof."
        subtitle="Define the current step clearly, execute it in sequence, and record evidence before moving forward."
      />
      <main className="workspace-grid">
        <PrimaryWorkspace />
        <SecondaryPanel />
      </main>
      <ProofFooter />
    </div>
  );
}

export default App;
