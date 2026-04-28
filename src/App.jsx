import { useState } from 'react';
import UploadForm from './components/UploadForm';
import LiveWall from './components/LiveWall';

function App() {
  // Simple way to switch views: yoururl.com/?view=wall
  const queryParams = new URLSearchParams(window.location.search);
  const isWall = queryParams.get('view') === 'wall';

  return (
    <div className="App">
      {isWall ? <LiveWall /> : <UploadForm />}
    </div>
  );
}

export default App;