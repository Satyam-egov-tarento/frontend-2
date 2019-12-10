import { getMeterReadingData } from "../../../../ui-utils/commons"
import { getCommonHeader, getLabel, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    getCommonCard,
    getCommonTitle,
    convertDateToEpoch
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {

    getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
    prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { meterReadingEditable } from "./meterReading/meterReadingEditable";
import { getMdmsDataForMeterStatus } from "../../../../ui-utils/commons"
import { getMdmsDataForAutopopulated } from "../../../../ui-utils/commons"
import get from "lodash/get";


const addMeterReading = async (state, dispatch) => {
    await getMdmsDataForAutopopulated(dispatch)
    await getMdmsDataForMeterStatus(dispatch)
    await setAutopopulatedvalues(state, dispatch)
    showHideCard(true, dispatch);
};

const setAutopopulatedvalues = async (state, dispatch) => {

    let billingFrequency = get(state, "screenConfiguration.preparedFinalObject.billingCycle");
    let consumptionDetails = {};
    let status = get(state, "screenConfiguration.preparedFinalObject.meterMdmsData.tenant.tenants[0].name");
    let checkBillingPeriod = await get(state, "screenConfiguration.preparedFinalObject.consumptionDetails");
    if (checkBillingPeriod === undefined || checkBillingPeriod === []) {
        let date = new Date();
        console.log(date.getFullYear())
        if (billingFrequency === "quarterly") {
            let presYear = date.getFullYear();
            let prevYear = date.getFullYear() - 1;
            consumptionDetails['billingPeriod'] = 'Q1-' + prevYear + '-' + presYear.toString().substring(2);
        }
        if (billingFrequency === "monthly") {
            const month = date.toLocaleString('default', { month: 'long' });
            console.log(month)
        }
        consumptionDetails['lastReading'] = 0;
        consumptionDetails['consumption'] = 0;
        consumptionDetails['lastReadingDate'] = 0;


    } else {
        console.log("called")
         let prevDataIndex =get(state, "screenConfiguration.preparedFinalObject.consumptionDetailsCount");
        let prevBillingPeriod = get(state, `screenConfiguration.preparedFinalObject.consumptionDetails[${prevDataIndex-1}].billingPeriod`);
        let date = new Date();
        if (billingFrequency === "quarterly") {
            let preValue = prevBillingPeriod[1]
            if (preValue === "4") {
                let presYear = date.getFullYear();
                let prevYear = date.getFullYear() - 1;
                consumptionDetails['billingPeriod'] = 'Q1-' + prevYear + '-' + presYear.toString().substring(2);
                consumptionDetails['lastReading'] = 0
                consumptionDetails['consumption'] = 0;
                consumptionDetails['lastReadingDate'] = 0;

            } else {
                let newValue = parseInt(preValue) + 1
                let finalString = newValue.toString()
                let index = 1
                prevBillingPeriod = prevBillingPeriod.substr(0, index) + finalString + prevBillingPeriod.substr(index + 1);
                consumptionDetails['billingPeriod'] = prevBillingPeriod
            }
        }
        if (billingFrequency === "monthly") {
            let presYear = date.getFullYear();
            let prevDate = prevBillingPeriod.replace(/ .*/, '');
            let getDatefromString = new Date(prevDate + '-1-01').getMonth() + 1
            if (getDatefromString > 11) {
                date.setMonth(0)
                const month = date.toLocaleString('default', { month: 'short' });
                prevBillingPeriod = month + ' - ' + presYear
                consumptionDetails['billingPeriod'] = prevBillingPeriod
                consumptionDetails['lastReading'] = 0
                consumptionDetails['consumption'] = 0;
                consumptionDetails['lastReadingDate'] = 0;

            }
            date.setMonth(getDatefromString)
            const month = date.toLocaleString('default', { month: 'short' });
            prevBillingPeriod = month + ' - ' + presYear
            consumptionDetails['billingPeriod'] = prevBillingPeriod
        }


        consumptionDetails['lastReading'] = get(state, "screenConfiguration.preparedFinalObject.consumptionDetails[0].lastReading");
        consumptionDetails['consumption'] = get(state, "screenConfiguration.preparedFinalObject.consumptionDetails[0].lastReading");
        consumptionDetails['lastReadingDate'] = get(state, "screenConfiguration.preparedFinalObject.consumptionDetails[0].lastReadingDate");

    }


    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.firstContainer.children.billingCont.children.billingPeriod.props",
            "labelName",
            consumptionDetails.billingPeriod
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.thirdContainer.children.secCont.children.billingPeriod.props",
            "labelName",
            consumptionDetails.lastReading
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.lastReadingContainer.children.secCont.children.billingPeriod.props",
            "labelName",
 convertDateToEpoch(consumptionDetails.lastReadingDate, "dayend")
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
            "labelName",
            consumptionDetails.consumption
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status.props",
            "value",
            status
        )
    );

    dispatch(prepareFinalObject("autoPopulatedValues", consumptionDetails));

}

const queryValueAN = getQueryArg(window.location.href, "connectionNos");
console.log('123', queryValueAN)
const showHideCard = (booleanHideOrShow, dispatch) => {
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable",
            "visible",
            booleanHideOrShow
        )
    );
}
const header = getCommonContainer({
    header: getCommonHeader({
        labelKey: "WS_CONSUMPTION_DETAILS_HEADER"
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-wns",
        componentPath: "ConsumerNoContainer",
        props: {
            number: queryValueAN
        }
    },

    classes: {
        root: "common-header-cont"
    }

});

const screenConfig = {
    uiFramework: "material-ui",
    name: "meter-reading",
    beforeInitScreen: (action, state, dispatch) => {
        getMeterReadingData(dispatch);
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "meter-reading"
            },
            children: {
                header: header,
                newApplicationButton: {
                    componentPath: "Button",
                    gridDefination: {
                        xs: 12,
                        sm: 12,
                        align: "right"
                    },
                    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
                    props: {
                        variant: "contained",
                        color: "primary",
                        style: {
                            color: "white",
                            borderRadius: "2px",
                            width: "250px",
                            height: "48px",
                            margin: '9px'
                        }
                    },
                    children: {
                        // plusIconInsideButton: {
                        //     uiFramework: "custom-atoms",
                        //     componentPath: "Icon",
                        //     props: {
                        //         iconName: "add",
                        //         style: {
                        //             fontSize: "24px"
                        //         }
                        //     }
                        // },
                        buttonLabel: getLabel({
                            labelName: "ADD METER READING",
                            labelKey: "WS_CONSUMPTION_DETAILS_BUTTON_METER_READING"
                        }),
                    },
                    onClickDefination: {
                        action: "condition",
                        callBack: addMeterReading
                    }
                },
                meterReadingEditable,
                viewTwo: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "MeterReading"
                },
                // applicationsCard: {
                //     uiFramework: "custom-molecules-local",
                //     moduleName: "egov-wns",
                //     componentPath: "MeterReading"
                // },
            },
        }
    }
};

const demo = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Search Employee",
        labelKey: "HR_HOME_SEARCH_RESULTS_HEADING"
    }),
});

export default screenConfig;