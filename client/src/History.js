import './History.css'
import {useEffect, useState} from 'react'

function History(props) {
  const [purchases, setPurchases] = useState([])
  const [sales, setSales] = useState([])

  useEffect(() => {
    if (props.purchases !== undefined) {
      setPurchases(props.purchases)
    }
  }, [props.purchases])

  useEffect(() => {
    if (props.sales !== undefined) {
      setSales(props.sales)
    }
  })

  return (
    <div id='history-tables'>
      <p>Purchases</p>
      <table id='purchases-table'>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Shares</th>
            <th>Price</th>
            <th>Transaction Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((element, index) =>
            <tr key={index}>
              <td>{element.symbol}</td>
              <td>{element.shares}</td>
              <td>{element.shareValue.toFixed(2)}</td>
              <td>{element.date}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Sales</p>
      <table id='sales-table'>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Shares</th>
            <th>Price</th>
            <th>Transaction Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((element, index) =>
            <tr key={index}>
              <td>{element.symbol}</td>
              <td>{element.shares}</td>
              <td>{element.shareValue.toFixed(2)}</td>
              <td>{element.date}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default History