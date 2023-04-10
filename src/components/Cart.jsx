import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart } from "../api-adapter/login&register";
import { getCarById, removeCarFromCart } from "../api-adapter/index";

function Cart() {
  const [data, setData] = useState([]);
  const [carDataArray, setCarDataArray] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const token = localStorage.getItem("token");

  // const totalCost = total;
  async function getCartData() {
    const cartData = await getCart(token);
    setData(cartData);
  }

  async function getCarData() {
    let newArray = [];
    if (data.length) {
      newArray = data.map((e) => {
        console.log(e);
        return getCarById(e.carId);
      });
      const carDataPromises = await Promise.all(newArray);
      setCarDataArray(carDataPromises);
    }
  }

  async function deleteCar(carId) {
    const deletedCar = await removeCarFromCart(token, carId);
    if (deletedCar) {
      window.location.reload();
    }
  }

  function getTotalCost() {
    if (carDataArray.length) {
      let sum = 0;
      carDataArray.forEach((e) => {
        console.log(e);
        sum += e.daily_rate;
      });
      setTotalSum(sum);
    }
  }

  useEffect(() => {
    getCartData();
  }, []);

  useEffect(() => {
    getCarData();
  }, [data]);

  useEffect(() => {
    getTotalCost();
  }, [carDataArray]);

  return (
    <>
      <div className="cartPage">
        <div className="allVehiclesPage">
          <div className="topCartDiv">
            <div className="cartTitle">
              <p>Cart!</p>
            </div>
            <div className="cartCheckout">
              <h4>total: ${totalSum}</h4>
              <Link to="/checkout" state={{ totalSum: totalSum }}>
                <button id="addToCartButton">Checkout</button>
              </Link>
            </div>
          </div>
          <div className="allVehiclesBottomDiv">
            {carDataArray.length ? (
              carDataArray.map((car, idx) => {
                console.log(car);
                return (
                  <div className="vehicleListing" key={`car idx: ${idx}`}>
                    <div className="vehicleImgBox">
                      <img
                        className="vehicleImg"
                        src={car.image}
                        alt={car.name}
                      />
                      <div className="vehicleName">
                        <h3>{car.name}</h3>
                      </div>
                    </div>
                    <div className="vehicleDescription">
                      <h3 className="vehicleDetails">Vehicle information:</h3>
                      <h4 className="vehicleDetails">{car.description}</h4>
                      <br />
                      <h3 className="vehicleDetails">Daily rate:</h3>
                      <h4 className="vehicleDetails">${car.daily_rate}</h4>
                      <br />
                      <h3 className="vehicleDetails">Hub location:</h3>
                      <h4 className="vehicleDetails">{car.hubLocation}</h4>
                      <br />
                    </div>
                    <button onClick={() => deleteCar(car.id)}>remove</button>
                  </div>
                );
              })
            ) : (
              <Link to="/vehicleList">
                <h3>Add A Vehicle To Cart!</h3>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Link to="/"> Go Back </Link>
    </>
  );
}

export default Cart;
