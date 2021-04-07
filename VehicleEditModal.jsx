import React, { useState } from "react";
import {
  Button,
  Card,
  Modal,
  TextField,
  MenuItem,
  Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import _logger from "sabio-debug";
import vehicleSchema from "../../schemas/VehicleSchema";
import FileUpload from "../FileUpload";
import { editVehicle } from "../../services/vehicleService";
import { getLookUpTables } from "../../services/lookupService";

const VehicleEditModal = ({ open, setIsModalOpen, initialValue }) => {
  const [vehicleMakes, setVehicleMakes] = useState();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const updateURL = (url, setFieldValue) => {
    setFieldValue("vehiclePicture", url[0]);
  };

  const requestVehicleTypes = () => {
    const lookUpSelect = ["vehicleTypes"];
    getLookUpTables(lookUpSelect).then(onGetLookUpSuccess).catch(onGlobalError);
  };

  const onGlobalError = (error) => {
    _logger({ error });
  };

  const onGetLookUpSuccess = ({ item: { vehicleTypes } }) => {
    setVehicleMakes(vehicleTypes);
  };

  useState(() => {
    requestVehicleTypes();
  }, []);

  const onEditSubmit = (values) => {
    const updateData = {
      MakeId: values.make.id,
      Model: values.model,
      Year: values.year,
      MaxPassengers: values.maxPassengers,
      Color: values.color,
      LicensePlate: values.licensePlate,
      VehiclePicture: values.vehiclePicture,
    };

    editVehicle(updateData, initialValue.id)
      .then(onUpdateVehicleSuccess)
      .catch(onUpdateVehicleError);
  };

  const onUpdateVehicleSuccess = (response) => {
    _logger({ vehicle: response }, "Update Successful");
    setIsModalOpen(false);
  };

  const onUpdateVehicleError = (error) => {
    _logger({ error });
    _logger("Error Fired");
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        className="card-box"
        style={{ width: "500px", margin: "auto", marginTop: "15vh" }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialValue}
          validationSchema={vehicleSchema}
          onSubmit={onEditSubmit}
        >
          {(formikProps) => {
            const {
              values,
              touched,
              errors,
              setFieldValue,
              handleSubmit,
              handleChange,
              handleBlur,
            } = formikProps;

            return (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={3} className="p-5">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="make"
                      value={values.make.id}
                      onChange={(e) =>
                        setFieldValue(
                          "make",
                          vehicleMakes.find(
                            (make) => make.id === e.target.value
                          )
                        )
                      }
                    >
                      {vehicleMakes?.map((vehicleMake) => (
                        <MenuItem key={vehicleMake.id} value={vehicleMake.id}>
                          {vehicleMake.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="model"
                      variant="outlined"
                      name="model"
                      value={values.model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.model && Boolean(errors.model)}
                      helperText={touched.model && errors.model}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="year"
                      variant="outlined"
                      name="year"
                      value={values.year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.year && Boolean(errors.year)}
                      helperText={touched.year && errors.year}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="color"
                      variant="outlined"
                      name="color"
                      value={values.color}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.color && Boolean(errors.color)}
                      helperText={touched.color && errors.color}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Max Passengers"
                      variant="outlined"
                      name="maxPassengers"
                      value={values.maxPassengers}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.maxPassengers && Boolean(errors.maxPassengers)
                      }
                      helperText={touched.maxPassengers && errors.maxPassengers}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="License Plate"
                      variant="outlined"
                      name="licensePlate"
                      value={values.licensePlate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.licensePlate && Boolean(errors.licensePlate)
                      }
                      helperText={touched.licensePlate && errors.licensePlate}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FileUpload
                      name="vehiclePicture"
                      isMultiple={true}
                      value={values.vehiclePicture}
                      updateUrl={(resp) => updateURL(resp, setFieldValue)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      size="large"
                      variant="contained"
                      className="mb-5 pt-2"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="primary"
                      size="large"
                      variant="contained"
                      className="mb-5 pt-2"
                      label="Submit"
                      type="submit"
                      onClick={() => onEditSubmit(values)}
                    >
                      Update Vehicle
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </Modal>
  );
};

VehicleEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  initialValue: PropTypes.shape({
    id: PropTypes.number,
    makeId: PropTypes.string,
    model: PropTypes.string,
    year: PropTypes.number,
    maxPassengers: PropTypes.number,
    color: PropTypes.string,
    isRegistrationVerified: PropTypes.bool,
    licensePlate: PropTypes.string,
    vehiclePicture: PropTypes.string,
    createdBy: PropTypes.number,
  }),
};

export default VehicleEditModal;
