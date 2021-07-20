import './Positions.css'
import {useEffect, useState} from 'react'

function Positions(props) {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    if (props.positions !== undefined){
      setPositions(props.positions)
      console.log(props.positions)
    }
  }, [props.positions])

  return (
    <div id='positions-table'>
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Shares</th>
            <th>Average Price</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((element, index) =>
            <tr key={index}>
              <td>{element.symbol}</td>
              <td>{element.shares}</td>
              <td>{element.averageShareValue.toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Positions