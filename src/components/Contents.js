import { useState, useEffect } from 'react'
import axios from 'axios'

const Contents = () => {

  // 마운트되었을때 바로 실행하는 효과를 주기 위해
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr")
      console.log(res)
    }
    fetchEvents()
  })
  return (
    <section>
        <h2>국내 코로나 현황</h2>
        <div className="content">
        </div>
      </section>
  )
}

export default Contents
