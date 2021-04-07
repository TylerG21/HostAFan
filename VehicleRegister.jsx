import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  InputLabel,
  Select,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import { register } from "../../services/vehicleService";
import _logger from "sabio-debug";
import vehicleSchema from "../../schemas/VehicleSchema";
import { getLookUpTables } from "../../services/lookupService";
import FileUpload from "../FileUpload";

const VehicleRegister = ({ currentUser }) => {
  const [vehicleMakes, setVehicleMakes] = useState();

  const registerFormData = {
    formData: {
      makeId: 0,
      model: "",
      year: null,
      maxPassengers: null,
      color: "",
      licensePlate: "",
      createdBy: currentUser.id,
      vehiclePicture: "",
    },
  };

  const requestVehicleTypes = () => {
    const lookUpSelect = ["vehicleTypes"];
    getLookUpTables(lookUpSelect).then(onGetLookUpSuccess).catch(onGlobalError);
  };

  const onGetLookUpSuccess = ({ item: { vehicleTypes } }) => {
    setVehicleMakes(vehicleTypes);
    _logger(vehicleTypes);
  };

  const onGlobalError = (error) => {
    _logger({ error });
  };

  const onVehicleSubmit = (values) => {
    let formValues = {
      ...values,
      makeId: parseInt(values.makeId),
      year: parseInt(values.year),
      maxPassengers: parseInt(values.maxPassengers),
    };
    register(formValues)
      .then(onRegisterVehicleSuccess)
      .catch(onRegisterVehicleError);
  };

  const onRegisterVehicleSuccess = (response) => {
    _logger({ vehicle: response }, "Vehicle Submit Successful");
  };

  const onRegisterVehicleError = (error) => {
    _logger({ vehicle: error }, "Vehicle Submit Error");
  };

  useState(() => {
    requestVehicleTypes();
  }, []);

  const updateURL = (url, setFieldValue) => {
    setFieldValue("VehiclePicture", url[0]);
  };

  return (
    <Fragment>
      <Card className="card-box mb-4 p-5">
        <h1 className="display-3 mb-2 font-weight-bold">Add Vehicle</h1>
        <Formik
          enableReinitialize={true}
          initialValues={registerFormData.formData}
          validationSchema={vehicleSchema}
          onSubmit={onVehicleSubmit}
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
                <Grid item xs={6} lg={4}>
                  <Grid xs={6}>
                    <InputLabel
                      htmlFor="outlined-roleId-native-simple"
                      className="m-2"
                      id="vehicleMakeLabel"
                    >
                      Make
                    </InputLabel>
                    <Select
                      className="m-2"
                      labelId="vehicleMakeLabel"
                      defaultValue="none"
                      value={values.makeId}
                      variant="outlined"
                      name="makeId"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {vehicleMakes?.map((vehicleMake) => {
                        return (
                          <MenuItem key={vehicleMake.id} value={vehicleMake.id}>
                            {vehicleMake.name}
                          </MenuItem>
                        );
                      })}
                    </Select>

                    <TextField
                      fullWidth
                      className="m-2"
                      id="outlined-basic"
                      label="model"
                      variant="outlined"
                      name="model"
                      values={values.model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.model && Boolean(errors.model)}
                      helperText={touched.model && errors.model}
                    />
                  </Grid>

                  <div
                    style={{
                      display: "inline-flex",
                      width: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      className="m-2"
                      id="outlined-basic"
                      label="year"
                      variant="outlined"
                      name="year"
                      values={values.year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.year && Boolean(errors.year)}
                      helperText={touched.year && errors.year}
                    />
                    <TextField
                      fullWidth
                      className="m-2"
                      id="outlined-basic"
                      label="color"
                      variant="outlined"
                      name="color"
                      values={values.color}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.color && Boolean(errors.color)}
                      helperText={touched.color && errors.color}
                    />
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      width: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      className="m-2"
                      id="outlined-basic"
                      label="Max Passengers"
                      variant="outlined"
                      name="maxPassengers"
                      values={values.maxPassengers}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.maxPassengers && Boolean(errors.maxPassengers)
                      }
                      helperText={touched.maxPassengers && errors.maxPassengers}
                    />
                    <TextField
                      fullWidth
                      className="m-2"
                      id="outlined-basic"
                      label="license Plate"
                      variant="outlined"
                      name="licensePlate"
                      values={values.licensePlate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.licensePlate && Boolean(errors.licensePlate)
                      }
                      helperText={touched.licensePlate && errors.licensePlate}
                    />
                  </div>
                  <FileUpload
                    isMultiple={true}
                    updateUrl={(resp) => updateURL(resp, setFieldValue)}
                  />
                  <Button
                    color="primary"
                    size="large"
                    variant="contained"
                    className="mb-5 pt-2"
                    label="Submit"
                    type="submit"
                    onClick={onVehicleSubmit}
                  >
                    Submit Vehicle
                  </Button>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </Fragment>
  );
};

VehicleRegister.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default VehicleRegister;
