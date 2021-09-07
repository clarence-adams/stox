const Overview = (props) => {
  return (
    <div id='overview'>
      <h2 id='overview-welcome-text'>Hello, {props.user.username}</h2>
      <h3 id='cash'>{props.cash}</h3>
    </div>
  )
}

export default Overview 