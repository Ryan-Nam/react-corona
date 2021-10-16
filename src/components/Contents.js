import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar, Doughnut, Line} from 'react-chartjs-2'

const Contents = () => {


    // useState(초기값) - {} -object로 날릴것이기 때문
    const [confirmedData, setConfirmedData] = useState({
      // labels: ["1월", "2월", "3월"],
      // datasets: [
      //     {
      //       label: "국내 누적 확진자", 
      //       backgroundColor: "salmon", 
      //       fill: true, 
      //       data: [10, 5, 3]
      //     }, 
      //   ]
    })

    // Second Graph (Line)
    const [quarantedDate, setQuarantedDate] = useState({})

    // Third Grapht
    const [comparedData, setComparedData] = useState({})

  // 마운트되었을때 바로 실행하는 효과를 주기 위해
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("https://api.covid19api.com/total/dayone/country/au")
      makeData(res.data)
    }
    const makeData = (items) => {
      // items.forEach(item => console.log(item))
      const arr = items.reduce((acc, cur)=> {
        // .Date: "2021-10-24T00:00:00Z"   => like this so messy, 
        // need modification!!!
        const currentDate = new Date(cur.Date);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();


        const confirmed = cur.Confirmed;
        const active = cur.Active;
        const death = cur.Deaths;
        const recovered = cur.Recovered;


        const findItem = acc.find(a=> a.year === year && a.month === month);

        if(!findItem){
          // push
          // year: year, month: month
          acc.push({year, month, date, confirmed, active, death, recovered})
        }
        if(findItem && findItem.date < date){
          findItem.active = active;
          findItem.death = death;
          findItem.date = date;
          findItem.year = year;
          findItem.month = month;
          findItem.recovered = recovered;
          findItem.confirmed = confirmed;
        }

        // console.log(year, month, date)
        return acc;
      }, [])


      // Tip!  Arraow 에서 {} 사용하면 return 필요.
      // However , if it is only one line, no need to use 'return' 

      // Update 
      const labels = arr.map(a=> `${a.month + 1}월`);
      setConfirmedData({
      labels: labels, //["1월", "2월", "3월"], // ㅣlabels: labels 같으므로 labels 로 가능
      datasets: [
          {
            label: "국내 누적 확진자", 
            backgroundColor: "salmon", 
            fill: true, 
            data: arr.map(a=>a.confirmed) //[10, 5, 3]
          }, 
        ]
      });

      // Line Graph
      setQuarantedDate({
        labels: labels, 
        datasets: [
            {
              label: "월별 격리자 현황", 
              borderColor: "salmon", 
              fill: false, // no fill
              data: arr.map(a=>a.active) //[10, 5, 3]
            }, 
          ]
        });

        //Third
        const last = arr[arr.length - 1];
        setComparedData({
        labels: ["확진자", "격리해제", "사망"], 
        datasets: [
            {
              label: "누적 확진, 해제, 사망 비율", 
              backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
              borderColor: ["#ff3d67", "#059bff", "#ffc233"],
              fill: false, // no fill
              data: [last.confirmed, last.recovered, last.death]
            }, 
          ]
        });


      // console.log(arr);
      // Best way to get the data is,, these data will be delivered from server like this way at the begining
      // but sometimes, we have to know how to modify this data for our purpose as well 
      // in this stage, map,reduce, filter method is crutial
    }

    fetchEvents()
  }, [])   // !!!****** Important , '[]' must use, other wise, borwser will keep bring api data
  return (
    <section>
        <h2>Coronavirus (COVID-19) case numbers and statistics</h2>
        <div className="contents">
          <div>
            <Bar data={confirmedData} options={
              { 
                title: { display: true, text: "Total: cases ", fontSize: 16 },
                legend: { display: true, position: "bottom" },
              }
          } />

            <Line data={quarantedDate} options={
              { 
                title: { display: true, text: "월별 격리자 현황", fontSize: 16 },
                legend: { display: true, position: "bottom" },
              }
          } />


            <Doughnut data={comparedData} options={
              { 
                title: { display: true, text: `누적 확진, 해제, 사망 (${new Date().getMonth()+1}월)`, fontSize: 16 },
                legend: { display: true, position: "bottom" },
              }
          } />
            {/* <Bar data={confirmedData} options={
              {  
                title: { display: true, text:"누적 확진자 추이", fontsize:16, },
                legend: { display: true, position:"bottom" },
              }
          } /> */}
          </div>
        </div>
      </section>
  )
}

export default Contents
