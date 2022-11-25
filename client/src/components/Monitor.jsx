import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getDatabase, ref, child, get, set, onValue, query, limitToLast } from 'firebase/database';
import { database } from '../config/firebase';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const percentage = 0;
const percentage1 = 0;
var x, y;
const optionsDate = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const Monitor = () => {
   const [returnedData, setReturnedData] = useState('');
   const [temp, setTemp] = useState(percentage);
   const [humi, setHumi] = useState(percentage1);
   const [light, setLight] = useState(0);
   const [moisture, setMoisture] = useState(0);
   const [state, setState] = useState('Loading');
   const [mode, setMode] = useState('loading');
   const [relay, setRelay] = useState('loading');
   const [arrayData, setArrayData] = useState({});
   const [startDay, setStartDay] = useState('loading');
   const [plantType, setPlantType] = useState('loading');
   var [fontSizeGraph, setFontSizeGraph] = useState(18);

   var [area, setArea] = useState('B');

   // const [graphData, setGraphData] = useState(arrayData);
   let data;
   useEffect(() => {
      var arrayData1 = [];
      const db = getDatabase();
      const starCountRef = ref(db, area);
      onValue(starCountRef, (snapshot) => {
         data = snapshot.val();
         setReturnedData(data);
         console.log({ data: data });
         setTemp(data.AirTempC);
         setHumi(data.AirHumidity);
         setLight(data.Light);
         setMoisture(data.Moisture);
         setMode(data.Auto);
         setRelay(data.Relay);
         setStartDay(data.Begin);
         setPlantType(data.type);

         // Make condition for soil moisture
         if (data.Moisture <= 20) {
            setState(() => {
               return (<div className='sm:text-5xl text-[20px] text-red-500'>DRY</div>);
            });
         } else if (data.Moisture > 20 && data.Moisture <= 70) {
            setState(() => {
               return (<div className='sm:text-5xl text-[20px] text-[#03fc39]'>GOOD MOISTURE</div>);
            });
         } else {
            setState(() => {
               return (<div className='sm:text-5xl text-[20px] text-blue-600/100'>WET</div>);
            });
         }
         // Make condition for MODE button
         if (data.Auto == 1) {
            setMode(() => {
               return ('AUTO')
            });
         } else {
            setMode(() => {
               return ('MANUAL')
            });
         }
         // Make condition for Relay button
         if (data.Relay == 1) {
            setRelay(() => {
               return ('ON')
            });
         } else {
            setRelay(() => {
               return ('OFF')
            });
         }
      });

      // const dbRef = ref(db, '/GraphOne/');
      var graphText;
      if (area == 'A') {
         graphText = 'GraphOne';
      } else {
         graphText = 'GraphTwo';
      }

      const recentPostsRef = query(ref(db, graphText), limitToLast(10));
      onValue(recentPostsRef, (snapshot) => {
         snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            y = childSnapshot.val().yValue;
            x = new Date(childSnapshot.val().xValue);
            const date = x.toLocaleDateString('en-GB', optionsDate);
            console.log(date);
            // console.log({x:x});
            // console.log({childSnapshot:childSnapshot.val()});
            arrayData1.splice(arrayData.length, 0, Object.assign({}, [date, childSnapshot.val().yValue]));
            Object.assign({}, arrayData1);
         });
         setArrayData(arrayData1);
      }, {
         onlyOnce: true
      });

   }, [data, area])

   //console.log({TLLL:returnedData});
   // console.log({arrayData:arrayData});
   // console.log(mode);
   function handleChangeMode() {
      const db = getDatabase();
      const dbChild = ref(db, area);
      if (mode == 'AUTO') {
         set(child(dbChild, '/Auto'), 0);
      } else {
         set(child(dbChild, '/Auto'), 1);
      }
   }

   function handleCheck() {
      const db = getDatabase();
      const dbChild = ref(db, area);
      if (returnedData.Auto == 0) {
         if (relay == 'ON') {
            set(child(dbChild, '/Relay'), 0);
         } else {
            set(child(dbChild, '/Relay'), 1);
         }
      } else {
         alert("Turn off AUTO mode to toggle the Realy!!!");
      }
   }

   const dataTest = [
      { name: "Fakce", value: 0 },
      { name: "rerewr", value: 0 },
      { name: "cacac", value: 0 },
      { name: "trtwe", value: 99 }
   ]

   const arrayObject = Object.assign({}, arrayData);
   console.log({ arrayObject: dataTest });
   console.log({ array: arrayData });

   console.log({ KhuVuccc: area });

   let widthPage = window.innerWidth;
   useEffect(() => {
      if (window.innerWidth < 400) {
         setFontSizeGraph(10);
      } else {
         setFontSizeGraph(18)
      }
   },[widthPage]);


   // useEffect(() => {
   //    if(data.Moisture_1 <= 20){
   //       setState('DRY');
   //    } else if(data.Moisture_1 > 20 && data.Moisture_1 <= 70) {
   //       setState('GOOD MOISTURE')
   //    } else {
   //       setState('WET')
   //    }
   // }, []);

   // get(child(dbRef, `Pump`)).then((snapshot) => {
   //    if (snapshot.exists()) {
   //       console.log(snapshot.val());
   //       returnedData = snapshot.val();
   //       setTemp(returnedData.AirTempC);
   //       setHumi(returnedData.AirHumidity);
   //    } else {
   //      console.log("No data available");
   //    }
   //  }).catch((error) => {
   //    console.error(error);
   //  });

   return (
      <div className='w-[95%] md:h-[1800px] xl:h-[1800px] sm:h-[1500px] h-[1000px] flex md:justify-center justify-between flex-col p-4 bg-custom text-white lg:max-h-[1400px]'>
         <div className="h-24 flex-wrap p-3 sm:mb-[80px] mb-[10px] sm:mt-[150px] mt-[100px]">
            <div className="sm:text-lg text-[15px] font-serif font-black flex mb-2">
               <p className='underline decoration-2'>Area:</p>
               <select id='areas' value={area} className='w-[100px] sm:shadow-style shadow-style-small ml-3 sm:text-3xl text-[30px]' onChange={(e)=>{
                  const selectedArea = e.target.value;
                  setArea(selectedArea);
                  // location.reload();
               }}>
                  <option value='A'>A</option>
                  <option value='B'>B</option>
               </select>
            </div>
            <div className="sm:text-lg text-[15px] font-serif font-black flex mb-2"> <p className='underline decoration-2'>Plant type:</p> <p className='sm:shadow-style shadow-style-small ml-3 sm:text-3xl text-[30px]'>{plantType}</p></div>
            <div className="sm:text-lg text-[15px] font-serif font-black flex"><p className='underline decoration-2'>Day start:</p> <p className='sm:shadow-style shadow-style-small ml-3 sm:text-3xl text-[30px]'> {startDay} </p> </div>
         </div>

         <div className="4xl:h-[600px] 3xl:h-[600px] 2xl:h-[600px] md:h-[600px] sm:h-[600px] temHumLight-largeScreen h-[160px] flex border-[#8AFD22] border-4 rounded-3xl p-3 bg-custom sm:mb-4 mt-[30px] sm:mt-3 shadow-square">
            <div className="h-auto w-2/6 flex justify-center items-center">
               <div className='sm:w-[160px] sm:h-[160px] w-[60px] h-[60px]'>
                  <p className="sm:text-lg text-[10px] font-serif font-black text-center">Temperature</p>
                  <hr className=' mt-2 mb-2' />
                  <p className='w-full h-full sm:text-5xl text-[20px] flex justify-center items-center sm:shadow-style shadow-style-small'>{temp}°C</p>
               </div>
            </div>

            <div className="h-auto w-2/6 flex justify-center items-center">
               <div className='sm:w-[160px] sm:h-[160px] w-[60px] h-[60px]'>
                  <p className="sm:text-lg text-[10px] font-serif font-black text-center">Humidity</p>
                  <hr className=' mt-2 mb-2' />
                  <CircularProgressbar
                     value={humi}
                     text={`${humi}%`}
                     className='sm:w-[160px] sm:h-[160px] w-[60px] h-[60px] static sm:shadow-style shadow-style-small circular-shadow'
                     strokeWidth={10}
                     styles={{
                        trail: {
                           strokeLinecap: 'butt',
                           fill: '#C9F8CB',
                           stroke: '#C9F8CB'
                        },
                        text: {
                           fill: '#6ad50c',
                        },
                        path: {
                           stroke: '#0CE328',
                        },
                     }}
                  />
               </div>
            </div>

            <div className="h-auto w-2/6 flex justify-center items-center">
               <div className='sm:w-[160px] sm:h-[160px] w-[60px] h-[60px]'>
                  <p className="sm:text-lg text-[10px] font-serif font-black text-center">Light</p>
                  <hr className=' mt-2 mb-2' />
                  <CircularProgressbar
                     value={light}
                     text={`${light}%`}
                     className='sm:w-[160px] sm:h-[160px] w-[60px] h-[60px] static sm:shadow-style shadow-style-small circular-shadow'
                     strokeWidth={10}
                     styles={{
                        trail: {
                           strokeLinecap: 'butt',
                           fill: '#C9F8CB',
                           stroke: '#C9F8CB'
                        },
                        text: {
                           fill: '#6ad50c',
                        },
                        path: {
                           stroke: '#0CE328',
                        },
                     }}
                  />
               </div>
            </div>
         </div>

         <div className="sm:h-80 h-[200px] flex sm:mt-3 flex justify-between sm:mb-4 mb-0">
            <div className="sm:h-auto h-[200px] w-[49%] flex-wrap border-[#8AFD22] border-4 rounded-3xl p-3 items-center justify-between bg-custom shadow-square">
               <p className='text-lg font-serif font-black text-center'>Soil moisture</p>
               <div className='w-full flex justify-center items-center'>
                  <hr className='mt-1 mb-1 sm:mt-2 sm:mb-2 w-[200px] ' />
               </div>
               <div className='w-full sm:h-[250px] h-[100px] flex justify-center items-center'>
                  <CircularProgressbar
                     value={moisture}
                     text={`${moisture}%`}
                     className='w-[100px] h-[100px] sm:w-[230px] sm:h-[230px] static sm:shadow-style shadow-style-small circular-shadow'
                     strokeWidth={10}
                     styles={{
                        trail: {
                           strokeLinecap: 'butt',
                           fill: '#C9F8CB',
                           stroke: '#C9F8CB'
                        },
                        text: {
                           fill: '#6ad50c',
                        },
                        path: {
                           stroke: '#0CE328',
                        },
                     }}
                  />
               </div>
            </div>

            <div className="sm:h-auto h-[200px] w-[49%] border-[#8AFD22] border-4 rounded-3xl p-3 bg-custom shadow-square">
               <div className='w-full h-1/3 flex justify-center items-center'>
                  <p className='sm:shadow-style-state shadow-style-state-small'>
                     {state}
                  </p>
               </div>
               <div className='w-full h-1/3 flex justify-center items-center'>
                  <button
                     type='button'
                     className='mode-btn shadow-button sm:text-[30px] text-[10px]'
                     onClick={handleChangeMode}
                  >
                     {mode}
                  </button>
               </div>
               <div className='w-full h-1/3 flex justify-center items-center'>
                  <button
                     type='button'
                     className='mode-btn shadow-button sm:text-[30px] text-[10px]'
                     onClick={handleCheck}
                  >
                     {relay}
                  </button>
               </div>
            </div>
         </div>

         <div className='sm:h-[800px] h-[280px] border-[#8AFD22] border-4 rounded-3xl sm:p-3 p-0 sm:mt-3 mt-0 bg-custom shadow-square'>
            <div className="sm:h-72 h-[200px] flex mt-3 flex-wrap justify-center items-center">
               <h1 className='sm:text-[30px]  text-[20px] mt-3 sm:shadow-style shadow-style-small'>Real-time soil moisture</h1>
               <ResponsiveContainer width="100%" height="100%" className='flex justify-center items-center'>
                  <LineChart
                     fontSize={fontSizeGraph}
                     width={800}
                     height={800}
                     data={arrayData}
                     margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 1,
                     }}
                  >
                     <CartesianGrid vertical="" horizontal="true" strokeDasharray="1" />
                     <XAxis tick={{ fill: "#8AFD22" }} name='Date' dataKey='0' tickSize={20} />
                     <YAxis name='%' tick={{ fill: "#8AFD22" }} color="#8AFD22" />
                     <Tooltip />
                     <Legend />
                     <Line
                        name='soil moisture'
                        type="monotone"
                        dataKey='1'
                        stroke="#8AFD22"
                        strokeWidth={3}
                        dot={{ fill: "#fff", stroke: "#8884d8", strokeWidth: 10, r: 5 }}
                        activeDot={{ r: 8 }}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
   );
}

export default Monitor;