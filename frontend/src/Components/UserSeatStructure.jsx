
import { useContext, useEffect, useState } from "react";
import {  toast } from 'react-toastify';
import {AuthContext} from '../context/AuthProvider'
import instance from "../utils/axiosInstance";
import handlePayment from "../utils/handlePayment.js";
function UserSeatStructure({ seatsData }) {
  const [bookedSeat, setBookedSeat] = useState([]);
  const [seats, setSeats] = useState([]);
  const[totalCost,setToatalCost]=useState(0)
   const { user } = useContext(AuthContext);
  function toggleSeat(seat) {
    setBookedSeat(prev=>prev?.includes(seat)?prev?.filter((item)=>item!=seat):[...prev,seat])
    setSeats((prev) =>
      prev?.map((item) =>
        item.seatNumber == seat
          ? {
              ...item,
              seatNumber:seat,
              isBooked: !item.isBooked,
              bookedBy: item.bookedBy ? null : user._id,
            }
          : item,
      ),
    );

 setToatalCost((bookedSeat.length+1)*seatsData.Price||100)
  }

   async function bookMovi(){
    try {
       await handlePayment(totalCost,bookedSeat,seatsData._id)
        setBookedSeat([])
        setToatalCost(0)
      
    } catch (error) {
         toast.error(error?.response?.data?.message||"Something went wrong !")
    }
   }

  useEffect(() => {
    setSeats(seatsData.seatScreen);
  }, [seatsData]);
 
  return (
   <div className="flex flex-col gap-12">
   <div className="flex justify-center">
      {seats && (
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold">Booking Seats Structure</h3>
          <div className={`lg:w-[30vw] cursor-pointer flex flex-wrap gap-6 `}>
            {seats?.map((item) =>
              item.isBooked && item.bookedBy !== user._id ? (
                <p
                  key={item?._id}
                  className={`${item.bookedBy._id== user._id?"bg-green-600":"bg-red-600"}  text-white rounded-full border-2 flex justify-center items-center size-8`}
                >
                  {item.seatNumber}
                </p>
              ) : (
                <p
                  key={item?._id}
                  onClick={() =>
                    toggleSeat(item.seatNumber)
                  }
                  className={`${item.isBooked && "bg-yellow-600 text-white"} rounded-full border-2 flex justify-center items-center size-8`}
                >
                  {item.seatNumber}
                </p>
              ),
            )}
          </div>
        </div>
      )}
    </div>
     <div className='space-y-8'>
            <div className='flex text-xl font-semibold gap-16'>
               <p>selected Seats- <span>{bookedSeat?.length||0}</span></p>
               <p> Total Amount-  ${totalCost}</p>
            </div>
              <button onClick={bookMovi} disabled={bookedSeat?.length===0} className='px-16 py-2 disabled:bg-indigo-300 text-white rounded-lg bg-indigo-600 font-medium  '>Book Now</button>
          </div>
    </div>
  );
}

export default UserSeatStructure;
