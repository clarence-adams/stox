import Positions from './Positions.js'

function Overview(props) {
  return (
    <div id='overview'>
      <h2 id='overview-welcome-text'>Hello, {props.user.username}</h2>
      <h3 id='cash'>{props.cash}</h3>
      <Positions positions={props.user.positions}/>
    </div>
  )
}

export default Overview 