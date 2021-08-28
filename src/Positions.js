import {useEffect, useState} from 'react'

function Positions(props) {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    if (props.positions !== undefined){
      setPositions(props.positions)
    }
  }, [props.positions])

  return (
    <div id='positions-table'>
      <h3>Positions</h3>
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