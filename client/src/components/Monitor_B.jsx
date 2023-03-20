import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getDatabase, ref, child, get, set, onValue, query, limitToLast, push } from 'firebase/database';
import { database } from '../config/firebase';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

var x, y;
const optionsDate = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const MonitorB = () => {
   const [returnedData, setReturnedData] = useState('');
   const [temp, setTemp] = useState(0);
   const [humi, setHumi] = useState(0);
   const [light, setLight] = useState(0);
   const [moisture, setMoisture] = useState(0);
   const [state, setState] = useState('Loading');
   const [mode, setMode] = useState('loading');
   const [relay, setRelay] = useState('loading');
   const [pump, setPump] = useState('loading');
   const [arrayData, setArrayData] = useState({});
   const [startDay, setStartDay] = useState('loading');
   const [plantType, setPlantType] = useState('loading');
   const [backgroundModeButton, setBackgroundModeButton] = useState('mode-btn shadow-button sm:text-[30px] text-[10px]');
   const [backgroundRelayButton, setBackgroundRelayButton] = useState('mode-btn shadow-button sm:text-[30px] text-[10px]');

   const [sendedStartDay, setSendedStartDay] = useState('dd/mm/yyyy');
   const [sendedPlantType, setSendedPlantType] = useState('');

   const [displayedBlock, setDisplayBlock] = useState('sm:text-lg text-[15px] font-serif font-black hidden');

   const [styleSensorBox, setStyleSensorBox] = useState('4xl:h-auto 3xl:h-auto 2xl:h-auto md:h-auto sm:h-auto temHumLight-largeScreen h-[160px] flex border-[#8AFD22] border-4 rounded-3xl p-3 bg-custom sm:mb-4 mt-[60px] sm:mt-3 shadow-square');

   var [fontSizeGraph, setFontSizeGraph] = useState(18);

   let [area, setArea] = useState('B');

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
         setPump(data.Pump);

         // Fix percentage value
         if (data.Moisture > 100) { setMoisture(100) };
         if (data.Moisture < 0) { setMoisture(0) };

         // Make condition for soil moisture
         if (data.Moisture <= 30) {
            setState(() => {
               return (<div className='sm:text-5xl text-[20px] text-red-500'>DRY</div>);
            });
         } else if (data.Moisture > 30 && data.Moisture <= 89) {
            setState(() => {
               return (<div className='sm:text-5xl text-[20px] text-[#03fc39]'>GOOD MOISTURE</div>);
            });
         } else {
            setState(() => {
               return (<div className='sm:text-5xl text-[20px] text-blue-600/100'>WET</div>);
            });
         }
         // Make condition for MODE button
         if ((data.Pump == 2) | (data.Pump == 3)) { // 1/15/2023 
            setMode(() => {
               setBackgroundModeButton('mode-btn shadow-button sm:text-[30px] text-[10px] on');
               return ('AUTO')
            });
         } else {
            setMode(() => {
               setBackgroundModeButton('mode-btn shadow-button sm:text-[30px] text-[10px]');
               return ('MANUAL')
            });
         }
         // Make condition for Relay button
         if ((data.Pump == 1) | (data.Pump == 3)) { // 1/16/2023
            setRelay(() => {
               setBackgroundRelayButton('mode-btn shadow-button sm:text-[30px] text-[10px] on');
               return ('ON')
            });
         } else {
            setRelay(() => {
               setBackgroundRelayButton('mode-btn shadow-button sm:text-[30px] text-[10px]');
               return ('OFF')
            });
         }
      });

      // const dbRef = ref(db, '/GraphOne/');
      var graphText = 'GraphTwo';
      // if (area == 'A') {
      //    graphText = 'GraphOne';
      // } else {
      //    graphText = 'GraphTwo';
      // }

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

   }, [data, area]);

   //console.log({TLLL:returnedData});
   // console.log({arrayData:arrayData});
   // console.log(mode);
   function handleChangeMode() { // 1/16/2023
      const db = getDatabase();
      const dbChild = ref(db, area);
      if (mode == 'AUTO') {
         set(child(dbChild, '/Pump'), 0);
      } else {
         set(child(dbChild, '/Pump'), 2);
      }
   }

   function handleCheck() { // 1/16/2023
      const db = getDatabase();
      const dbChild = ref(db, area);
      if ((returnedData.Pump == 0) || (returnedData.Pump == 1)) {
         if (relay == 'ON') {
            set(child(dbChild, '/Pump'), 0);
            setBackgroundRelayButton('mode-btn shadow-button sm:text-[30px] text-[10px]');
         } else {
            set(child(dbChild, '/Pump'), 1);
            setBackgroundRelayButton('mode-btn shadow-button sm:text-[30px] text-[10px] on');
         }
      } else {
         alert("<!> Turn off AUTO mode to toggle the Relay.");
      }
   }

   const arrayObject = Object.assign({}, arrayData);

   console.log({ array: arrayData });

   console.log({ KhuVuccc: area });

   let widthPage = window.innerWidth;
   useEffect(() => {
      if (window.innerWidth < 400) {
         setFontSizeGraph(10);
      } else {
         setFontSizeGraph(18)
      }
   }, [widthPage]);


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
   function handleOpenSetStartDatePlantType() {
      setDisplayBlock('sm:text-lg text-[15px] font-serif font-black flex-wrap');
      setStyleSensorBox('4xl:h-auto 3xl:h-auto 2xl:h-auto md:h-auto sm:h-auto temHumLight-largeScreen h-[160px] flex border-[#8AFD22] border-4 rounded-3xl p-3 bg-custom sm:mb-4 mt-[200px] sm:mt-[200px] shadow-square ');
   }

   function handleSetStartDatePlantType() {
      const db = getDatabase();
      const HistoryRef = ref(db, 'HistoryList2');
      const ChildRef = ref(db, area);
      const newPostRef = push(HistoryRef);
      const year = sendedStartDay.substring(0, 4);
      const month = sendedStartDay.substring(5, 7);
      const date = sendedStartDay.substring(8);
      const myDate = `${date}/${month}/${year}`;
      console.log({ myDate: myDate });
      set(newPostRef, {
         daystart: myDate.toString(),
         daystop: '',
         planttype: sendedPlantType,
      });
      set(child(ChildRef, '/Begin'), myDate.toString());
      set(child(ChildRef, '/type'), sendedPlantType);
      setDisplayBlock('sm:text-lg text-[15px] font-serif font-black hidden');
      setStyleSensorBox('4xl:h-auto 3xl:h-auto 2xl:h-auto md:h-auto sm:h-auto temHumLight-largeScreen h-[160px] flex border-[#8AFD22] border-4 rounded-3xl p-3 bg-custom sm:mb-4 mt-[80px] sm:mt-3 shadow-square ');
      location.reload();
   }

   function handleCloseSetStartDatePlantType() {
      setDisplayBlock('sm:text-lg text-[15px] font-serif font-black hidden');
      setStyleSensorBox('4xl:h-auto 3xl:h-auto 2xl:h-auto md:h-auto sm:h-auto temHumLight-largeScreen h-[160px] flex border-[#8AFD22] border-4 rounded-3xl p-3 bg-custom sm:mb-4 mt-[80px] sm:mt-3 shadow-square ');
   }

   function handleHarvest() {
      const db = getDatabase();
      const HistoryRef = ref(db, 'HistoryList2');
      const ChildRef = ref(db, area);
      const newPostRef = push(HistoryRef);
      const date = new Date();
      const day = date.toLocaleDateString();
      const hour = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      console.log({date: day + hour}); // 6/17/2022
      set(newPostRef, {
         daystart: startDay,
         daystop: day + " " + hour,
         planttype: plantType,
      });
   }

   console.log({ setStartDay: sendedStartDay });
   console.log({ sendedPlantType: sendedPlantType });
   return (
      <div className='w-[95%] flex md:justify-center justify-between flex-col p-4 bg-custom text-white'>
         <div className="h-24 flex-wrap p-3 sm:mb-[80px] mb-[10px] sm:mt-[150px] mt-[100px]">
            <div className="sm:text-lg text-[15px] font-serif font-black flex mb-2">
               <p className='underline decoration-2'>Area:</p>
               <select id='areas' value={area} className='w-[100px] sm:shadow-style shadow-style-small ml-3 sm:text-3xl text-[30px]' onChange={(e) => {
                  // const selectedArea = e.target.value;
                  // setArea(selectedArea);
                  // location.reload();
                  if (e.target.value != 'B') {
                     location = '/owner/dashboard/area/a';
                  }

               }}>
                  <option> A</option>
                  <option> B</option>
               </select>
            </div>
            <div className="sm:text-lg text-[15px] font-serif font-black flex mb-2">
               <p className='underline decoration-2'>Plant type:</p> <p className='sm:shadow-style shadow-style-small ml-3 sm:text-xl text-[15px]'>{plantType}</p></div>
            <div className="sm:text-lg text-[15px] font-serif font-black flex">
               <p className='underline decoration-2 flex justify-center items-center'>Day start:</p>
               <p className='sm:shadow-style shadow-style-small ml-3 sm:text-xl text-[15px] flex justify-center items-center'> {startDay} </p>
               <button
                  type='button'
                  onClick={handleOpenSetStartDatePlantType}
                  className='sm:w-auto sm:h-auto w-[50px] h-[20px] flex flex-row justify-center items-center sm:ml-[70%] ml-[10%] bg-[#2952e3] p-3 cursor-pointer mode-btn shadow-button sm:text-[30px] text-[10px]'
               >
                  <p className='text-white text-base font-semibold sm:text-[15px] text-[10px]'>
                     SET
                  </p>
               </button>
               <button
                  type='button'
                  onClick={handleHarvest}
                  className='sm:w-auto sm:h-auto w-[50px] h-[20px] flex flex-row justify-center items-center sm:ml-[2%] ml-[10px] bg-[#2952e3] p-3 cursor-pointer harvest-btn shadow-button-harvest sm:text-[30px] text-[10px]'
               >
                  <p className='text-white text-base font-semibold hover:text-[#e5237a] sm:text-[15px] text-[10px]'>
                     HARVEST
                  </p>
               </button>
            </div>
            <div className={displayedBlock}>
               <div className='flex'>
                  <form className='mt-3 w-auto'>
                     <lable className='underline decoration-2'>Set New Start Day:</lable>
                     <input type="date" className='border-none outline-none bg-transparent sm:shadow-style shadow-style-small ml-3 sm:text-[15px] text-[10px]' onChange={e => { setSendedStartDay(e.target.value) }} />
                     <br />
                     <lable className='underline decoration-2'>Set Plant type:</lable>
                     <input type="text" className='rounded-md outline-none sm:shadow-style shadow-style-small ml-3 sm:text-[15px] text-[10px]' required onChange={e => { setSendedPlantType(e.target.value) }} />
                  </form>
               </div>

               <div className='flex mt-4'>
                  <button
                     type='button'
                     onClick={handleSetStartDatePlantType}
                     className='m-2 sm:w-auto sm:h-auto flex flex-row justify-center items-center bg-[#2952e3] p-3 rounded-full cursor-pointer mode-btn shadow-button sm:text-[15px] text-[10px]'
                  >
                     <p className='sm:w-auto sm:h-auto w-[10px] h-[10px] flex flex-row justify-center items-center text-white text-base font-semibold'>OK</p>
                  </button>
                  <button
                     type='button'
                     onClick={handleCloseSetStartDatePlantType}
                     className='m-2 sm:w-auto sm:h-auto flex flex-row justify-center items-center bg-[#2952e3] p-3 rounded-full cursor-pointer mode-btn shadow-button sm:text-[15px] text-[10px]'
                  >
                     <p className='sm:w-auto sm:h-auto w-[10px] h-[10px] flex flex-row justify-center items-center text-white text-base font-semibold'>CLOSE</p>
                  </button>
               </div>
            </div>
         </div>

         <div className={styleSensorBox}>
            <div className="h-auto w-2/6 flex justify-center">
               <div className='sm:w-[160px] sm:h-[160px] w-[60px] h-[60px]'>
                  <p className="sm:text-lg text-[10px] font-serif font-black text-center">Temperature</p>
                  <hr className=' mt-2 mb-2' />
                  <p className='w-full h-full sm:text-5xl text-[20px] flex justify-center items-center sm:shadow-style shadow-style-small'>{temp} <p className='text-white'>°C</p></p>
               </div>
            </div>

            <div className="h-auto w-2/6 flex justify-center items-center">
               <div className='sm:w-auto sm:h-auto w-[60px] h-[60px]'>
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

            <div className="h-auto w-2/6 flex justify-center">
               <div className='sm:w-[160px] sm:h-[160px] w-[60px] h-[60px]'>
                  <p className="sm:text-lg text-[10px] font-serif font-black text-center">Light</p>
                  <hr className=' mt-2 mb-2' />
                  <p className='w-full h-full sm:text-5xl text-[20px] flex justify-center items-center sm:shadow-style shadow-style-small'>{light.toFixed(2)} <br /> <p className='text-white'>lx</p></p>

               </div>
            </div>
         </div>
         
         {/*Make moisture circle*/}
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

            {/*Make control button*/}
            <div className="sm:h-auto h-[200px] w-[49%] border-[#8AFD22] border-4 rounded-3xl p-3 bg-custom shadow-square">
               <div className='w-full h-1/3 flex justify-center items-center'>
                  <p className='sm:shadow-style-state shadow-style-state-small'>
                     {state}
                  </p>
               </div>
               <div className='w-full h-1/3 flex justify-center items-center'>
                  <button
                     type='button'
                     className={backgroundModeButton}
                     onClick={handleChangeMode}
                  >
                     {mode}
                  </button>
               </div>
               <div className='w-full h-1/3 flex justify-center items-center'>
                  <button
                     type='button'
                     className={backgroundRelayButton}
                     onClick={handleCheck}
                  >
                     {relay}
                  </button>
               </div>
            </div>
         </div>

         {/*Make graph*/}
         <div className='sm:h-auto h-[280px] border-[#8AFD22] border-4 rounded-3xl sm:pb-[80px] sm:pl-[10px] sm:pr-[10px] p-0 sm:mt-3 mt-0 bg-custom shadow-square'>
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

export default MonitorB;