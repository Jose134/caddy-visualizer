import './App.css'
import Route from './components/Route';

function App() {
  const mockData = {  };
  const routes = mockData.apps.http.servers.srv0.routes;

  return (
    <>
      {
        routes.map((route, index) => (<Route key={index} route={route}></Route>))
      }
    </>
  );
}

export default App
