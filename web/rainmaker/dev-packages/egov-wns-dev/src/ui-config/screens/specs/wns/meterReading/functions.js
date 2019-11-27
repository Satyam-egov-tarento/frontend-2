import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: JSON.parse(getUserInfo()).tenantId
    },
    { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "search"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
  } else if (
    (searchScreenObject["fromDate"] === undefined ||
      searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined &&
    searchScreenObject["toDate"].length !== 0
  ) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
        "warning"
      )
    );
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "daystart")
          });
        } else if (key === "toDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "dayend")
          });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }

    const response = await getSearchResults(queryObject);
    try {
      let data = response.Licenses.map(item => ({
        [getTextToLocalMapping("Application No")]:
          item.applicationNumber || "-",
        [getTextToLocalMapping("License No")]: item.licenseNumber || "-",
        [getTextToLocalMapping("Trade Name")]: item.tradeName || "-",
        [getTextToLocalMapping("Owner Name")]:
          item.tradeLicenseDetail.owners[0].name || "-",
        [getTextToLocalMapping("Application Date")]:
          convertEpochToDate(item.applicationDate) || "-",
        [getTextToLocalMapping("Status")]: item.status || "-",
        ["tenantId"]: item.tenantId
      }));

      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Trade License Applications"
          )} (${response.Licenses.length})`
        )
      );
      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
const getMdmsData = async () => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "citymodule" }]
        }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};
export const fetchData = async (action, state, dispatch) => {
  const response = await getSearchResults();
  const mdmsRes = await getMdmsData(dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "TL") return true;
    });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.citiesByModule.TL",
      tenants
    )
  );
  try {
    /*Mseva 1.0 */
    // let data =
    //   response &&
    //   response.Licenses.map(item => ({
    //     [get(textToLocalMapping, "Application No")]:
    //       item.applicationNumber || "-",
    //     [get(textToLocalMapping, "License No")]: item.licenseNumber || "-",
    //     [get(textToLocalMapping, "Trade Name")]: item.tradeName || "-",
    //     [get(textToLocalMapping, "Owner Name")]:
    //       item.tradeLicenseDetail.owners[0].name || "-",
    //     [get(textToLocalMapping, "Application Date")]:
    //       convertEpochToDate(item.applicationDate) || "-",
    //     tenantId: item.tenantId,
    //     [get(textToLocalMapping, "Status")]:
    //       get(textToLocalMapping, item.status) || "-"
    //   }));

    // dispatch(
    //   handleField(
    //     "home",
    //     "components.div.children.applyCard.children.searchResults",
    //     "props.data",
    //     data
    //   )
    // );
    /*Mseva 2.0 */

    if (response && response.Licenses && response.Licenses.length > 0) {
      dispatch(prepareFinalObject("searchResults", response.Licenses));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.Licenses.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
