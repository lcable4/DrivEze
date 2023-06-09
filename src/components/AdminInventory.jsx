import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHubs, hubInventory } from "../api-adapter/hub";
import { getAllVehicles } from "../api-adapter";
import { addCarToHubInventory, deleteCarFromHubInventory } from "../api-adapter/admin";



function AdminInventory(props)
{
    const navigate = useNavigate();
    const isAdmin = props.isAdmin;

    const [hubs, setHubs] = useState([]);
    const [hubInventories, setHubInventories] = useState([]);
    const [cars, setCars] = useState([]);

    const [shouldAddCarShow, setShouldShow] = useState(false);

    const [addCarHubId, setHubId] = useState(null);
    const [addCarLocation, setAddCarLocation] = useState("");

    useEffect(()=>
    {
        async function GetHubs()
        {
            const hub = await getAllHubs();
            const car = await getAllVehicles();
            setCars(car);
            console.log(car);
            const hubInventories = [];
            for(let i = 0; i<hub.length; i++)
            {
                hubInventories.push(await hubInventory(hub[i].id));
            }
            console.log(hubInventories)
            setHubs(hub);
            setHubInventories(hubInventories);
        }
        GetHubs();
    }, [])
    
    async function RemoveCar(carId, hubId)
    {
        let car;
        console.log(car = await deleteCarFromHubInventory(carId, hubId, localStorage.getItem("token")));
        if(car.id)
        {
            window.location.reload();
        }
    }

    function ShowData()
    {

        console.log(hubs);
        console.log(cars);
        const holder = [];
        for(let i = 0; i < hubInventories.length; i++)
            {
                const holder2 = [];
                for(let j = 0; j < hubInventories[i].length; j++)
                {   
                    
                    for(let k = 0; k < cars.length; k++)
                    {
                        if(hubInventories[i][j].carId === cars[k].id)
                        {
                        holder2.push(cars[k]);
                        }
                    }
                    
                } 
                holder.push(holder2);
            }
        console.log(holder);

        

        return (
            <div>
                {
                    hubs.map((hub, index)=>
                    {
                        return(
                            <div>
                            <h3 id="admin-location">{hub.location}</h3> <button id="addCarBtn" onClick={()=>{setShouldShow(true); setHubId(hub.id); setAddCarLocation(hub.location)}}>Add Car</button>
                            {
                                holder[index].map((vehicle, index) => (
                                    <div className="vehicleListing" key={vehicle.id}>
                                      <div className="vehicleImgBox">
                                        <img
                                          className="vehicleImg"
                                          src={vehicle.image}
                                          alt={vehicle.name}
                                        />
                                        <div className="vehicleName">
                                          <h3>{vehicle.name}</h3>
                                        </div>
                                      </div>
                                      <div className="vehicleDescription">
                                        <h3 className="vehicleDetails">Vehicle information:</h3>
                                        <h4 className="vehicleDetails">{vehicle.description}</h4>
                                        <br />
                      
                                        <h3 className="vehicleDetails">Daily rate:</h3>
                                        <h4 className="vehicleDetails">${vehicle.daily_rate}</h4>
                                        <br />
                                        <h3 className="vehicleDetails">Hub location</h3>
                                        <h4 className="vehicleDetails">{vehicle.hubLocation}</h4>
                                        <br />
                                        <button id="button" onClick={()=>RemoveCar(vehicle.id, hub.id)}>Remove</button>
                                      </div>
                                      </div>
                                      ))
                            }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    function ShowAddCar()
        {   

            async function AddCar(carId, hubId, token)
            {
                console.log(await addCarToHubInventory(carId, hubId, token));
                window.location.reload();
            }

            const holder = [];

            for(let i = 0; i < cars.length; i++)
            {
                if(cars[i].location !== addCarLocation)
                {
                    holder.push(cars[i]);
                }
            }

            return(
                <div>
                    <h1>Add A Car to {addCarLocation}</h1>
                    {
                        holder.map((vehicle, index) => (
                            <div className="vehicleListing" key={vehicle.id}>
                              <div className="vehicleImgBox">
                                <img
                                  className="vehicleImg"
                                  src={vehicle.image}
                                  alt={vehicle.name}
                                />
                                <div className="vehicleName">
                                  <h3>{vehicle.name}</h3>
                                </div>
                              </div>
                              <div className="vehicleDescription">
                                <h3 className="vehicleDetails">Vehicle information:</h3>
                                <h4 className="vehicleDetails">{vehicle.description}</h4>
                                <br />
              
                                <h3 className="vehicleDetails">Daily rate:</h3>
                                <h4 className="vehicleDetails">${vehicle.daily_rate}</h4>
                                <br />
                                <h3 className="vehicleDetails">Hub location</h3>
                                <h4 className="vehicleDetails">{vehicle.hubLocation}</h4>
                                <br />
                                <button id="button" onClick={()=>AddCar(vehicle.id, addCarHubId, localStorage.getItem("token"))}>Add</button>
                              </div>
                              </div>
                              ))
                    }
                </div>
            )
        }
    return(
        <div>
            {
                isAdmin? <div><div id="adminInv"><h1>Admin Inventory Page</h1></div> {shouldAddCarShow ? <ShowAddCar/> : <ShowData/>}</div>: navigate("/adminLogin")
            }
        </div>
    )
}

export default AdminInventory;