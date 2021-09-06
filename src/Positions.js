import {useEffect, useState} from 'react'

function Positions(props) {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    if (props.positions !== undefined){
      setPositions(props.positions)
    }
  }, [props.positions])

  return (
    <div id='positions'>
      <h3>Positions</h3>
      <table id='positions-table'>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Shares</th>
            <th>Average Cost</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((element, index) =>
            <tr key={index}>
              <td>{element.symbol}</td>
              <td>{element.shares}</td>
              <td className='dollar-td'>{'$' + element.averageShareValue.toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Positions