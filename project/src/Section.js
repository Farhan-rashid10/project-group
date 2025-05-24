import React, { useState , useEffect} from 'react';
import { HomeIcon, UserGroupIcon, EmojiHappyIcon, CalendarIcon } from '@heroicons/react/solid';

const StatsSection = () => {
  const [count , setCount] = useState(0)
  const [counts , setCounts] = useState(0)
  const [time , settime] = useState(0)
  const [times , settimes] = useState(0)

  function handleClick(){   
      setCount(count + 3)
  }
  useEffect(()=>{
      if(count < 321){
      setTimeout(()=>setCount(count + 1), 50)
      }
  })
  useEffect(()=>{
      if(counts <35){
      setTimeout(()=>setCounts(counts + 1), 500)
      }
  })
  useEffect(()=>{
    if(time <1400){
    setTimeout(()=>settime(time + 1), 10)
    }
})
useEffect(()=>{
  if(times <15){
  setTimeout(()=>settimes(times + 1), 500)
  }
})
  return (
    <section className="bg-blue-500 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
        
        {/* Hospital Rooms */}
        <div>
          <HomeIcon className="h-12 w-12 mx-auto text-white" />
          <div className="text-4xl font-bold" onClick={handleClick}>{count}+</div>
          <div className="mt-2 text-xl">Hospital Rooms</div>
        </div>
        {/* Specialist Doctors */}
        <div>
          <UserGroupIcon className="h-12 w-12 mx-auto text-white" />
          <div className="text-4xl font-bold" onClick={handleClick}>{counts}+</div>
          <div className="mt-2 text-xl">Specialist Doctors</div>
        </div>

        {/* Happy Patients */}
        <div>
          <EmojiHappyIcon className="h-12 w-12 mx-auto text-white" />
          <div className="text-4xl font-bold" onClick={handleClick}>{time}</div>
          <div className="mt-2 text-xl">Happy Patients</div>
        </div>

        {/* Years of Experience */}
        <div>
          <CalendarIcon className="h-12 w-12 mx-auto text-white" />
          <div className="text-4xl font-bold" onClick={handleClick}>{times}</div>
          <div className="mt-2 text-xl">Years of Experience</div>
        </div>
        
      </div>
    </section>
  );
};

export default StatsSection;
