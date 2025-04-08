import Matcher from "./Matcher";
import "./Route.css";

function renderRoute(route) {
  return (
    <div class="container">
      <h2>Route</h2>
      {
        route.group
          ? <h3>Group: {route.group}</h3>
          : null
      }
      {
        route.match
          ? <><h3>Matchers:</h3>{route.match.map(matcher => <Matcher matcher={matcher} key={JSON.stringify(matcher)} />)}</>
          : null
      }
      {
        route.handle
          ? <><h3>Handlers:</h3>{route.handle.map(handler => (<Handler handler={handler} key={JSON.stringify(handler)} />))}</>
          : null
      }
      {
        route.terminal
          ? <h3>Terminal: {route.terminal ? "true" : "false"}</h3>
          : null
      }
    </div>
  );
}

const Handler = ({ handler }) => {
  switch (handler.handler) {
    case "subroute":
      return (
        <div>
          <p>Subroute:</p>
          {handler.routes.map((subRoute, index) => (
            <div key={index}>
              {JSON.stringify(subRoute)}
              {renderRoute(subRoute)}
            </div>
          ))}
        </div>
      );
    case "reverse_proxy":
      return (<p>Reverse Proxy: {handler.upstreams.map(upstream => upstream.dial).join(',')}</p>);
    case "static_response":
      return (<p>Static Response</p>);
    case "abort":
      return (<p>Abort</p>);
    default:
      return (<p>{JSON.stringify(handler)}</p>);
  }
}

const Route = ({ route }) => {
  // return (
  //   <div class="container">
  //     <h2>Route</h2>
  //     {
  //       route.match
  //         ? <><p>Matchers:</p>{route.match.map(matcher => <Matcher matcher={matcher} key={JSON.stringify(matcher)} />)}</>
  //         : null
  //     }
  //     {
  //       route.handle
  //         ? <><p>Handlers:</p>{route.handle.map(handler => (<Handler handler={handler} key={JSON.stringify(handler)} />))}</>
  //         : null
  //     }
  //     <p>Terminal: {JSON.stringify(route.terminal)}</p>
  //   </div>
  // );
  return renderRoute(route);
}

export default Route;