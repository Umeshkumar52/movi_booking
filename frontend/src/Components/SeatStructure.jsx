import { useState } from "react";

function SeatStructure({seatsData}) {
const[userData,setUserData]=useState(null)
  return (
    
      <div className="space-y-8">
        <h3 className="text-2xl font-semibold">Booking Seats Structure</h3>
        <div className={`lg:w-[40vw] cursor-pointer items-center flex flex-wrap gap-6 `}>
          {seatsData.seatScreen?.map((item) => <p
                key={item?._id}
               
                onMouseEnter={()=>setUserData(item?.bookedBy)}
                onMouseLeave={()=>setUserData(null)}
                className={`${ item.isBooked?"bg-red-600 text-white" :""}  rounded-full border-2 flex justify-center items-center size-8`}
              >
                {item.seatNumber}
              </p>
          )}
          {/* user info modal */}
         {userData&& <div className="absolute bg-slate-300 rounded-lg shadow-xl p-4" >
                  <ul>
                    <li>{userData._id}</li>
                     <li>{userData.FullName}</li>
                  </ul>
          </div>}
        </div>
      </div>
   
  );
}

export default SeatStructure;
