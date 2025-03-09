import { Login } from '@/components/Login';
import { Home } from '@/components/Home';
import { Camera } from '@/components/Camera';
import { Facade } from '@/components/Facade';
import { QRcode } from '@/components/QRcode';
import { ResultsPage } from '@/components/ResultsPage';
import { Toaster } from '@/components/ui/sonner';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/camera',
    element: (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Camera />
        </div>
      </div>
    ),
  },
  {
    path: '/facade',
    element: (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Facade />
        </div>
      </div>
    ),
  },
  {
    path: '/qrcode',
    element: (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <QRcode />
        </div>
      </div>
    ),
  },
  {
    path: '/results',
    element: (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ResultsPage />
        </div>
      </div>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
