/* eslint-disable */
import React from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { NavLink } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react";

import * as managerAPI from "api/Warehouse";
import { formatDate } from "views/util";

import { routePaths, routeLayout } from "routes";

const styles = {
  customCardContentClass: {
    paddingLeft: "0",
    paddingRight: "0",
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  createWarehouseIcon: {
    width: "100%",
    display: "flex",
    justifyContent: "right",
  },
};

const useStyles = makeStyles(styles);

export default function AddWarehouse(props) {
  const classes = useStyles();
  const defaultAddWarehouse = managerAPI.Warehouse;
  const defaultComponentState = {
    loading: true,
    apiCalled: false,
  };
  const editDialogDefaultState = {
    open: false,
    accountManagerID: 0,
    activeManager: defaultAddWarehouse,
    isSaving: false,
    messages: [],
  };
  const [editDialog, setEditDialog] = React.useState(editDialogDefaultState);
  const [componentState, setComponentState] = React.useState(
    defaultComponentState
  );
  const [warehouseData, setWarehouseData] = React.useState([]);
  const DeleteButton = (
    <Button simple round justIcon color="github">
      <DeleteIcon />
    </Button>
  );
  const VisibilityButton = (id, manager) => (
    <Button
      onClick={() =>
        props.history.push(
          routeLayout.vendor + routePaths.viewWarehouse + "/" + id
        )
      }
      simple
      round
      justIcon
      color="github"
    >
      <VisibilityIcon />
    </Button>
  );
  const openCreateDialog = () => {
    setEditDialog({
      ...editDialogDefaultState,
      open: true,
    });
  };
  if (componentState.apiCalled === false) {
    managerAPI.getWarehouse(
      (data) => {
        setWarehouseData(data);
      },
      (data) => {},
      () => {},
      "state=pending"
    );
    setComponentState({
      loading: false,
      apiCalled: true,
    });
  }

  const getTableData = () => {
    return warehouseData.map((item, index) => {
      return [
        index + 1,
        item.name,
        item.licenseNo,
        item.city.name,
        item.pincode,
        formatDate(item.availableFrom),
        formatDate(item.availableTo),
        VisibilityButton(item.warehouseVersionId, { ...item }),
      ];
    });
  };

  return (
    <div>
      <div className={classes.createWarehouseIcon}>
        <Fab
          onClick={openCreateDialog}
          aria-label="add"
          onClick={() =>
            props.history.push(routeLayout.vendor + routePaths.createWarehouse)
          }
        >
          <AddIcon />
        </Fab>
      </div>

      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardBody>
              {componentState.loading ? <p>Loading.....</p> : ""}
              {warehouseData.length > 0 ? (
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "#",
                    "Name",
                    "Lisence No",
                    "City",
                    "Pin-Code",
                    "Available From",
                    "Available To",
                    "View",
                  ]}
                  tableData={getTableData()}
                />
              ) : (
                <p>No Data </p>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
