import { generateTextFile } from "./TestTXTPaymentFile";

const TestFile: React.FC = () => {

  return (
    <div>
      <button onClick={generateTextFile}>Generate Payment File</button>
    </div>
  );
};

export default TestFile;
