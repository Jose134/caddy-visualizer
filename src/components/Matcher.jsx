
const ClientIP = ({ client_ip }) => {
  // return <><pre>ClientIP</pre>{JSON.stringify(client_ip)}</>;
  return (<div>Not implemented yet</div>);
}

const Expression = ({ expression }) => {
  // return <><pre>Expression</pre>{JSON.stringify(expression)}</>;
  return (<div>Not implemented yet</div>);
}

const File = ({ file }) => {
  // return <><pre>File</pre>{JSON.stringify(file)}</>;
  return (<div>Not implemented yet</div>);
}

const Header = ({ header }) => {
  // return <><pre>Header</pre>{JSON.stringify(header)}</>;
  return (<div>Not implemented yet</div>);
}

const HeaderRegexp = ({ header_regexp }) => {
  // return <><pre>HeaderRegexp</pre>{JSON.stringify(header_regexp)}</>;
  return (<div>Not implemented yet</div>);
}

const Host = ({ host }) => {
  return <><pre>Host</pre>{host.join(', ')}</>;
}

const Method = ({ method }) => {
  // return <><pre>Method</pre>{JSON.stringify(method)}</>;
  return (<div>Not implemented yet</div>);
}

const Not = ({ not }) => {
  // return <><pre>Not</pre>{JSON.stringify(not)}</>;
  return (<div>Not implemented yet</div>);
}

const Path = ({ path }) => {
  // return <><pre>Path</pre>{JSON.stringify(path)}</>;
  return (<div>Not implemented yet</div>);
}

const PathRegexp = ({ path_regexp }) => {
  // return <><pre>PathRegexp</pre>{JSON.stringify(path_regexp)}</>;
  return (<div>Not implemented yet</div>);
}

const Protocol = ({ protocol }) => {
  // return <><pre>Protocol</pre>{JSON.stringify(protocol)}</>;
  return (<div>Not implemented yet</div>);
}

const Query = ({ query }) => {
  // return <><pre>Query</pre>{JSON.stringify(query)}</>;
  return (<div>Not implemented yet</div>);
}

const RemoteIP = ({ remote_ip }) => {
  // return <><pre>RemoteIP</pre>{JSON.stringify(remote_ip)}</>;
  return (<div>Not implemented yet</div>);
}

const TLS = ({ tls }) => {
  // return <><pre>TLS</pre>{JSON.stringify(tls)}</>;
  return (<div>Not implemented yet</div>);
}

const Vars = ({ vars }) => {
  // return <><pre>Vars</pre>{JSON.stringify(vars)}</>;
  return (<div>Not implemented yet</div>);
}

const VarsRegexp = ({ vars_regexp }) => {
  // return <><pre>VarsRegexp</pre>{JSON.stringify(vars_regexp)}</>;
  return (<div>Not implemented yet</div>);
}


const Matcher = ({ matcher }) => {

  const componentMap = {
    client_ip: ClientIP,
    expression: Expression,
    file: File,
    header: Header,
    header_regexp: HeaderRegexp,
    host: Host,
    method: Method,
    not: Not,
    path: Path,
    path_regexp: PathRegexp,
    protocol: Protocol,
    query: Query,
    remote_ip: RemoteIP,
    tls: TLS,
    vars: Vars,
    vars_regexp: VarsRegexp,
  };

  return (
    <>
      {
        Object.keys(matcher).map(key => {
          const Component = componentMap[key];
          if (Component) {
            return <Component key={key} {...{ [key]: matcher[key] }} />;
          } else {
            return <p key={key}>{key}: {JSON.stringify(matcher[key])}</p>;
          }
        })
      }
    </>
  )
}

export default Matcher;