import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Button } from "react-bootstrap";
import { RefreshCcw } from "react-feather";
import lookUpService from "services/lookUpService";
import loanAppsService from "../../services/loanApplicationsService";
import ApplicationCardTemplate from "./LoanAppCardTemplate";

import toastr from "toastr";
import locale from "rc-pagination/lib/locale/en_US";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

import debug from "sabio-debug";

const _logger = debug.extend("LoanAppListView");

function LoanAppListView() {
  _logger("Firing");

  const [pageData, setPageData] = useState({
    arrayOfApps: [],
    arrayOfAppsComponents: [],
    loanTypeId: 0,
    selectedOption: "",
    arrayOfLoanTypes: [],
    arrayOfLoanTypesComponents: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    query: undefined,
  });

  const resetPageData = () => {
    setPageData((prevState) => {
      const newState = { ...prevState };

      newState.pageIndex = 0;
      newState.loanTypeId = 0;
      newState.query = "";
      return newState;
    });
  };

  const handleLoanTypes = (e) => {
    _logger("e.target", e.target.value);
    const newValue = parseInt(e.target.value);

    setPageData((prevState) => {
      let newObj = { ...prevState };
      newObj.pageIndex = 0;

      newObj.loanTypeId = newValue;
      return newObj;
    });
  };

  const onPageChange = (page) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.pageIndex = page - 1;
      return newState;
    });
  };

  const handleSearchSubmit = (evt) => {
    evt.preventDefault();

    searchByUser(pageData.query);
  };

  const onFormFieldChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    setPageData((prevState) => {
      _logger("updater onChange");
      const newQueryObject = {
        ...prevState,
      };
      newQueryObject.query = event.target.value;

      return newQueryObject;
    });

    if (event.key === "Enter" || event.keyCode === 13 || event.which === 13) {
      searchByUser(event.target.value);
    }
  };

  const searchByUser = (query) => {
    loanAppsService
      .searchByUser(query, pageData.pageIndex, pageData.pageSize)
      .then(onSearchByUserSuccess)
      .catch(onSearchByUserError);
  };

  const mappingApplications = (aApplication) => {
    _logger("Application:", aApplication.id);
    return (
      <ApplicationCardTemplate
        app={aApplication}
        key={"Application_" + aApplication.id}
      />
    );
  };

  function mapLoanTypes(loan) {
    _logger("loan", loan);
    return (
      <option key={loan.id} name={loan.name} value={loan.id}>
        {loan.name}
      </option>
    );
  }

  useEffect(() => {
    lookUpService
      .getTypes3Col(["LoanTypes"])
      .then(onGetTypes3ColSuccess)
      .catch(onGetTypes3ColError);
  }, []);

  const onGetTypes3ColSuccess = (data) => {
    _logger("LoanTypes3Col:", data);
    let newLoanTypeArray = data.item.loanTypes;
    _logger("newLoanTypeArray -->", newLoanTypeArray);
    setPageData((prevState) => {
      const newSt = { ...prevState };
      newSt.arrayOfLoanTypes = newLoanTypeArray.map(mapLoanTypes);
      return newSt;
    });
  };

  const onGetTypes3ColError = (err) => {
    _logger(err, "Get Types Error");
    toastr.error("Type Get Call Failed");
  };

  useEffect(() => {
    _logger("useEffect firing");
    if (pageData.loanTypeId && !pageData.query) {
      loanAppsService
        .searchByType(
          pageData.pageIndex,
          pageData.pageSize,
          pageData.loanTypeId
        )
        .then(onSearchByTypeSuccess)
        .catch(onSearchByTypeError);
    } else if (!pageData.query) {
      loanAppsService
        .getLoanApps(pageData.pageIndex, pageData.pageSize)
        .then(onLoanAppsDataSuccess)
        .catch(onLoanAppsDataError);
    }
  }, [
    pageData.pageIndex,
    pageData.pageSize,
    pageData.loanTypeId,
    pageData.query,
  ]);

  const onLoanAppsDataSuccess = (data) => {
    _logger("Applications:", data);
    setPageData((prevState) => {
      const newSt = { ...prevState };
      newSt.totalCount = data.item.totalCount;
      newSt.arrayOfApps = data.item.pagedItems;
      newSt.arrayOfAppsComponents = newSt.arrayOfApps.map(mappingApplications);
      return newSt;
    });
  };

  const onLoanAppsDataError = (err) => {
    const errorCode = err.response.status;
    if (errorCode === 404) {
      toastr.error("No Applicants Found");
    } else {
      toastr.error("Error Occured");
    }
  };

  const onSearchByTypeSuccess = (data) => {
    _logger("Applications:", data);
    setPageData((prevState) => {
      const newSt = { ...prevState, arrayOfApps: [] };

      newSt.totalCount = data.item.totalCount;
      newSt.arrayOfApps = data.item.pagedItems;
      newSt.arrayOfAppsComponents = newSt.arrayOfApps.map(mappingApplications);
      return newSt;
    });
  };

  const onSearchByTypeError = (err) => {
    const errorCode = err.response.status;
    if (errorCode === 404) {
      setPageData((prevState) => {
        const newSt = { ...prevState };
        newSt.totalCount = 0;
        newSt.arrayOfApps = [];
        newSt.arrayOfAppsComponents =
          newSt.arrayOfApps.map(mappingApplications);
        return newSt;
      });
      toastr.error("No Loan Type Found");
    } else {
      toastr.error("Unknown Error Occured");
    }
  };

  const onSearchByUserSuccess = (data) => {
    _logger("Applications:", data);
    setPageData((prevState) => {
      const newSt = { ...prevState };
      newSt.totalCount = data.item.totalCount;
      newSt.arrayOfApps = data.item.pagedItems;
      newSt.arrayOfAppsComponents = newSt.arrayOfApps.map(mappingApplications);
      return newSt;
    });
  };

  const onSearchByUserError = (err) => {
    _logger(err.response.status, "onSearchByUserError");
    const errorCode = err.response.status;
    if (errorCode === 404) {
      setPageData((prevState) => {
        const newSt = { ...prevState };
        newSt.totalCount = 0;
        newSt.arrayOfApps = [];
        newSt.arrayOfAppsComponents =
          newSt.arrayOfApps.map(mappingApplications);
        return newSt;
      });
      toastr.error("No User Found");
    } else {
      toastr.error("Unknown Error Occured");
    }
  };
  return (
    <>
      <Card className='border-0'>
        <Card.Header>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <div>
              <h3 className='mb-0'>Loan Application Profiles</h3>
              <p className='mb-0'>
                Quickly retrieve detailed information about individuals Loan
                Applications
              </p>
            </div>
            <div className='flex-grow-1 d-flex justify-content-end'>
              <form className='d-flex' onSubmit={handleSearchSubmit}>
                <input
                  type='search'
                  className='form-control me-2'
                  id='searhId'
                  placeholder='Search'
                  aria-label='Search'
                  onChange={onFormFieldChange}
                  name='search'
                  value={pageData.query}
                />
                <select
                  onChange={handleLoanTypes}
                  value={pageData.loanTypeId}
                  className='form-select text-dark me-5'
                >
                  <option value='0'>Select Loan Types</option>
                  {pageData.arrayOfLoanTypes}
                </select>
                <Button
                  variant='btn btn-primary btn-xs'
                  onClick={resetPageData}
                  className=' me-2'
                >
                  <RefreshCcw />
                </Button>
              </form>
            </div>
          </div>
          <div className='pagination-container flex-grow-1 d-flex justify-content-end'>
            <Pagination
              onChange={onPageChange}
              current={pageData.pageIndex + 1}
              pageSize={pageData.pageSize}
              total={pageData.totalCount}
              locale={locale}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            />
          </div>
        </Card.Header>
        <Card.Body className='p-0 pb-5'>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className='table-responsive '>
                <Table className='text-nowrap'>
                  <thead className='table-light'>
                    <tr className='text-center align-middle'>
                      <th>Applicant</th>
                      <th>Loan Amount</th>
                      <th>Loan Term</th>
                      <th>Preferred Rate</th>
                      <th>Credit Score</th>
                      <th>Loan Type</th>
                      <th>Status</th>
                      <th>Business</th>
                      <th>{}</th>
                    </tr>
                    <tr>
                      <th colSpan='5'>
                        Showing {pageData.arrayOfAppsComponents.length} of{" "}
                        {pageData.totalCount} pagedItems
                      </th>
                      <th>{}</th>
                      <th>{}</th>
                      <th>{}</th>
                      <th>{}</th>
                    </tr>
                  </thead>
                  <tbody>{pageData.arrayOfAppsComponents}</tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default LoanAppListView;
