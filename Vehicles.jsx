import React, { useEffect, useState, Fragment } from "react";
import { Grid, Button, CardContent, Card } from "@material-ui/core";
import { getCurrentVehicles } from "../../services/vehicleService";
import _logger from "sabio-debug";
import VehicleEditModal from "./VehicleEditModal";
import VehicleCard from "./VehicleCard";

const DisplayUserVehicles = () => {
  const [vehicles, setVehicles] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditVehicle, setCurrentEditVehicle] = useState();
  const [vehicleList, setVehicleList] = useState();

  useEffect(() => {
    setIsLoading(true);
    requestVehicles();
  }, []);

  const handleRequestSuccess = ({ items }) => {
    setVehicles(items);
    setVehicleList(items);
  };

  const handleRequestError = (e) => {
    _logger(e);
  };

  const requestVehicles = () => {
    getCurrentVehicles()
      .then(handleRequestSuccess)
      .catch(handleRequestError)
      .finally(() => setIsLoading(false));
  };

  const handleEditClick = (vehicle) => {
    setIsModalOpen(true);
    setCurrentEditVehicle(vehicle);
  };

  const mapper = (vehicle) => {
    return <VehicleCard></VehicleCard>;
  };

  return (
    <Fragment>
      <Card className="card-box mb-4 p-5">
        <h1 className="display-3 mb-2 font-weight-bold">Available Vehicles</h1>
        <Grid container spacing={4}>
          {vehicles?.map((vehicle) => (
            <Grid key={vehicle.id} item xs={12} md={6} lg={4}>
              <div className="card card-box-alt card-box-hover-rise card-box-hover mb-4">
                <CardContent className="p-3">
                  <div className="avatar-icon-wrapper avatar-icon-lg mr-2">
                    <div className="avatar-icon-lg">
                      <img
                        alt="..."
                        className="card-img-top"
                        src={vehicle.vehiclePicture}
                      />
                    </div>
                  </div>

                  <h3 className="heading-6 mt-4 mb-4">
                    {vehicle.year} {vehicle.make.name} {vehicle.model}{" "}
                  </h3>
                  <p className="card-text mb-4">
                    Max Passengers: <b>{vehicle.maxPassengers}</b>
                  </p>
                  <p className="card-text mb-4">
                    License: <b>{vehicle.licensePlate}</b>
                  </p>
                  <p className="card-text mb-4">
                    Color: <b>{vehicle.color}</b>
                  </p>
                  <Button
                    color="primary"
                    className="mt-1"
                    variant="contained"
                    title="Learn more"
                    onClick={() => handleEditClick(vehicle)}
                  >
                    <span>Edit Vehicle</span>
                  </Button>
                </CardContent>
              </div>
            </Grid>
          ))}
          {/* end of map */}
          <VehicleEditModal
            open={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            initialValue={currentEditVehicle}
          />
          {isLoading && <p>Vehicles Will be Here Soon</p>}
          {!vehicles && !isLoading && <p>No vehicles found</p>}
        </Grid>
      </Card>
      <VehicleCard vehicles={vehicleList} />;
    </Fragment>
  );
};

export default DisplayUserVehicles;
