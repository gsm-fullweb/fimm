"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Login_1 = require("@/components/Login");
const Home_1 = require("@/components/Home");
const Camera_1 = require("@/components/Camera");
const Facade_1 = require("@/components/Facade");
const QRcode_1 = require("@/components/QRcode");
const ResultsPage_1 = require("@/components/ResultsPage");
const sonner_1 = require("@/components/ui/sonner");
const react_router_dom_1 = require("react-router-dom");
const router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: '/',
        element: <Login_1.Login />,
    },
    {
        path: '/home',
        element: <Home_1.Home />,
    },
    {
        path: '/camera',
        element: (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Camera_1.Camera />
        </div>
      </div>),
    },
    {
        path: '/facade',
        element: (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Facade_1.Facade />
        </div>
      </div>),
    },
    {
        path: '/qrcode',
        element: (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <QRcode_1.QRcode />
        </div>
      </div>),
    },
    {
        path: '/results',
        element: (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ResultsPage_1.ResultsPage />
        </div>
      </div>),
    },
]);
function App() {
    return (<>
      <react_router_dom_1.RouterProvider router={router}/>
      <sonner_1.Toaster />
    </>);
}
exports.default = App;
