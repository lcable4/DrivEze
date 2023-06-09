import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCar, getAllVehicles } from "../api-adapter";
import { getAllHubs } from "../api-adapter/hub";
import { updateCar } from "../api-adapter/admin";



function AdminCar(props)
{
    const navigate = useNavigate();
    const isAdmin = props.isAdmin;

    const [cars, setCars] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editCar, setEditCar] = useState({});
    const [hubs, setHubs] = useState([]);

    const [updateImgURL, setUpdateImgURL] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [updateDailyRate, setUpdateDailyRate] = useState(null);
    const [updateLocation, setUpdateLocation] = useState("");

    async function Delete(carId)
    {   
       const token = localStorage.getItem("token");
       const deleteResponse = await deleteCar(token, carId);
       console.log(deleteResponse);
       window.location.reload();
    }
    useEffect(()=>
    {
        async function allVehicles()
        {
            let cars = await getAllVehicles();
            const hub = await getAllHubs();
            setHubs(hub);
            setCars(cars);
            console.log(cars);
            console.log(hubs);
        }
        allVehicles();
    }, []);
    function CarData()
    {  
        return (
            <div>
                {
                    cars.map((vehicle, index)=>
                    (

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
                <button onClick={()=>Edit(vehicle)} id="button">edit</button>
                <button onClick={()=>Delete(vehicle.id)} id="button">delete</button>
                <br />
              </div>
              </div>
                    ))
                }
            </div>
        )
    }

    function Edit(car)
    {
        setShowEdit(true);
        setUpdateImgURL(car.image);
        setUpdateName(car.name);
        setUpdateDescription(car.description);
        setUpdateDailyRate(car.daily_rate);
        setUpdateLocation(car.hubLocation);
        setEditCar(car)
    }

    async function Update()
    {
        e.preventDefault();
        console.log("here")
        console.log(await updateCar(localStorage.getItem("token"), {carId:editCar.id,image:updateImgURL, name:updateName, description:updateDescription, daily_rate:updateDailyRate, hubLocation:updateLocation}));
        window.location.reload();
    }

    function EditInfo(vehicle)
    {

        const locationOptions = [];
        
        for(let i = 0; i <  hubs.length; i++)
        {
            if(hubs[i].location !== vehicle.location) locationOptions.push(hubs[i])
        }
        
        return(
            <div id="editForm">
                <form onSubmit={Update}>
                    <label>Image URL:
                    <input
                        type="text"
                        name="imageURL"
                        value={updateImgURL}
                        onChange={(event)=>setUpdateImgURL(event.target.value)}             
                    />
                    </label>
                    <br/>
                    <label>
                        Name:
                        <input id="vehicleName"
                            type="text"
                            name="name"
                            value={updateName}
                            onChange={(event)=>setUpdateName(event.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                        Description:
                        <input id="vehicleDescription" 
                            type="text"
                            name="description"
                            value={updateDescription}
                            onChange={(event)=>setUpdateDescription(event.target.value)}
                            style={{height:"60px"}}/>
                    </label>
                    <br/>
                    <label>
                        Daily Rate:
                        <input id="vehicleRate"
                            type="text"
                            name="dailyRate"
                            value={updateDailyRate}
                            onChange={(event)=>setUpdateDailyRate(event.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                        Hub:
                        <select id="vehicleLocation" onChange={(event)=>setUpdateLocation(event.target.value)}>
                            <option>{updateLocation}</option>
                            {
                                locationOptions.map((hub, index)=>
                                {
                                    return(
                                        <option>{hub.location}</option>
                                    )
                                })
                            }
                        </select>
                    </label>
                    <br/>
                    <button id="button" type="cancel">Back</button>
                    <button id="button" type="submit">Update</button>
                </form>
            </div>
        )
    }

    return(
        // <div style={{display:"flex", flexDirection:"column", position:"relative",}}>
        <div>
            {
                        showEdit? <div style={{position: "fixed"}}>{EditInfo(editCar)}</div> : null
            }
            <div id="admin-car-header">
            <h1 id="admin-location">Admin Cars Page</h1>
            <button id="addCarsBtn" onClick={()=>navigate("/adminAddCar")}>Add Car</button>
            </div>
            {
                isAdmin?
                <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}> 
                    <div className="allVehiclesPage">
                        <div className="allVehiclesBottomDiv" style={{height:"80vh", width:"100%"}}>
                            <CarData/>
                        </div>
                    </div>
                    
                </div>
                
                    :
                    navigate("/adminLogin")
            }
        </div>
    )
}

export default AdminCar;