import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Label from "../../ui-containers-local/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import get from "lodash/get";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};

// onCardClick = () => {
// switch (item.status) {
//   case "INITIATED":
//     return `/tradelicense-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
//   default:
//     return `/tradelicence/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
// }
// };
// onCardClick = () => {

// }

class MeterReading extends React.Component {
  render() {
    const { consumptionDetails, onActionClick, classes } = this.props;
    return (
      <div>
        {consumptionDetails && consumptionDetails.length > 0 ? (
          consumptionDetails.map(item => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  <div>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={3}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_BILLING_PERIOD_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Label
                          labelName={item.billingPeriod}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={3}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Label
                          labelKey={item.meterStatus}
                          fontSize={14}
                          style={{ fontSize: 14 }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={3}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_LAST_READING_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Label
                          labelName={item.lastReading}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={3}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Label
                          labelName={item.lastReadingDate}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={3}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Label
                          labelName={item.currentReading}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={3}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Label
                          labelName={item.currentReadingDate.toLocaleDateString()}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={3}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Label
                          labelName={item.currentReading - item.lastReading}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
            <div className="no-assessment-message-cont">
              <Label
                labelKey={"No results Found!"}
                style={{ marginBottom: 10 }}
              />
              {/* <Button
                style={{
                  height: 36,
                  lineHeight: "auto",
                  minWidth: "inherit"
                }}
                className="assessment-button"
                variant="contained"
                color="primary"
                onClick={this.onButtonCLick}
              >
                <Label labelKey="NEW TRADE LICENSE" />
              </Button> */}
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const consumptionDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "consumptionDetails",
    []
  );
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, consumptionDetails };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path))
    // handleField: (screenKey, jsonPath, fieldKey, value) =>
    //   dispatch(handleField(screenKey, jsonPath, fieldKey, value))
  };
};
export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(MeterReading)
);